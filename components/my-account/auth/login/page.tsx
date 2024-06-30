import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSession } from '@/client/SessionProvider';
import { TextField, Button } from '@mui/material';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
  const { login, fetching } = useSession();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const customer = await login({
        mutation: 'login',
        input: {
          username: values.email,
          password: values.password,
        },
      });

      console.log(customer);

      if (!!customer?.id && customer.id !== 'guest') {
        // toast({
        //   title: 'Success',
        //   description: `Welcome Back! ${customer.firstName}`,
        // });
      } else {
        // toast({
        //   title: 'Login Error',
        //   description: (customer || 'Login failed. Please try again.') as string,
        //   variant: 'destructive',
        // });
        // formik.resetForm();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className='mt-5 flex flex-col gap-5'>
      <div>
        <TextField
          className='focus:bg-gray-200'
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

      <div>
        <TextField
          fullWidth
          variant='outlined'
          type='password'
          id='password'
          name='password'
          placeholder='Password'
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
      </div>

      <button
        type='submit'
        className='w-full text-center bg-[#a89c9c] p-3 text-white'
        disabled={fetching}
      >
        {fetching ? 'Signing In...' : 'SIGN IN'}
      </button>
    </form>
  );
};

export default LoginForm;
