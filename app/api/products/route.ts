import { NextResponse as BaseResponse } from 'next/server';
import {
  GetProductsQueryVariables,
  RootQueryToProductUnionConnection,
  getClientWithSdk,
} from '@/graphql';

type RequestBody = GetProductsQueryVariables;
type ResponseBody = RootQueryToProductUnionConnection;
const NextResponse = BaseResponse<ResponseBody>;

export async function POST(request: Request) {
  try {
    const params = (await request.json()) as RequestBody;
    const client = getClientWithSdk();
    const data = await client.GetProducts(params);

    if (!data.products) {
      throw new Error('Failed to fetch products');
    }

    return NextResponse.json(data.products);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errors: { message: 'Sorry, something went wrong' } },
      { status: 500 }
    );
  }
}
