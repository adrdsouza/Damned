import { NextResponse as BaseResponse } from 'next/server';

import { flattenObjectToParams } from '@/utils/apiCall';

type RequestBody = { [key: string]: string };

type ResponseBody = {
  stripeCustomerId: string;
} | {
  errors: {
    message: string;
  };
}

const NextResponse = BaseResponse<ResponseBody>;

export async function POST(request: Request) {
  try {
    const requestData = await request.json() as RequestBody;

    let url = 'https://api.stripe.com/v1/customers';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(process.env.STRIPE_SECRET_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: flattenObjectToParams(requestData).toString(),
    });

    if (!response.ok) {
      console.log(await response.json());
      console.log(response.statusText);
      throw new Error('Failed to create stripe customer account');
    }

    const json = await response.json();
    return NextResponse.json({
      stripeCustomerId: json.id,
    }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ errors: { message: 'Sorry, something went wrong' } }, { status: 500 });
  }
}