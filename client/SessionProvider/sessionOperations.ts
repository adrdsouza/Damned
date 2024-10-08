import { createUrlGenerator } from '@woographql/session-utils';
import type { TokenManager } from '@woographql/session-utils';
import type { SessionOperations, Customer } from '@woographql/react-hooks';
import { apiCall } from '@/utils/apiCall';
import { PaymentTokenCC, Customer as CustomerType, Cart } from '@/graphql';
import { useSession } from './SessionProvider';
import { useSelector } from 'react-redux';
import { getShippingRate } from '@/lib/graphql';
import { getLocalStorageItem } from '@/components/utils';

type LoginResponse = {
  authToken: string;
  refreshToken: string;
  sessionToken: string;
  customer: Customer;
  cart: Cart;
};

type FetchSessionResponse = {
  cart: Cart;
  customer: Customer;
  sessionToken: string;
};

type FetchCartResponse = {
  cart: Cart;
  sessionToken: string;
};

type FetchCustomerResponse = {
  customer: Customer;
  sessionToken: string;
};

type SuccessResponse = {
  success: boolean;
};

const generateUrl = createUrlGenerator(
  process.env.BACKEND_URL as string,
  'transfer-session'
);

const fixCart = async (cart: Cart) => {
  console.log('hello form fixcart');

  try {
    const currentCountry: any = getLocalStorageItem('currentCountry');
    console.log(currentCountry);
    if (!currentCountry || currentCountry === '') {
      return cart;
    }

    const isUSRegion =
      currentCountry === 'US' ||
      currentCountry === 'GU' ||
      currentCountry === 'PR';

    if (isUSRegion) {
      return cart;
    }

    const shippingRate = {
      instanceId: 41,
      methodId: 'flat_rate',
      cost: '20.00',
      id: 'flat_rate:41',
      label: 'DHL Packet or equivalent (7-30 days)',
    };

    if (
      cart?.total === '0.00' &&
      //@ts-ignore
      cart?.chosenShippingMethods[0] === 'free_shipping:14' &&
      cart?.appliedCoupons !== null
    ) {
      return cart;
    }

    // const shippingRate = await getShippingRate(currentCountry);
    // if (!shippingRate) {
    //   return cart;
    // }

    const updatedCart = {
      ...cart,
      chosenShippingMethods: [shippingRate.id],
      availableShippingMethods: [
        {
          //@ts-ignore
          packageDetails: cart?.availableShippingMethods[0]?.packageDetails,
          supportsShippingCalculator: true,
          rates: [shippingRate],
        },
      ],
      shippingTotal: `$${shippingRate.cost}`,
      total: `${(
        parseFloat(cart?.subtotal?.replace('$', '') as string) +
        parseFloat(shippingRate.cost) -
        parseFloat(cart?.discountTotal?.replace('$', '') as string)
      ).toFixed(2)}`,
    };

    return updatedCart;
  } catch (error) {
    console.log(error);
  }
};

export function createSessionOperations(
  tokenManager: TokenManager
): SessionOperations {
  return {
    fetchSessionData: (state, dispatch) => async () => {
      const tokens = tokenManager.getTokens();
      console.log('fetching session data...');
      const { sessionToken, cart, customer } =
        await apiCall<FetchSessionResponse>('/api/session', {
          method: 'POST',
          body: JSON.stringify({
            sessionToken: tokens?.sessionToken,
            authToken: tokens?.authToken,
          }),
          cache: 'no-store',
        });

      tokenManager.saveTokens({ sessionToken });
      const clientSessionId = tokenManager.getClientSessionId();

      let fixedCart;
      if ((cart.contents?.itemCount as number) > 0) {
        fixedCart = await fixCart(cart);
        console.log('fixed cart from session api', fixedCart);
        //dispatch({ type: 'UPDATE_STATE', payload: { cart: fixedCart } });
        //return fixedCart;
      } else {
        fixedCart = cart;
      }

      dispatch({
        type: 'UPDATE_STATE',
        payload: {
          cart: fixedCart,
          customer,
        },
      });

      return { fixedCart, customer };
    },
    updateCart: (state, dispatch) => async (input) => {
      const tokens = tokenManager.getTokens();
      // if (input?.updateShippingRate) {
      //   const fixedCart = await fixCart(input?.cart);
      //   console.log('fixed cart when country change', fixedCart);
      //   dispatch({ type: 'UPDATE_STATE', payload: { cart: fixedCart } });
      //   return fixedCart;
      //   //dispatch({ type: 'UPDATE_STATE', payload: { cart: input?.cart } });
      //   //return input?.cart;
      // }

      console.log('updating Cart...');
      const { sessionToken, cart } = await apiCall<FetchCartResponse>(
        '/api/cart',
        {
          method: 'POST',
          body: JSON.stringify({
            sessionToken: tokens?.sessionToken,
            authToken: tokens?.authToken,
            input,
          }),
          cache: 'no-cache',
        }
      );
      console.log('response cart', cart);
      tokenManager.saveTokens({ sessionToken });

      if ((cart.contents?.itemCount as number) > 0) {
        const fixedCart = await fixCart(cart);
        console.log('fixed cart', fixedCart);
        dispatch({ type: 'UPDATE_STATE', payload: { cart: fixedCart } });
        return fixedCart;
      }

      //tokenManager.saveTokens({ sessionToken });
      dispatch({ type: 'UPDATE_STATE', payload: { cart } });
      return cart;
    },
    updateCustomer: (state, dispatch) => async (input) => {
      const tokens = tokenManager.getTokens();
      const { sessionToken, customer } = await apiCall<FetchCustomerResponse>(
        '/api/customer',
        {
          method: 'POST',
          body: JSON.stringify({
            sessionToken: tokens?.sessionToken,
            authToken: tokens?.authToken,
            input,
          }),
          cache: 'no-store',
        }
      );

      tokenManager.saveTokens({ sessionToken });
      dispatch({ type: 'UPDATE_STATE', payload: { customer } });

      return customer;
    },
    login: (state, dispatch) => async (input) => {
      const tokens = tokenManager.getTokens();
      const body = { ...input } as unknown & { sessionToken?: string };

      // If
      const itemCount = state.cart?.contents?.itemCount;

      if (itemCount && itemCount > 0) {
        body.sessionToken = tokens.sessionToken;
      }

      try {
        const { sessionToken, authToken, refreshToken, customer, cart } =
          await apiCall<LoginResponse>('/api/login', {
            method: 'POST',
            body: JSON.stringify(body),
            next: { revalidate: 10 },
          });

        tokenManager.saveTokens({ sessionToken, authToken, refreshToken });

        dispatch({
          type: 'UPDATE_STATE',
          payload: {
            customer,
            cart,
          },
        });

        return customer;
      } catch (err) {
        dispatch({
          type: 'UPDATE_STATE',
          payload: { fetching: false },
        });
        return (err as Error).message as any;
      }
    },
    logout: (state, dispatch) => async () => {
      const itemCount = state.cart?.contents?.itemCount;
      if (!itemCount || itemCount === 0) {
        return;
      }
      const tokens = tokenManager.getTokens();
      await apiCall<FetchCartResponse>('/api/cart', {
        method: 'POST',
        body: JSON.stringify({
          sessionToken: tokens?.sessionToken,
          authToken: tokens?.authToken,
          input: {
            mutation: 'emptyCart',
            input: { clearPersistentCart: true },
          },
        }),
        cache: 'no-store',
      });
    },
    sendPasswordReset: (state, dispatch) => async (username) => {
      const { success } = await apiCall<SuccessResponse>('/api/send-reset', {
        method: 'POST',
        body: JSON.stringify({ username }),
        cache: 'no-cache',
      });

      return success;
    },
  };
}

// const dummyCart = {
//   contents: {
//     itemCount: 1,
//     nodes: [
//       {
//         key: '55d60e3a0cb335e1c645d85c5c175c07',
//         product: {
//           node: {
//             id: 'cHJvZHVjdDo0OTM4Ng==',
//             databaseId: 49386,
//             name: 'Osiris cleaver',
//             slug: 'osiris-cleaver',
//             type: 'VARIABLE',
//             image: {
//               id: 'cG9zdDo0OTM4Mw==',
//               sourceUrl:
//                 'https://admin.damneddesigns.com/wp-content/uploads/DSC_3389-01-01-800x600.jpeg',
//               altText: '',
//             },
//             price: '$70.00',
//             regularPrice: '$70.00',
//             salePrice: null,
//             stockStatus: 'IN_STOCK',
//             stockQuantity: null,
//             soldIndividually: false,
//           },
//         },
//         variation: {
//           attributes: [
//             {
//               id: 'NTE2NzB8fHR5cGV8fFZHMTAsIEZSTiBzY2FsZXM=',
//               label: 'Type',
//               name: 'type',
//               value: 'VG10, FRN scales',
//             },
//           ],
//           node: {
//             id: 'cHJvZHVjdF92YXJpYXRpb246NTE2NzA=',
//             databaseId: 51670,
//             name: 'Osiris cleaver - VG10, FRN scales',
//             slug: 'osiris-cleaver-vg10-frn-scales',
//             type: 'VARIATION',
//             image: {
//               id: 'cG9zdDo0OTM4Mw==',
//               sourceUrl:
//                 'https://admin.damneddesigns.com/wp-content/uploads/DSC_3389-01-01-800x600.jpeg',
//               altText: '',
//             },
//             price: '$70.00',
//             regularPrice: '$70.00',
//             salePrice: null,
//             stockStatus: 'IN_STOCK',
//             stockQuantity: 336,
//             soldIndividually: null,
//           },
//         },
//         quantity: 1,
//         total: '$70.00',
//         subtotal: '$70.00',
//         subtotalTax: '$0.00',
//         extraData: [
//           {
//             key: 'csr_expire_time',
//             value: '1727998022',
//           },
//           {
//             key: 'csr_expire_time_text',
//             value: '30 minutes',
//           },
//         ],
//       },
//     ],
//   },
//   appliedCoupons: null,
//   needsShippingAddress: true,
//   chosenShippingMethods: ['flat_rate:36'],
//   availableShippingMethods: [
//     {
//       packageDetails: 'Osiris cleaver - VG10, FRN scales ×1',
//       supportsShippingCalculator: true,
//       rates: [
//         {
//           id: 'flat_rate:36',
//           instanceId: 36,
//           methodId: 'flat_rate',
//           label: 'USPS Ground advantage (or equivalent)',
//           cost: '8.00',
//         },
//       ],
//     },
//   ],
//   subtotal: '$70.00',
//   subtotalTax: '$0.00',
//   shippingTax: '$0.00',
//   shippingTotal: '$8.00',
//   total: '78.00',
//   totalTax: '$0.00',
//   feeTax: '$0.00',
//   feeTotal: '$0.00',
//   discountTax: '$0.00',
//   discountTotal: '$0.00',
// };

// const couponCart = {
//   contents: {
//     itemCount: 1,
//     nodes: [
//       {
//         key: '55d60e3a0cb335e1c645d85c5c175c07',
//         product: {
//           node: {
//             id: 'cHJvZHVjdDo0OTM4Ng==',
//             databaseId: 49386,
//             name: 'Osiris cleaver',
//             slug: 'osiris-cleaver',
//             type: 'VARIABLE',
//             image: {
//               id: 'cG9zdDo0OTM4Mw==',
//               sourceUrl:
//                 'https://admin.damneddesigns.com/wp-content/uploads/DSC_3389-01-01-800x600.jpeg',
//               altText: '',
//             },
//             price: '$70.00',
//             regularPrice: '$70.00',
//             salePrice: null,
//             stockStatus: 'IN_STOCK',
//             stockQuantity: null,
//             soldIndividually: false,
//           },
//         },
//         variation: {
//           attributes: [
//             {
//               id: 'NTE2NzB8fHR5cGV8fFZHMTAsIEZSTiBzY2FsZXM=',
//               label: 'Type',
//               name: 'type',
//               value: 'VG10, FRN scales',
//             },
//           ],
//           node: {
//             id: 'cHJvZHVjdF92YXJpYXRpb246NTE2NzA=',
//             databaseId: 51670,
//             name: 'Osiris cleaver - VG10, FRN scales',
//             slug: 'osiris-cleaver-vg10-frn-scales',
//             type: 'VARIATION',
//             image: {
//               id: 'cG9zdDo0OTM4Mw==',
//               sourceUrl:
//                 'https://admin.damneddesigns.com/wp-content/uploads/DSC_3389-01-01-800x600.jpeg',
//               altText: '',
//             },
//             price: '$70.00',
//             regularPrice: '$70.00',
//             salePrice: null,
//             stockStatus: 'IN_STOCK',
//             stockQuantity: 336,
//             soldIndividually: null,
//           },
//         },
//         quantity: 1,
//         total: '$56.00',
//         subtotal: '$70.00',
//         subtotalTax: '$0.00',
//         extraData: [
//           {
//             key: 'csr_expire_time',
//             value: '1728000898',
//           },
//           {
//             key: 'csr_expire_time_text',
//             value: '30 minutes',
//           },
//         ],
//       },
//     ],
//   },
//   appliedCoupons: [
//     {
//       code: 'kickstarter',
//       discountAmount: '$14.00',
//       discountTax: '$0.00',
//     },
//   ],
//   needsShippingAddress: true,
//   chosenShippingMethods: ['flat_rate:36'],
//   availableShippingMethods: [
//     {
//       packageDetails: 'Osiris cleaver - VG10, FRN scales ×1',
//       supportsShippingCalculator: true,
//       rates: [
//         {
//           id: 'flat_rate:36',
//           instanceId: 36,
//           methodId: 'flat_rate',
//           label: 'USPS Ground advantage (or equivalent)',
//           cost: '8.00',
//         },
//       ],
//     },
//   ],
//   subtotal: '$70.00',
//   subtotalTax: '$0.00',
//   shippingTax: '$0.00',
//   shippingTotal: '$8.00',
//   total: '64.00',
//   totalTax: '$0.00',
//   feeTax: '$0.00',
//   feeTotal: '$0.00',
//   discountTax: '$0.00',
//   discountTotal: '$14.00',
// };

// const multipleCouponCart = {
//   contents: {
//     itemCount: 3,
//     nodes: [
//       {
//         key: '55d60e3a0cb335e1c645d85c5c175c07',
//         product: {
//           node: {
//             id: 'cHJvZHVjdDo0OTM4Ng==',
//             databaseId: 49386,
//             name: 'Osiris cleaver',
//             slug: 'osiris-cleaver',
//             type: 'VARIABLE',
//             image: {
//               id: 'cG9zdDo0OTM4Mw==',
//               sourceUrl:
//                 'https://admin.damneddesigns.com/wp-content/uploads/DSC_3389-01-01-800x600.jpeg',
//               altText: '',
//             },
//             price: '$70.00',
//             regularPrice: '$70.00',
//             salePrice: null,
//             stockStatus: 'IN_STOCK',
//             stockQuantity: null,
//             soldIndividually: false,
//           },
//         },
//         variation: {
//           attributes: [
//             {
//               id: 'NTE2NzB8fHR5cGV8fFZHMTAsIEZSTiBzY2FsZXM=',
//               label: 'Type',
//               name: 'type',
//               value: 'VG10, FRN scales',
//             },
//           ],
//           node: {
//             id: 'cHJvZHVjdF92YXJpYXRpb246NTE2NzA=',
//             databaseId: 51670,
//             name: 'Osiris cleaver - VG10, FRN scales',
//             slug: 'osiris-cleaver-vg10-frn-scales',
//             type: 'VARIATION',
//             image: {
//               id: 'cG9zdDo0OTM4Mw==',
//               sourceUrl:
//                 'https://admin.damneddesigns.com/wp-content/uploads/DSC_3389-01-01-800x600.jpeg',
//               altText: '',
//             },
//             price: '$70.00',
//             regularPrice: '$70.00',
//             salePrice: null,
//             stockStatus: 'IN_STOCK',
//             stockQuantity: 334,
//             soldIndividually: null,
//           },
//         },
//         quantity: 3,
//         total: '$0.00',
//         subtotal: '$210.00',
//         subtotalTax: '$0.00',
//         extraData: [
//           {
//             key: 'csr_expire_time',
//             value: '1728030264',
//           },
//           {
//             key: 'csr_expire_time_text',
//             value: '30 minutes',
//           },
//         ],
//       },
//     ],
//   },
//   appliedCoupons: [
//     {
//       code: 'kickstarter',
//       discountAmount: '$42.00',
//       discountTax: '$0.00',
//     },
//     {
//       code: 'tim',
//       discountAmount: '$168.00',
//       discountTax: '$0.00',
//     },
//   ],
//   needsShippingAddress: true,
//   chosenShippingMethods: ['flat_rate:36'],
//   availableShippingMethods: [
//     {
//       packageDetails: 'Osiris cleaver - VG10, FRN scales ×3',
//       supportsShippingCalculator: true,
//       rates: [
//         {
//           id: 'flat_rate:36',
//           instanceId: 36,
//           methodId: 'flat_rate',
//           label: 'USPS Ground advantage (or equivalent)',
//           cost: '8.00',
//         },
//       ],
//     },
//   ],
//   subtotal: '$210.00',
//   subtotalTax: '$0.00',
//   shippingTax: '$0.00',
//   shippingTotal: '$8.00',
//   total: '8.00',
//   totalTax: '$0.00',
//   feeTax: '$0.00',
//   feeTotal: '$0.00',
//   discountTax: '$0.00',
//   discountTotal: '$210.00',
// };
