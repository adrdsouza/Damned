import { NextResponse } from 'next/server';
import { print } from 'graphql';

import {
  GetSessionDocument,
  GetSessionQuery,
  LoginDocument,
  LoginMutation,
  RegisterCustomerInput,
  RegisterDocument,
  RegisterMutation,
  getClient,
} from '@/graphql';

type RequestBody = ({
  mutation: string;
  input: {
    username: string;
    password: string;
  }
} | {
  mutation: 'registerCustomer';
  input: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
  }
}) & { sessionToken?: string }

export async function POST(request: Request) {
  try {
    const { sessionToken: guestToken, mutation, input } = await request.json() as RequestBody;
    const client = getClient();

    let authToken: string;
    let refreshToken: string;
    if (mutation === 'login') {
      const { username, password } = input;
      if (!username || !password) {
        return NextResponse.json({
          errors: {
            message: 'Proper credential must be provided for authentication',
          },
        }, { status: 500 });
      }

      const { data, headers } = await client.rawRequest<LoginMutation>(
        print(LoginDocument),
        {
          input: {
            username,
            password,
          },
        });
      if (!data?.login) {
        return NextResponse.json({ errors: { message: 'Login failed.' } }, { status: 500 });
      }

      authToken = data?.login.authToken as string;
      refreshToken = data?.login.refreshToken as string;
      if (!authToken || !refreshToken) {
        return NextResponse.json({ errors: { message: 'Failed to retrieve credentials.' } }, { status: 500 });
      }
    } else if (mutation === 'registerCustomer') {
      const {
        username,
        password,
        email,
        firstName,
        lastName,
      } = input as RegisterCustomerInput;
      if (!email) {
        return NextResponse.json({ errors: { message: 'Email is required.' } }, { status: 500 });
      }
      if (!firstName) {
        return NextResponse.json({ errors: { message: 'First name is required.' } }, { status: 500 });
      }
      if (!lastName) {
        return NextResponse.json({ errors: { message: 'Last name is required.' } }, { status: 500 });
      }
      if (!username) {
        return NextResponse.json({ errors: { message: 'Username is required.' } }, { status: 500 });
      }
      if (!password) {
        return NextResponse.json({ errors: { message: 'Password is required.' } }, { status: 500 });
      }

      const { data, headers } = await client.rawRequest<RegisterMutation>(print(RegisterDocument), { input });
      if (!data?.registerCustomer) {
        return NextResponse.json({ errors: { message: 'Registration failed.' } }, { status: 500 });
      }

      const customer = data?.registerCustomer.customer;
      authToken = customer?.jwtAuthToken as string;
      refreshToken = customer?.jwtRefreshToken as string;
      if (!authToken || !refreshToken) {
        return NextResponse.json({ errors: { message: 'Failed to retrieve credentials.' } }, { status: 500 });
      }
    } else {
      throw new Error('Invalid mutation');
    }
    
    client.setHeaders({ Authorization: `Bearer ${authToken}` });
    if (guestToken) {
      client.setHeader('woocommerce-session', `Session ${guestToken}`);
    }
    const { data: sessionData, headers } = await client.rawRequest<GetSessionQuery>(print(GetSessionDocument));
    
    const customer = sessionData?.customer;
    if (!customer) {
      return NextResponse.json({ errors: { message: 'Failed to retrieve customer data.' } }, { status: 500 });
    }

    const cart = sessionData?.cart;
    if (!cart) {
      return NextResponse.json({ errors: { message: 'Failed to retrieve cart data.' } }, { status: 500 });
    }

    const sessionToken = headers.get('woocommerce-session') as string || customer.sessionToken;
    if (!sessionToken) {
      return NextResponse.json({ errors: { message: 'Failed to retrieve session token.' } }, { status: 500 });
    }

    return NextResponse.json({
      authToken,
      refreshToken,
      sessionToken,
      customer,
      cart,
    });
  } catch (err) {
    console.log(err);
    let message: string;
    let status: number;
    switch (true) {
      case (err as Error).message.includes('An account is already registered with your email address'):
        message = 'An account is already registered with your email address. Please login.';
        status = 409;
        break;
      case (err as Error).message.includes('The user could not be logged in.'):
        message = 'Invalid username or password. Please try again.';
        status = 401;
        break;
      case (err as Error).message.includes('You are already logged in.'):
        message = 'You are already logged in.';
        status = 409;
        break;
      default: 
        message = 'Sorry, something with wrong. Please contact administrator.';
        status = 500;
        break;
    }

    return NextResponse.json({ errors: { message } }, { status });
  }
}
