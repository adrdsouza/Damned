import { NextResponse as BaseResponse } from 'next/server';

import {
  Order,
  CreateOrderInput,
  CreateOrderDocument,
  CreateOrderMutation,
  getClient,
} from '@/graphql';

type RequestBody = CreateOrderInput;

type ResponseBody =
  | {
      order: Order;
    }
  | {
      errors: {
        message: string;
      };
    };

const NextResponse = BaseResponse<ResponseBody>;

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as RequestBody;
    if (!input.customerId && !input.billing?.email) {
      return NextResponse.json(
        { errors: { message: 'Missing user identifiers' } },
        { status: 500 }
      );
    }

    const client = getClient();
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

    client.setHeaders({
      Authorization: `Basic ${process.env.CREATE_ORDER_PASSWORD}`,
    });

    const { createOrder } = await client.request<CreateOrderMutation>(
      CreateOrderDocument,
      {
        input: {
          ...input,
          isPaid: true,
        },
      }
    );

    if (!createOrder?.order) {
      return NextResponse.json(
        { errors: { message: 'Failed to create order' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ order: createOrder.order });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errors: { message: 'Sorry, something went wrong' } },
      { status: 500 }
    );
  }
}
