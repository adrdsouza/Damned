import { NextResponse as BaseResponse } from 'next/server';

import {
  InventoriedProduct,
  ProductIdTypeEnum,
  ProductVariation,
  ProductVariationIdTypeEnum,
  ProductWithPricing,
  ProductWithVariations,
  getClientWithSdk,
} from '@/graphql';

type ResponseBody = {
  product: InventoriedProduct & ProductWithVariations & ProductWithPricing;
} | {
  variation: ProductVariation;
} | {
  errors: {
    message: string;
  };
}

const NextResponse = BaseResponse<ResponseBody>;

export async function GET(
  request: Request,
  { params }: { params: { ids: [product: string, variationId?: string] } },
) {
  const { ids: [productId, variationId] } = params;
  try {
    const client = getClientWithSdk();

    if (variationId) {
      const data = await client.GetProductVariation({ id: variationId, idType: ProductVariationIdTypeEnum.DATABASE_ID });

      if (!data.productVariation) {
        return NextResponse.json({ errors: { message: 'Product variation not found' } }, { status: 404 });
      }

      return NextResponse.json({ variation: data.productVariation });
    }

    const data = await client.GetProduct({ id: productId, idType: ProductIdTypeEnum.DATABASE_ID });

    if (!data.product) {
      return NextResponse.json({ errors: { message: 'Product not found' } }, { status: 404 });
    }

    return NextResponse.json({ product: data.product });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ errors: { message: 'Sorry, something went wrong' } }, { status: 500 });
  }
}