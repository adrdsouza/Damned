import { NextResponse } from 'next/server';
import { print } from 'graphql';

import {
  Customer,
  CustomerToOrderConnection,
  GetSessionDocument,
  GetSessionQuery,
  LoginDocument,
  LoginMutation,
  RegisterCustomerInput,
  RegisterDocument,
  RegisterMutation,
  RootQueryToOrderConnection,
  fetchOrders,
  getClient,
  ordersDocument,
  ordersQuery,
} from '@/graphql';

type RequestBody = (
  | {
      mutation: string;
      input: {
        username: string;
        password: string;
      };
    }
  | {
      mutation: 'registerCustomer';
      input: {
        username: string;
        password: string;
        email: string;
        firstName: string;
        lastName: string;
      };
    }
) & { sessionToken?: string };

export async function POST(request: Request) {
  try {
    const {
      sessionToken: guestToken,
      mutation,
      input,
    } = (await request.json()) as RequestBody;
    const client = getClient();

    let authToken: string;
    let refreshToken: string;
    if (mutation === 'login') {
      const { username, password } = input;

      if (!username || !password) {
        return NextResponse.json(
          {
            errors: {
              message: 'Proper credential must be provided for authentication',
            },
          },
          { status: 500 }
        );
      }

      const { data, headers } = await client.rawRequest<LoginMutation>(
        print(LoginDocument),
        {
          input: {
            username,
            password,
          },
        }
      );

      if (!data?.login) {
        return NextResponse.json(
          { errors: { message: 'Login failed.' } },
          { status: 500 }
        );
      }

      authToken = data?.login.authToken as string;

      refreshToken = data?.login.refreshToken as string;

      if (!authToken || !refreshToken) {
        return NextResponse.json(
          { errors: { message: 'Failed to retrieve credentials.' } },
          { status: 500 }
        );
      }
    } else if (mutation === 'registerCustomer') {
      const { username, password, email, firstName, lastName } =
        input as RegisterCustomerInput;
      if (!email) {
        return NextResponse.json(
          { errors: { message: 'Email is required.' } },
          { status: 500 }
        );
      }
      if (!firstName) {
        return NextResponse.json(
          { errors: { message: 'First name is required.' } },
          { status: 500 }
        );
      }
      if (!lastName) {
        return NextResponse.json(
          { errors: { message: 'Last name is required.' } },
          { status: 500 }
        );
      }
      if (!username) {
        return NextResponse.json(
          { errors: { message: 'Username is required.' } },
          { status: 500 }
        );
      }
      if (!password) {
        return NextResponse.json(
          { errors: { message: 'Password is required.' } },
          { status: 500 }
        );
      }

      const { data, headers } = await client.rawRequest<RegisterMutation>(
        print(RegisterDocument),
        { input }
      );
      if (!data?.registerCustomer) {
        return NextResponse.json(
          { errors: { message: 'Registration failed.' } },
          { status: 500 }
        );
      }

      const customer = data?.registerCustomer.customer;
      authToken = customer?.jwtAuthToken as string;
      refreshToken = customer?.jwtRefreshToken as string;
      if (!authToken || !refreshToken) {
        return NextResponse.json(
          { errors: { message: 'Failed to retrieve credentials.' } },
          { status: 500 }
        );
      }
    } else {
      throw new Error('Invalid mutation');
    }

    client.setHeaders({ Authorization: `Bearer ${authToken}` });

    if (guestToken) {
      client.setHeader('woocommerce-session', `Session ${guestToken}`);
    }

    const { data: sessionData, headers } =
      await client.rawRequest<GetSessionQuery>(print(GetSessionDocument));

    const customer = sessionData?.customer;

    if (!customer) {
      return NextResponse.json(
        { errors: { message: 'Failed to retrieve customer data.' } },
        { status: 500 }
      );
    }

    const cart = sessionData?.cart;

    if (!cart) {
      return NextResponse.json(
        { errors: { message: 'Failed to retrieve cart data.' } },
        { status: 500 }
      );
    }

    const sessionToken =
      (headers.get('woocommerce-session') as string) || customer.sessionToken;

    if (!sessionToken) {
      return NextResponse.json(
        { errors: { message: 'Failed to retrieve session token.' } },
        { status: 500 }
      );
    }

    const getOrdersClient = getClient();
    if (!process.env.CREATE_ORDER_PASSWORD) {
      return NextResponse.json(
        {
          errors: {
            message:
              'System credentials missing. Please contact the administrator.',
          },
        },
        { status: 500 }
      );
    }

    getOrdersClient.setHeaders({
      Authorization: `Basic ${process.env.CREATE_ORDER_PASSWORD}`,
    });

    const { orders } = await getOrdersClient.request<ordersQuery>(
      ordersDocument,
      {
        where: { customerId: customer?.databaseId as number },
      }
    );

    const customerWithOrders = {
      ...customer,
      orders: orders,
    } as Customer;

    return NextResponse.json({
      authToken,
      refreshToken,
      sessionToken,
      customer: customerWithOrders,
      cart,
    });
  } catch (err) {
    const error = err as any;

    const errors: any[] = error?.response?.errors ?? [];
    const errorMessage = errors[0]?.message ?? '';

    console.log('error message\n\n', errorMessage);

    let message: string;

    let status: number;

    switch (true) {
      case errorMessage.includes('invalid_email'):
        message = 'No user registered with the email.';
        status = 409;
        break;
      case errorMessage.includes('incorrect_password'):
        message = 'Invalid username or password. Please try again.';
        status = 401;
        break;
      default:
        message = 'Sorry, something with wrong. Please contact administrator.';
        status = 500;
        break;
    }

    return NextResponse.json({ errors: { message } }, { status });
  }
}
