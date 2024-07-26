import React, { memo, useEffect, useRef } from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useCountries } from '@/hooks/useCountries';
import { Cart, CountriesEnum } from '@/graphql';
import {
  setCartLoading,
  setChangeShipping,
  setDiffShipAddress,
} from '@/redux/slices/cart-slice';
import { Data, sessionContext, useSession } from '@/client/SessionProvider';
import { useCheckoutDetails } from '@/client/CheckoutProvider';
import { useOtherCartMutations } from '@woographql/react-hooks';
import { useSelector } from 'react-redux';
import { dispatch } from '@/redux/store';
import toast from 'react-hot-toast';
import { reloadBrowser } from '@/components/utils';

const ShippingForm = ({ formik }: any) => {
  const { cart: cartData, updateCart } = useSession();
  const cart = cartData as Cart;
  //const { updateCheckoutDetails } = useCheckoutDetails();
  const { setShippingLocale } = useOtherCartMutations<Data>(sessionContext);
  const diffShipAddress = useSelector(
    (state: any) => state.cartSlice.diffShipAddress
  );
  const changeShipping = useSelector(
    (state: any) => state.cartSlice.changeShipping
  );
  const shippingCountry = formik.values.shipping.country as CountriesEnum;
  const prevShippingCountry = useRef(shippingCountry);
  const { countries: shippingCountries, states: shippingStates } =
    useCountries(shippingCountry);

  const updateShippingRate = async () => {
    dispatch(setCartLoading(true));
    try {
      await setShippingLocale({
        country: formik.values.shipping.country,
        city: formik.values.shipping.city,
        state: formik.values.shipping.state,
        postcode: formik.values.shipping.postcode,
      });

      await updateCart({
        mutation: 'updateItemQuantities',
        input: {
          items: [
            {
              key: cart?.contents?.nodes[0].key as string,
              quantity: cart?.contents?.nodes[0].quantity as number,
            },
          ],
        },
      });
    } catch (error) {
      console.log(error);
      toast.error('Cart Session Expired');
      reloadBrowser();
    }
    dispatch(setCartLoading(false));
  };

  useEffect(() => {
    if (shippingStates && prevShippingCountry.current !== shippingCountry) {
      formik.setFieldValue(
        'shipping.state',
        shippingStates.length === 0 ? ' ' : ''
      );
      prevShippingCountry.current = shippingCountry;
    }
  }, [shippingStates]);

  useEffect(() => {
    if (
      diffShipAddress &&
      (shippingCountry as string) !== '' &&
      prevShippingCountry.current !== shippingCountry
    ) {
      updateShippingRate();
    }
  }, [shippingCountry, diffShipAddress]);

  useEffect(() => {
    if (changeShipping) {
      formik.setFieldValue('shipping.country', '');
      dispatch(setChangeShipping(false));
      const el = document.getElementById('shipping-country-select');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [changeShipping]);

  return (
    <div className='grid grid-cols-2 gap-2'>
      <div className='col-span-2 mb-2'>SHIPPING DETAILS</div>
      <div className='col-span-1'>
        {/* <label htmlFor='firstName'>First Name</label> */}
        <TextField
          placeholder='First Name'
          fullWidth
          size='small'
          variant='outlined'
          name='shipping.firstName'
          id='shipping.firstName'
          value={formik.values.shipping?.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.shipping?.firstName &&
            Boolean(formik.errors.shipping?.firstName)
          }
          helperText={
            formik.touched.shipping?.firstName &&
            formik.errors.shipping?.firstName
          }
        />
      </div>

      <div className='col-span-1'>
        {/* <label htmlFor='lastName'>Last Name</label> */}
        <TextField
          placeholder='Last Name'
          fullWidth
          variant='outlined'
          name='shipping.lastName'
          id='shipping.lastName'
          size='small'
          value={formik.values.shipping?.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.shipping?.lastName &&
            Boolean(formik.errors.shipping?.lastName)
          }
          helperText={
            formik.touched.shipping?.lastName &&
            formik.errors.shipping?.lastName
          }
        />
      </div>

      <FormControl
        id='shipping-country-select'
        className='col-span-1'
        fullWidth
        size='small'
      >
        <label htmlFor='country' className='mb-2'>
          Country / Region
        </label>
        <Select
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200,
              },
            },
          }}
          id='shipping.country'
          name='shipping.country'
          value={formik.values.shipping?.country}
          onChange={formik.handleChange}
          error={
            formik.touched.shipping?.country &&
            Boolean(formik.errors.shipping?.country)
          }
        >
          {shippingCountries.map(({ code, name }) => (
            <MenuItem value={code} key={code}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {formik.touched.shipping?.country && formik.errors.shipping?.country}
        </FormHelperText>
      </FormControl>

      <FormControl className='col-span-1' fullWidth size='small'>
        <label htmlFor='state' className='mb-2'>
          State
        </label>
        <Select
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 200,
              },
            },
          }}
          id='shipping.state'
          name='shipping.state'
          value={formik.values.shipping?.state}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.shipping?.state &&
            Boolean(formik.errors.shipping?.state)
          }
        >
          {shippingStates.map(({ code, name }) => (
            <MenuItem value={code} key={code}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {formik.touched.shipping?.state && formik.errors.shipping?.state}
        </FormHelperText>
      </FormControl>

      <div className='col-span-2 flex flex-col gap-4'>
        {/* <label htmlFor='address1'>Street Address</label> */}
        <TextField
          fullWidth
          placeholder='House number and street name'
          variant='outlined'
          name='shipping.address1'
          id='shipping.address1'
          size='small'
          value={formik.values.shipping?.address1}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.shipping?.address1 &&
            Boolean(formik.errors.shipping?.address1)
          }
          helperText={
            formik.touched.shipping?.address1 &&
            formik.errors.shipping?.address1
          }
        />
        <TextField
          fullWidth
          variant='outlined'
          placeholder='Apartment, suite, unit, etc. (optional)'
          name='shipping.address2'
          id='shipping.address2'
          size='small'
          value={formik.values.shipping?.address2}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.shipping?.address2 &&
            Boolean(formik.errors.shipping?.address2)
          }
          helperText={
            formik.touched.shipping?.address2 &&
            formik.errors.shipping?.address2
          }
        />
      </div>

      <div className='col-span-1'>
        {/* <label htmlFor='city'>Town / City</label> */}
        <TextField
          placeholder='Town / City'
          fullWidth
          variant='outlined'
          name='shipping.city'
          id='shipping.city'
          size='small'
          value={formik.values.shipping?.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.shipping?.city &&
            Boolean(formik.errors.shipping?.city)
          }
          helperText={
            formik.touched.shipping?.city && formik.errors.shipping?.city
          }
        />
      </div>

      <div className='col-span-1'>
        {/* <label htmlFor='postcode'>ZIP Code</label> */}
        <TextField
          placeholder='Postcode'
          fullWidth
          variant='outlined'
          name='shipping.postcode'
          id='shipping.postcode'
          size='small'
          value={formik.values.shipping?.postcode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.shipping?.postcode &&
            Boolean(formik.errors.shipping?.postcode)
          }
          helperText={
            formik.touched.shipping?.postcode &&
            formik.errors.shipping?.postcode
          }
        />
      </div>
    </div>
  );
};

export default memo(ShippingForm);
