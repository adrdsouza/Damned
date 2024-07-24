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
} from '@/graphql';

const BillingForm = ({ formik }: any) => {
  const billingCountry = formik.values.billing.country as CountriesEnum;
  const prevBillingCountry = useRef(billingCountry);

  const { countries: billingCountries, states: billingStates } =
    useCountries(billingCountry);

  useEffect(() => {
    if (billingStates && prevBillingCountry.current !== billingCountry) {
      formik.setFieldValue(
        'billing.state',
        billingStates.length === 0 ? ' ' : ''
      );
      prevBillingCountry.current = billingCountry;
    }
  }, [billingStates]);

  return (
    <div className=' flex flex-col gap-4'>
      <div>BILLING DETAILS</div>
      <div>
        <label htmlFor='firstName'>First Name</label>
        <TextField
          fullWidth
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

      <div>
        <label htmlFor='lastName'>Last Name</label>
        <TextField
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
          id='billing.country'
          name='billing.country'
          value={formik.values.billing?.country}
          onChange={formik.handleChange}
          error={
            formik.touched.billing?.country &&
            Boolean(formik.errors.billing?.country)
          }
        >
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

      <div className='flex flex-col gap-4'>
        <label htmlFor='address1'>Street Address</label>
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

      <div>
        <label htmlFor='city'>Town / City</label>
        <TextField
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

      <div>
        <label htmlFor='postcode'>ZIP Code</label>
        <TextField
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

      <div>
        <label htmlFor='phone'>Phone</label>
        <TextField
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

      <div>
        <label htmlFor='email'>Email address</label>
        <TextField
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

export default BillingForm;
