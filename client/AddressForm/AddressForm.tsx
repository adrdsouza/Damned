import { CountriesEnum } from '@/graphql';

export type Address = {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: CountriesEnum;
  phone: string;
  email: string;
};

export const blankAddress: Address = {
  firstName: '',
  lastName: '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postcode: '',
  country: CountriesEnum.US,
  phone: '',
  email: '',
};
