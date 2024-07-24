'use client';

import React, { memo, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { sessionContext, useSession } from '@/client/SessionProvider';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import toast from 'react-hot-toast';
import { useCheckoutDetails } from '@/client/CheckoutProvider';
import { useCountries } from '@/hooks/useCountries';
import {
  AddressFieldsFragment,
  Cart,
  CountriesEnum,
  CountryState,
  Customer,
  CustomerAddress,
} from '@/graphql';

import { Address } from '@/client/AddressForm';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import {
  onlyBillingSchema,
  onlyShippingSchema,
} from '@/components/cart/checkout-section/checkout/helpers';

const EditShipping = () => {
  const { push } = useRouter();
  const { customer, updateCustomer } = useSession();
  const { shipping } = customer as Customer;

  const handleSubmit = async (values: any) => {
    if (shippingStates.length !== 0 && values.shipping.state === '') {
      toast.error('State is required');
      return;
    }
    try {
      await updateCustomer({
        mutation: 'updateCustomer',
        input: { shipping: values.shipping },
      });
      toast.success('Shipping address updated.');
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues = {
    shipping: {
      firstName: shipping?.firstName ?? '',
      lastName: shipping?.lastName ?? '',
      city: shipping?.city ?? '',
      country: shipping?.country ?? '',
      state: shipping?.state ?? '',
      postcode: shipping?.postcode ?? '',
      address1: shipping?.address1 ?? '',
      address2: shipping?.address2 ?? '',
      company: shipping?.company ?? '',
    },
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: onlyShippingSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const shippingCountry = formik.values.shipping.country as CountriesEnum;
  const prevShippingCountry = useRef(shippingCountry);
  const { countries: shippingCountries, states: shippingStates } =
    useCountries(shippingCountry);

  useEffect(() => {
    if (shippingStates && prevShippingCountry.current !== shippingCountry) {
      formik.setFieldValue(
        'shipping.state',
        shippingStates.length === 0 ? ' ' : ''
      );
      prevShippingCountry.current = shippingCountry;
    }
  }, [shippingStates]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='mb-4 flex font-bold justify-between'>
        <div>SHIPPING DETAILS</div>
        <div className='flex gap-4'>
          <button type='submit'>Save</button>
          <Link href='/my-account/edit-address'>Cancel</Link>
        </div>
      </div>

      <div className=' flex flex-col gap-4'>
        <div>
          <label htmlFor='firstName'>First Name</label>
          <TextField
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

        <div>
          <label htmlFor='lastName'>Last Name</label>
          <TextField
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

        <FormControl fullWidth size='small'>
          <label htmlFor='country'>Country / Region</label>
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
            {formik.touched.shipping?.country &&
              formik.errors.shipping?.country}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth size='small'>
          <label htmlFor='state'>State</label>
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

        <div className='flex flex-col gap-4'>
          <label htmlFor='address1'>Street Address</label>
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

        <div>
          <label htmlFor='city'>Town / City</label>
          <TextField
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

        <div>
          <label htmlFor='postcode'>ZIP Code</label>
          <TextField
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
    </form>
  );
};

export default EditShipping;
