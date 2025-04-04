import { NextResponse as BaseResponse } from 'next/server';

import { flattenObjectToParams } from '@/utils/apiCall';

type RequestBody = { [key: string]: string } & { clientSecret?: string };

type ResponseBody =
  | {
      intentId: string;
      clientSecret: string;
    }
  | {
      errors: {
        message: string;
      };
    };

const NextResponse = BaseResponse<ResponseBody>;

export async function POST(request: Request) {
  try {
    const { intentId, ...requestData } = (await request.json()) as RequestBody;

    let url = 'https://api.stripe.com/v1/payment_intents';
    if (intentId) {
      url = `${url}/${intentId}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.STRIPE_SECRET_KEY + ':'
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: flattenObjectToParams(requestData).toString(),
    });

    if (!response.ok) {
      return NextResponse.json(
        { errors: { message: 'Failed to create payment intent' } },
        { status: 500 }
      );
    }

    const json = await response.json();
    return NextResponse.json(
      {
        intentId: json.id,
        clientSecret: json.client_secret,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errors: { message: 'Sorry, something went wrong' } },
      { status: 500 }
    );
  }
}
