import { NextResponse as BaseResponse } from 'next/server';
import {
  getSingleorderQueryVariables,
  getClientWithSdk,
  getSingleorderQuery,
  getClient,
  getSingleorderDocument,
} from '@/graphql';

type RequestBody = getSingleorderQueryVariables;
type ResponseBody = getSingleorderQuery;
const NextResponse = BaseResponse<ResponseBody>;

export async function POST(request: Request) {
  try {
    const Clients = getClient();
    Clients.setHeaders({
      Authorization: `Basic ${process.env.CREATE_ORDER_PASSWORD}`,
    });

    const params = (await request.json()) as RequestBody;

    const data: any = await Clients.request(getSingleorderDocument, params);

    if (!data.order) {
      throw new Error('Order not found!!!');
    }

    return NextResponse.json(data.order);
  } catch (error: any) {
    return NextResponse.json(
      {
        errors: {
          message: 'Sorry, something went wrong',
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}
