import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define types for Billing and Shipping info
interface BillingInfo {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email: string;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

// Define types for Order and Token
interface Order {
  total: string;
  orderDesc: string;
  orderRef: string;
  billing: BillingInfo;
  shipping: ShippingInfo;
}

interface Card {
  number: string;
  bin: string;
  exp: string;
  type: string;
  hash: string;
}

interface Token {
  tokenType: string;
  token: string;
  card: Card;
}

// Define RequestBody type
export interface RequestBody {
  token: Token;
  order: Order;
}

const BillingInfoSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  address1: z.string().nonempty(),
  address2: z.string().optional(),
  city: z.string().nonempty(),
  state: z.string().nonempty(),
  postcode: z.string().nonempty(),
  country: z.string().nonempty(),
  phone: z.string().nonempty(),
  email: z.string().email(),
});

const ShippingInfoSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  address1: z.string().nonempty(),
  address2: z.string().optional(),
  city: z.string().nonempty(),
  state: z.string().nonempty(),
  postcode: z.string().nonempty(),
  country: z.string().nonempty(),
});

const OrderSchema = z.object({
  total: z.string().nonempty(),
  orderDesc: z.string().nonempty(),
  orderRef: z.string().nonempty(),
  billing: BillingInfoSchema,
  shipping: ShippingInfoSchema,
});

const CardSchema = z.object({
  number: z.string().nonempty(),
  bin: z.string(),
  exp: z.string().nonempty(),
  type: z.string(),
  hash: z.string(),
});

const TokenSchema = z.object({
  tokenType: z.string(),
  token: z.string().nonempty(),
  card: CardSchema,
});

export const RequestBodySchema = z.object({
  token: TokenSchema,
  order: OrderSchema,
});
