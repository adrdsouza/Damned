import { print } from 'graphql/language/printer';
import { NextResponse } from 'next/server';

import {
  UpdateSessionInput,
  UpdateSessionDocument,
  UpdateSessionMutation,
  GetSessionDocument,
  GetSessionQuery,
  Cart,
  Customer,
  getClient,
} from '@/graphql';
import { isDev } from '@/utils/dev';

type RequestBody = {
  sessionToken: string;
  authToken?: string;
  input?: UpdateSessionInput;
}

export async function POST(request: Request) {
  try {
    const { input, ...tokens } = await request.json() as RequestBody;

    if (!tokens.authToken && !tokens.sessionToken) {
      return NextResponse.json({ errors: { message: 'Missing credentials' } }, { status: 500 });
    }

    const graphQLClient = getClient();

    if (tokens.authToken) {
      graphQLClient.setHeader('Authorization', `Bearer ${tokens.authToken}`);
    }
    if (tokens.sessionToken) {
      graphQLClient.setHeader('woocommerce-session', `Session ${tokens.sessionToken}`);
    }

    let cart;
    let customer;
    let sessionToken;
    if (input) {
      const { data, headers } = await graphQLClient.rawRequest<UpdateSessionMutation>(
        print(UpdateSessionDocument),
        { input },
      );

      if (!data.updateSession) {
        const message = 'Failed to update session';
        return NextResponse.json({ errors: { message } }, { status: 500 });
      }
      sessionToken = headers.get('woocommerce-session');

      graphQLClient.setHeader('woocommerce-session', `Session ${sessionToken}`);
      const results = await graphQLClient.request<GetSessionQuery>(
        print(GetSessionDocument),
        { input },
      )

      cart = results.cart as Cart;
      customer = results.customer as Customer;
    } else {
      const { data, headers } = await graphQLClient.rawRequest<GetSessionQuery>(
        print(GetSessionDocument),
        { input },
      )

      cart = data.cart as Cart;
      customer = data.customer as Customer;
      sessionToken = headers.get('woocommerce-session') || tokens.sessionToken;
    }

    if (!cart) {
      const message = 'Failed to retrieve cart data.';
      return NextResponse.json({ errors: { message } }, { status: 500 });
    }

    if (!customer) {
      const message = 'Failed to retrieve customer data.';
      return NextResponse.json({ errors: { message } }, { status: 500 });
    }

    if (!sessionToken) {
      const message = 'Failed to retrieve session token.';
      return NextResponse.json({ errors: { message } }, { status: 500 });
    }

    return NextResponse.json({ customer, cart, sessionToken });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ errors: { message: 'Sorry, something went wrong' } }, { status: 500 });
  }
}