import { NextResponse as BaseResponse } from 'next/server';
import {
  GetProductsQueryVariables,
  RootQueryToOrderConnection,
  RootQueryToProductUnionConnection,
  getClient,
  getClientWithSdk,
  ordersDocument,
  ordersQuery,
  ordersQueryVariables,
} from '@/graphql';

type RequestBody = ordersQueryVariables;
type ResponseBody = RootQueryToOrderConnection;
const NextResponse = BaseResponse<ResponseBody>;

export async function POST(request: Request) {
  console.log('in orders route \n\n\n');
  try {
    const params = (await request.json()) as RequestBody;

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

    const data = await client.request<ordersQuery>(ordersDocument, params);

    // const client = getClientWithSdk();

    // const data = await client.orders(params);

    if (!data.orders) {
      throw new Error('Failed to fetch orders');
    }

    return NextResponse.json(data.orders);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errors: { message: 'Sorry, something went wrong' } },
      { status: 500 }
    );
  }
}
