import { NextResponse as BaseResponse } from 'next/server';
import {
  CollectionStats,
  CollectionStatsQueryInput,
  CollectionStatsWhereArgs,
  getClientWithSdk,
} from '@/graphql';

type RequestBody = {
  where: CollectionStatsWhereArgs,
  taxonomies: CollectionStatsQueryInput[],
}
type ResponseBody = CollectionStats;
const NextResponse = BaseResponse<ResponseBody>;

export async function POST(request: Request) {
  try {
    const params = await request.json() as RequestBody;
    const client = getClientWithSdk();
    const data = await client.GetCollectionStats(params);

    if (!data.collectionStats) {
      throw new Error('Failed to fetch the collection statistics');
    }

    return NextResponse.json(data.collectionStats);

  } catch (error) {
    console.log(error);
    return NextResponse.json({ errors: { message: 'Sorry, something went wrong' } }, { status: 500 });
  }
}
