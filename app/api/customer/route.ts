import { NextResponse } from 'next/server';
import { print } from 'graphql/language/printer';

import {
  UpdateCustomerInput,
  UpdateCustomerDocument,
  UpdateCustomerMutation,
  Customer,
  getClient,
} from '@/graphql';

type RequestBody = {
  sessionToken: string;
  authToken: string;
  input: {
    mutation: 'updateCustomer';
    input: UpdateCustomerInput;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    const { mutation, ...variables } = body.input;

    if (!body.sessionToken) {
      return NextResponse.json({ errors: { message: 'Missing credentials' } }, { status: 500 });
    }

    const headers: Record<string, string> = {
      'woocommerce-session': `Session ${body.sessionToken}`,
    };
    if (body.authToken) {
      headers.Authorization = `Bearer ${body.authToken}`;
    }
    const client = getClient();
    client.setHeaders(headers);

    const results = await client.rawRequest<UpdateCustomerMutation>(
      print(UpdateCustomerDocument),
      variables,
    );

    const customer = results?.data?.updateCustomer?.customer as Customer;
    if (!customer) {
      const message = 'Failed to update customer data';
      return NextResponse.json({ errors: { message } }, { status: 500 });
    }

    let sessionToken = results.headers.get('woocommerce-session') || body.sessionToken;

    return NextResponse.json({ customer, sessionToken });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ errors: { message: 'Sorry, something went wrong' } }, { status: 500 });
  }
}