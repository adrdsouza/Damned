import { useState, useEffect } from 'react';
import { DAY_IN_SECONDS } from '@woographql/session-utils';

import { apiCall } from '@/utils/apiCall';
import {
  InventoriedProduct,
  ProductVariation,
  ProductWithPricing,
  ProductWithVariations,
  Product as ProductInterface,
} from '@/graphql';

type Product = ProductInterface &
  InventoriedProduct &
  ProductWithVariations &
  ProductWithPricing;

export function useFetchProduct(productId: number, variationId?: number) {
  const [product, setProduct] = useState<Product>();
  const [variation, setVariation] = useState<ProductVariation>();

  useEffect(() => {
    if (variationId) {
      apiCall<{ variation: ProductVariation }>(
        `/api/product/${productId}/${variationId}`,
        {
          method: 'GET',
          cache: 'force-cache',
          next: { revalidate: DAY_IN_SECONDS },
        }
      ).then(({ variation }) => setVariation(variation));
    }
  }, [productId, variationId]);

  useEffect(() => {
    apiCall<{ product: Product }>(`/api/product/${productId}`, {
      method: 'GET',
      cache: 'force-cache',
      next: { revalidate: DAY_IN_SECONDS },
    }).then(({ product }) => setProduct(product));
  }, [productId]);

  return { product, variation };
}
