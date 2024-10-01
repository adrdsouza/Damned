import ProductsList from '@/components/shop/products-listing';
import {
  fetchProducts,
  OrderEnum,
  OrdersOrderByEnum,
  ProductsOrderByEnum,
} from '@/graphql';
import { VariableProduct } from '@woographql/react-hooks';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Premium Folding Pocket Knives for All Occasions - Damned Designs',
  description:
    'Damned Designs offers expertly crafted folding knives that are both beautiful to look at and tremendously functional. Affordable yet substantial.',
};

const PocketKnives: React.FC = async ({ searchParams }: any) => {
  const { field, order } = searchParams;

  let orderby: {
    field: ProductsOrderByEnum | null;
    order: OrderEnum | null;
  }[] = [];

  if (field && order) {
    const fieldEnum =
      ProductsOrderByEnum[field as keyof typeof ProductsOrderByEnum] ?? null;
    const orderEnum = OrderEnum[order as keyof typeof OrderEnum] ?? null;

    if (fieldEnum && orderEnum) {
      orderby.push({ field: fieldEnum, order: orderEnum });
    }
  }

  const { nodes: products } = await fetchProducts({
    first: 99,
    where: {
      categoryId: 1181,
      orderby: orderby as any,
    },
  });

  return (
    <div className='flex m-auto px-8 h-full w-full py-4 '>
      <ProductsList data={products as any} showPagination={true} />
    </div>
  );
};

export default PocketKnives;
