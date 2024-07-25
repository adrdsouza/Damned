import { GraphQLClient } from 'graphql-request';
import deepmerge from 'deepmerge';
import { HOUR_IN_SECONDS } from '@woographql/session-utils';
import { apiCall } from '@/utils/apiCall';

import {
  RootQueryToProductUnionConnection,
  RootQueryToProductUnionConnectionWhereArgs,
  ProductCategory,
  getSdk,
  RootQueryToProductCategoryConnectionWhereArgs,
  ProductIdTypeEnum,
  GetProductsQueryVariables,
  CollectionStatsWhereArgs,
  CollectionStatsQueryInput,
  CollectionStats,
  RootQueryToProductCategoryConnection,
  Product,
  RootQueryToOrderConnectionWhereArgs,
  ordersQueryVariables,
  RootQueryToOrderConnection,
} from './generated';

export function getClient() {
  const endpoint = process.env.GRAPHQL_ENDPOINT;
  if (!endpoint) {
    throw new Error('GRAPHQL_ENDPOINT is not defined');
  }

  return new GraphQLClient(endpoint);
}

export function getClientWithSdk() {
  return getSdk(getClient());
}

const initialConnectionResults = {
  pageInfo: {
    hasNextPage: true,
    endCursor: null,
  },
  edges: [],
  nodes: [],
};

export function fetchProducts(variables: GetProductsQueryVariables = {}) {
  return apiCall<RootQueryToProductUnionConnection>(
    `${process.env.FRONTEND_URL}/api/products`,
    {
      method: 'POST',
      body: JSON.stringify(variables),
      next: { revalidate: 24 * HOUR_IN_SECONDS },
    }
  );
}

export function fetchOrders(variables: ordersQueryVariables = {}) {
  console.log('in fetch ORDERS\n\n\n');
  return apiCall<RootQueryToOrderConnection>(
    `${process.env.FRONTEND_URL}/api/orders`,
    {
      method: 'POST',
      body: JSON.stringify(variables),
      next: { revalidate: 24 * HOUR_IN_SECONDS },
    }
  );
}

export async function fetchProductsCount(
  where: RootQueryToProductUnionConnectionWhereArgs
) {
  try {
    const { found } = await apiCall<RootQueryToProductUnionConnection>(
      `${process.env.FRONTEND_URL}/api/products-count`,
      {
        method: 'POST',
        body: JSON.stringify({ where }),
        next: { revalidate: 24 * HOUR_IN_SECONDS },
      }
    );
    if (!found) {
      throw new Error('Products not found!!!');
    }
    return found;
  } catch (err) {
    console.log(err || 'Failed to fetch product listing!!!');
  }
}

export async function fetchCollectionStats(
  where: CollectionStatsWhereArgs,
  taxonomies: CollectionStatsQueryInput[]
) {
  return apiCall<CollectionStats>(
    `${process.env.FRONTEND_URL}/api/collection-data`,
    {
      method: 'POST',
      body: JSON.stringify({ where, taxonomies }),
      next: { revalidate: 24 * HOUR_IN_SECONDS },
    }
  );
}

export async function fetchCategories(
  pageSize: number,
  pageLimit = 0,
  where?: RootQueryToProductCategoryConnectionWhereArgs
) {
  try {
    let productCategories = initialConnectionResults;
    let after = '';
    let count = 0;
    while (
      productCategories.pageInfo.hasNextPage &&
      (pageLimit === 0 || count < pageLimit)
    ) {
      const next = await apiCall<RootQueryToProductCategoryConnection>(
        `${process.env.FRONTEND_URL}/api/categories`,
        {
          method: 'POST',
          body: JSON.stringify({
            first: pageSize,
            after,
            where,
          }),
          next: { revalidate: 24 * HOUR_IN_SECONDS },
        }
      );

      productCategories = deepmerge(productCategories, next);
      after = next?.pageInfo.endCursor || '';
      count++;
    }

    return productCategories.nodes as ProductCategory[];
  } catch (err) {
    console.log(err || 'Failed to fetch product categories!!!');
  }
}

export async function fetchProduct(id: string, idType: ProductIdTypeEnum) {
  return apiCall<Product>(`${process.env.FRONTEND_URL}/api/product`, {
    method: 'POST',
    body: JSON.stringify({ id, idType }),
    next: { revalidate: 24 * HOUR_IN_SECONDS },
  });
}
