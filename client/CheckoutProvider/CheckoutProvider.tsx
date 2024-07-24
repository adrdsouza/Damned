import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import {
  Customer,
  Cart,
  LineItemInput,
  ShippingLineInput,
  ShippingRate,
  AppliedCoupon,
  Order,
  CreateOrderInput,
  CartItem,
} from '@/graphql';
import { apiCall } from '@/utils/apiCall';
import { useSession } from '@/client/SessionProvider';
import { blankAddress, Address } from '@/client/AddressForm';
// import { Separator } from '@/ui/separator';
// import { CheckoutProgress } from './CheckoutProgress';

interface CheckoutDetails {
  customerId?: number;
  billing: Address & { overwrite?: boolean };
  shipping: Address & { overwrite?: boolean };
  lineItems: LineItemInput[];
  shippingLines: ShippingLineInput[];
  needsShipping: boolean;
  coupons: string[];
  transactionId?: string;
  subtotal: number;
  subtotalTax: number;
  total: number;
  totalTax: number;
  updateCheckoutDetails: (
    details: Partial<CheckoutDetails>
  ) => Promise<boolean>;
  createOrder: (details: CreateOrderInput) => Promise<Order | null>;
}

const initialCheckoutDetails: CheckoutDetails = {
  billing: blankAddress,
  shipping: blankAddress,
  lineItems: [],
  shippingLines: [],
  needsShipping: false,
  coupons: [],
  subtotal: 0,
  subtotalTax: 0,
  totalTax: 0,
  total: 0,
  updateCheckoutDetails: () => Promise.resolve(false),
  createOrder: () => Promise.resolve(null),
};

const CheckoutDetailsContext = createContext<CheckoutDetails>(
  initialCheckoutDetails
);

type CheckoutDetailsAction = {
  type: 'UPDATE_DETAILS';
  payload: Partial<CheckoutDetails>;
};

const reducer = (state: CheckoutDetails, action: CheckoutDetailsAction) => {
  switch (action.type) {
    case 'UPDATE_DETAILS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

const mergeAddress = (address: Address, blankAddress: Address) => {
  const values = {} as Address;
  Object.keys(blankAddress).forEach((key) => {
    values[key as 'address1'] = ![null, ''].includes(
      address[key as keyof Address]
    )
      ? address[key as keyof Address]
      : blankAddress[key as keyof Address];
  });

  return values;
};

const { Provider } = CheckoutDetailsContext;
interface CheckoutProps {
  children?: ReactNode;
}

export function CheckoutProvider({ children }: CheckoutProps) {
  const [state, dispatch] = useReducer(reducer, initialCheckoutDetails);
  const {
    cart: cartData,
    customer: customerData,
    updateCustomer,
  } = useSession();
  const cart = cartData as Cart;
  const customer = customerData as Customer;

  useEffect(() => {
    if (!customer) {
      return;
    }

    let customerId;
    if (customer?.id && customer.id !== 'guest') {
      customerId = customer.databaseId as number;
    }

    const billing = mergeAddress(customer?.billing as Address, state.billing);
    const shipping = mergeAddress(
      customer?.shipping as Address,
      state.shipping
    );

    dispatch({
      type: 'UPDATE_DETAILS',
      payload: {
        customerId,
        billing,
        shipping,
      },
    });
  }, [customer, customer?.id, customer?.billing, customer?.shipping]);

  useEffect(() => {
    if (!cart) {
      return;
    }

    const {
      chosenShippingMethods,
      availableShippingMethods,
      shippingTotal,
      needsShippingAddress,
    } = cart;
    const cartItems = (cart?.contents?.nodes || []) as CartItem[];
    const appliedCoupons = (cart?.appliedCoupons || []) as AppliedCoupon[];

    let shippingLines: ShippingLineInput[] = [];
    if (shippingTotal) {
      chosenShippingMethods?.forEach((method) => {
        availableShippingMethods?.forEach((availableMethod) => {
          const { cost, id, label } = availableMethod?.rates?.find(
            (rate) => rate?.id === method
          ) as ShippingRate;
          shippingLines.push({
            methodId: id,
            methodTitle: label as string,
            total: cost as string,
          });
        });
      });
    }

    let lineItems: LineItemInput[] = [];
    if (cartItems?.length) {
      lineItems = cartItems.map((item) => ({
        productId: item.product?.node.databaseId,
        variationId: item.variation?.node?.databaseId,
        quantity: item.quantity,
      }));
    }

    let coupons: string[] = [];
    if (appliedCoupons.length) {
      coupons = appliedCoupons.map((coupon) => coupon.code);
    }

    dispatch({
      type: 'UPDATE_DETAILS',
      payload: {
        lineItems,
        coupons,
        shippingLines,
        needsShipping: needsShippingAddress || !!shippingTotal,
        subtotal: Number(cart.subtotal),
        subtotalTax: Number(cart.subtotalTax),
        total: Number(cart.total),
        totalTax: Number(cart.totalTax),
      },
    });
  }, [
    cart,
    cart?.contents?.nodes,
    cart?.appliedCoupons,
    cart?.shippingTotal,
    cart?.chosenShippingMethods,
    cart?.availableShippingMethods,
    cart?.needsShippingAddress,
  ]);

  const updateCheckoutDetails = async (details: Partial<CheckoutDetails>) => {
    const { billing, shipping } = details;

    if (billing || shipping) {
      if (billing) {
        billing.overwrite = true;
        Object.entries(billing).forEach(([key, value]) => {
          if (value === '') {
            delete billing[key as keyof Address];
          }
        });
      }

      if (shipping) {
        shipping.overwrite = true;
        Object.entries(shipping).forEach(([key, value]) => {
          if (value === '') {
            delete shipping[key as keyof Address];
          }
        });
      }

      const customer = await updateCustomer({
        mutation: 'updateCustomer',
        input: {
          billing: billing ? billing : undefined,
          shipping: shipping ? shipping : undefined,
        },
      });

      if (!customer) {
        return false;
      }
    }

    dispatch({
      type: 'UPDATE_DETAILS',
      payload: details,
    });

    return true;
  };

  const createOrder = useCallback(async (details: CreateOrderInput) => {
    const { order } = await apiCall<{ order: Order }>('/api/create-order', {
      method: 'POST',
      body: JSON.stringify(details),
    });

    if (!order) {
      return null;
    }

    return order;
  }, []);

  const store = {
    ...state,
    updateCheckoutDetails,
    createOrder,
  };

  return <Provider value={store}>{children}</Provider>;
}

export function useCheckoutDetails() {
  return useContext(CheckoutDetailsContext);
}
