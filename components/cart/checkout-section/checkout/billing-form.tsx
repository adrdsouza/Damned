import React, { memo, useEffect, useRef } from 'react';
import {
  Data,
  sessionContext,
  tokenManager,
  useSession,
} from '@/client/SessionProvider';
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useCountries } from '@/hooks/useCountries';
import { Cart, CountriesEnum } from '@/graphql';
import { reloadBrowser } from '@/components/utils';
import { useOtherCartMutations } from '@woographql/react-hooks';
import { useSelector } from 'react-redux';
import { setCartLoading, setChangeShipping } from '@/redux/slices/cart-slice';
import { dispatch } from '@/redux/store';
import { useCheckoutDetails } from '@/client/CheckoutProvider';
import { getShippingRate } from '@/lib/graphql';

const BillingForm = ({ formik }: any) => {
  const { cart: cartData, updateCart } = useSession();
  const cart = cartData as Cart;
  //const { updateCheckoutDetails } = useCheckoutDetails();
  //const { setShippingLocale } = useOtherCartMutations<Data>(sessionContext);
  const { removeCoupon } = useOtherCartMutations<Data>(sessionContext);
  const diffShipAddress = useSelector(
    (state: any) => state.cartSlice.diffShipAddress
  );
  // const changeShipping = useSelector(
  //   (state: any) => state.cartSlice.changeShipping
  // );

  const billingCountry = formik.values.billing.country as CountriesEnum;

  const prevBillingCountry = useRef(billingCountry);

  const { countries: billingCountries, states: billingStates } =
    useCountries(billingCountry);

  const updateShippingRate = async () => {
    dispatch(setCartLoading(true));
    try {
      // await setShippingLocale({
      //   country: formik.values.billing.country,
      //   city: formik.values.billing.city,
      //   state: formik.values.billing.state,
      //   postcode: formik.values.billing.postcode,
      // });

      const shippingRate = await getShippingRate(formik.values.billing.country);

      if (!shippingRate) {
        dispatch(setCartLoading(false));
        return;
      }

      // if (cart.appliedCoupons) {
      //   const coupons = cart.appliedCoupons;
      //   coupons.forEach(async (coupon) => {
      //     console.log(coupon);
      //     await removeCoupon(coupon?.code as string);
      //   });
      // }

      const updatedCart = {
        ...cart,
        chosenShippingMethods: [shippingRate.id],
        availableShippingMethods: [
          {
            packageDetails: cart?.contents?.nodes
              .map((node) => `${node?.variation?.node.name} ×${node.quantity}`)
              .join(', '),
            supportsShippingCalculator: true,
            rates: [shippingRate],
          },
        ],
        //discountTotal: '$0.00',
        shippingTotal: `$${shippingRate.cost}`,
        total: `${(
          parseFloat(cart?.subtotal?.replace('$', '') as string) +
          parseFloat(shippingRate.cost)
        ).toFixed(2)}`,
      };

      await updateCart({
        updateShippingRate: true,
        cart: updatedCart,
      });
    } catch (error) {
      console.log(error);
      toast.error('Cart Session Expired');
      reloadBrowser();
    }
    dispatch(setCartLoading(false));
  };

  useEffect(() => {
    if (billingStates && prevBillingCountry.current !== billingCountry) {
      formik.setFieldValue(
        'billing.state',
        billingStates.length === 0 ? ' ' : ''
      );
      prevBillingCountry.current = billingCountry;
    }
  }, [billingStates]);

  useEffect(() => {
    if (!diffShipAddress && (billingCountry as string) !== '') {
      updateShippingRate();
    }
  }, [billingCountry, diffShipAddress]);

  // useEffect(() => {
  //   if (
  //     !diffShipAddress &&
  //     (billingCountry as string) !== '' &&
  //     prevBillingCountry.current !== billingCountry
  //   ) {
  //     updateShippingRate();
  //   }
  // }, [billingCountry, diffShipAddress]);

  // useEffect(() => {
  //   if (changeShipping) {
  //     formik.setFieldValue('billing.country', '');
  //     dispatch(setChangeShipping(false));
  //     const el = document.getElementById('billing-country-select');
  //     if (el) {
  //       el.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   }
  // }, [changeShipping]);

  return (
    <div className='grid grid-cols-2 gap-2'>
      <div className='col-span-2 mb-2'>BILLING DETAILS</div>
      <div className='col-span-1'>
        {/* <label htmlFor='firstName'>First Name</label> */}
        <TextField
          fullWidth
          placeholder='First Name'
          size='small'
          variant='outlined'
          name='billing.firstName'
          id='billing.firstName'
          value={formik.values.billing?.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.billing?.firstName &&
            Boolean(formik.errors.billing?.firstName)
          }
          helperText={
            formik.touched.billing?.firstName &&
            formik.errors.billing?.firstName
          }
        />
      </div>

      <div className='col-span-1'>
        {/* <label htmlFor='lastName'>Last Name</label> */}
        <TextField
          placeholder='Last Name'
          fullWidth
          variant='outlined'
          name='billing.lastName'
          id='billing.lastName'
          size='small'
          value={formik.values.billing?.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.billing?.lastName &&
            Boolean(formik.errors.billing?.lastName)
          }
          helperText={
            formik.touched.billing?.lastName && formik.errors.billing?.lastName
          }
        />
      </div>

      <FormControl
        id='billing-country-select'
        className='col-span-1'
        fullWidth
        size='small'
      >
        {/* <label htmlFor='country' className='mb-2'>
          Country / Region
        </label> */}
        <Select
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200,
              },
            },
          }}
          displayEmpty
          placeholder='Country'
          id='billing.country'
          name='billing.country'
          value={formik.values.billing?.country}
          onChange={formik.handleChange}
          error={
            formik.touched.billing?.country &&
            Boolean(formik.errors.billing?.country)
          }
        >
          <MenuItem value=''>
            <p className='text-gray-400'>Select Country</p>
          </MenuItem>
          {billingCountries.map(({ code, name }) => (
            <MenuItem value={code} key={code}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {formik.touched.billing?.country && formik.errors.billing?.country}
        </FormHelperText>
      </FormControl>

      <FormControl className='col-span-1' fullWidth size='small'>
        {/* <label htmlFor='state' className='mb-2'>
          State
        </label> */}
        <Select
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200,
              },
            },
          }}
          displayEmpty
          id='billing.state'
          name='billing.state'
          value={formik.values.billing?.state}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.billing?.state &&
            Boolean(formik.errors.billing?.state)
          }
        >
          <MenuItem value=''>
            <p className='text-gray-400'>Select State</p>
          </MenuItem>
          {billingStates.map(({ code, name }) => (
            <MenuItem value={code} key={code}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {formik.touched.billing?.state && formik.errors.billing?.state}
        </FormHelperText>
      </FormControl>

      <div className='col-span-2 flex flex-col gap-2'>
        {/* <label htmlFor='address1'>Street Address</label> */}
        <TextField
          fullWidth
          placeholder='House number and street name'
          variant='outlined'
          name='billing.address1'
          id='billing.address1'
          size='small'
          value={formik.values.billing?.address1}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.billing?.address1 &&
            Boolean(formik.errors.billing?.address1)
          }
          helperText={
            formik.touched.billing?.address1 && formik.errors.billing?.address1
          }
        />
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Apartment, suite, unit, etc. (optional)'
          name='billing.address2'
          id='billing.address2'
          size='small'
          value={formik.values.billing?.address2}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.billing?.address2 &&
            Boolean(formik.errors.billing?.address2)
          }
          helperText={
            formik.touched.billing?.address2 && formik.errors.billing?.address2
          }
        />
      </div>

      <div className='col-span-1'>
        {/* <label htmlFor='city'>Town / City</label> */}
        <TextField
          placeholder='Town / City'
          fullWidth
          variant='outlined'
          name='billing.city'
          id='billing.city'
          size='small'
          value={formik.values.billing?.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.billing?.city && Boolean(formik.errors.billing?.city)
          }
          helperText={
            formik.touched.billing?.city && formik.errors.billing?.city
          }
        />
      </div>

      <div className='col-span-1'>
        {/* <label htmlFor='postcode'>ZIP Code</label> */}
        <TextField
          placeholder='Postcode'
          fullWidth
          variant='outlined'
          name='billing.postcode'
          id='billing.postcode'
          size='small'
          value={formik.values.billing?.postcode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.billing?.postcode &&
            Boolean(formik.errors.billing?.postcode)
          }
          helperText={
            formik.touched.billing?.postcode && formik.errors.billing?.postcode
          }
        />
      </div>

      <div className='col-span-1'>
        {/* <label htmlFor='phone'>Phone</label> */}
        <TextField
          placeholder='Phone'
          fullWidth
          variant='outlined'
          name='billing.phone'
          id='billing.phone'
          size='small'
          value={formik.values.billing?.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.billing?.phone &&
            Boolean(formik.errors.billing?.phone)
          }
          helperText={
            formik.touched.billing?.phone && formik.errors.billing?.phone
          }
        />
      </div>

      <div className='col-span-1'>
        {/* <label htmlFor='email'>Email address</label> */}
        <TextField
          placeholder='Email Address'
          fullWidth
          variant='outlined'
          name='billing.email'
          id='billing.email'
          size='small'
          value={formik.values.billing?.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.billing?.email &&
            Boolean(formik.errors.billing?.email)
          }
          helperText={
            formik.touched.billing?.email && formik.errors.billing?.email
          }
        />
      </div>
    </div>
  );
};

export default memo(BillingForm);
