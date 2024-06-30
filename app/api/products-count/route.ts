import { NextResponse as BaseResponse } from 'next/server';
import {
  RootQueryToProductUnionConnectionWhereArgs,
  getClientWithSdk,
} from '@/graphql';

type RequestBody = { where: RootQueryToProductUnionConnectionWhereArgs }
type ResponseBody = { found: number };
const NextResponse = BaseResponse<ResponseBody>;

export async function POST(request: Request) {
  try {
    const params = await request.json() as RequestBody;
    const client = getClientWithSdk();
    const data = await client.GetProductsCount(params);

    if (!data.products) {
      throw new Error('Failed to fetch products');
    }

    return NextResponse.json({ found: data.products.found });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ errors: { message: 'Sorry, something went wrong' } }, { status: 500 });
  }
}
