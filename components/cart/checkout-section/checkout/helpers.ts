import * as Yup from 'yup';

export const billingSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  address1: Yup.string().required('Address Line 1 is required'),
  address2: Yup.string(),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postcode: Yup.string().required('Postcode is required'),
  company: Yup.string(),
  country: Yup.string().required('Country is required'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Phone number must be digits')
    .required('Phone number is required'),
});

export const shippingSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  address1: Yup.string().required('Address Line 1 is required'),
  address2: Yup.string(),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postcode: Yup.string().required('Postcode is required'),
  country: Yup.string().required('Country is required'),
  company: Yup.string(),
});

export const combinedSchema = Yup.object().shape({
  billing: billingSchema,
  shipping: shippingSchema,
});

export const onlyBillingSchema = Yup.object().shape({
  billing: billingSchema,
});

export const onlyShippingSchema = Yup.object().shape({
  shipping: shippingSchema,
});
