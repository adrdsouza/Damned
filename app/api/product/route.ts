import { NextResponse as BaseResponse } from 'next/server';
import {
  GetProductQueryVariables,
  ProductUnion,
  getClientWithSdk,
} from '@/graphql';

type RequestBody = GetProductQueryVariables
type ResponseBody = ProductUnion;
const NextResponse = BaseResponse<ResponseBody>;

export async function POST(request: Request) {
  try {
    const params = await request.json() as RequestBody;
    const client = getClientWithSdk();
    const data = await client.GetProduct(params);

    if (!data.product) {
      throw new Error('Product not found!!!');
    }

    return NextResponse.json(data.product);

  } catch (error) {
    console.log(error);
    return NextResponse.json({ errors: { message: 'Sorry, something went wrong' } }, { status: 500 });
  }
}
