'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSession } from '@/client/SessionProvider';
import { TextField } from '@mui/material';
import toast from 'react-hot-toast';
import { Customer } from '@/graphql';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  firstName: Yup.string().required('First Name is required'),

  lastName: Yup.string().required('Last Name is required'),
  displayName: Yup.string().required('Display Name is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), undefined],
    'Passwords must match'
  ),
});

const AccountDetails = () => {
  const { customer, updateCustomer } = useSession();
  const customerData = customer as Customer;

  const handleSubmit = async (values: any) => {
    try {
      if (values.password !== values.confirmPassword) {
        toast.error('Paswords should match');
        return;
      }
      const customer = await updateCustomer({
        mutation: 'updateCustomer',
        input: {
          firstName: values.firstName,
          lastName: values.lastName,
          displayName: values.displayName,
          email: values?.email,
          password: values?.password ?? '',
        },
      });
      if (customer) {
        toast.success('Account details updated.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: customerData?.email ?? '',
      displayName: customerData?.displayName ?? '',
      firstName: customerData?.firstName ?? '',
      lastName: customerData?.lastName ?? '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
      // handle form submission
      //login(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='mb-4 flex font-bold items-center justify-between'>
        <div>ACCOUNT DETAILS</div>
        <button type='submit'>Save</button>
      </div>
      <div className='grid grid-cols-2 gap-5 mb-5'>
        <div className='col-span-2 md:col-span-1'>
          <TextField
            fullWidth
            variant='outlined'
            name='firstName'
            id='firstName'
            placeholder='First Name'
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </div>

        <div className='col-span-2 md:col-span-1'>
          <TextField
            fullWidth
            variant='outlined'
            name='lastName'
            id='lastName'
            placeholder='Last Name'
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </div>

        <div className='col-span-2'>
          <TextField
            fullWidth
            variant='outlined'
            name='displayName'
            id='displayName'
            placeholder='Display Name'
            value={formik.values.displayName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.displayName && Boolean(formik.errors.displayName)
            }
            helperText={formik.touched.displayName && formik.errors.displayName}
          />
        </div>

        <div className='col-span-2'>
          <TextField
            fullWidth
            variant='outlined'
            name='email'
            id='email'
            placeholder='Username / Email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </div>

        <div className='col-span-2'>
          <TextField
            fullWidth
            variant='outlined'
            type='password'
            name='password'
            id='password'
            placeholder='Password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <p>Leave blank to keep unchanged</p>
        </div>

        <div className='col-span-2'>
          <TextField
            fullWidth
            variant='outlined'
            name='confirmPassword'
            id='confirmPassword'
            type='password'
            placeholder='Confirm Password'
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />
          <p>Leave blank to keep unchanged</p>
        </div>
      </div>
    </form>
  );
};

export default AccountDetails;
