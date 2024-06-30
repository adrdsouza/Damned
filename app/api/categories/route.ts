import { NextResponse as BaseResponse } from 'next/server';

import {
  RootQueryToProductCategoryConnection,
  RootQueryToProductCategoryConnectionWhereArgs,
  getClientWithSdk,
} from '@/graphql';

type RequestBody = {
  first: number;
  after?: string;
  before?: string;
  last?: number;
  where?: RootQueryToProductCategoryConnectionWhereArgs;
};

type ResponseBody = RootQueryToProductCategoryConnection;
const NextResponse = BaseResponse<ResponseBody>;

export async function POST(request: Request) {
  try {
    const params = (await request.json()) as RequestBody;
    const client = getClientWithSdk();
    const data = await client.GetShopCategories(params);

    if (!data.productCategories) {
      throw new Error('Failed to fetch categories');
    }

    return NextResponse.json(data.productCategories);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errors: { message: 'Sorry, something went wrong' } },
      { status: 500 }
    );
  }
}
