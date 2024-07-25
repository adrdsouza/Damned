import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSession } from '@/client/SessionProvider';
import { TextField } from '@mui/material';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
});

const RegisterForm = () => {
  const { login, fetching } = useSession();

  const handleSubmit = async (values: any) => {
    const customer = await login({
      mutation: 'registerCustomer',
      input: {
        username: values.email,
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      },
    });

    if (!!customer?.id && customer.id !== 'guest') {
      // toast({
      //   title: 'Success',
      //   description: 'You have successfully registered',
      // });
    } else {
      console.log(customer);
      // toast({
      //   title: 'Registration Error',
      //   description: (customer || 'Failed to register') as string,
      //   variant: 'destructive',
      // });

      formik.resetForm();
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
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
    <form onSubmit={formik.handleSubmit} className='mt-5'>
      <div className='grid grid-cols-2 gap-5 mb-5'>
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
        </div>
      </div>

      <button
        disabled={formik.isSubmitting}
        type='submit'
        className='w-full text-center bg-[#a89c9c] p-3 text-white'
      >
        SIGN UP
      </button>
    </form>
  );
};

export default RegisterForm;
