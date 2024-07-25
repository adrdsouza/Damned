import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSession } from '@/client/SessionProvider';
import { TextField, Button } from '@mui/material';
import toast from 'react-hot-toast';
import { pallete } from '@/app/styles';
import { LoadingButton } from '@mui/lab';
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginForm = () => {
  const { login } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    const customer = await login({
      mutation: 'login',
      input: {
        username: values.email,
        password: values.password,
      },
    });
    setLoading(false);

    console.log(customer);

    if (!!customer?.id && customer.id !== 'guest') {
      toast.success(`Welcome Back! ${customer.firstName}`);
    } else {
      toast.error((customer || 'Login failed. Please try again.') as string);
      formik.resetForm();
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
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

      <LoadingButton
        type='submit'
        sx={{
          ':hover': {
            bgcolor: pallete[1],
          },
          color: 'white',
          p: 2,
          bgcolor: pallete[0],
        }}
        loading={loading}
      >
        SIGN IN
      </LoadingButton>
    </form>
  );
};

export default LoginForm;
