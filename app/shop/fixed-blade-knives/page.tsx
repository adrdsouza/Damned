import ProductsList from '@/components/shop/products-listing';
import { fetchProducts, OrderEnum, ProductsOrderByEnum } from '@/graphql';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Fixed Blade Knives - Damned Designs',
};

const FixedBladeKnives: React.FC = async ({ searchParams }: any) => {
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
      categoryId: 1266,
      orderby: orderby as any,
    },
  });

  return (
    <div className='w-full h-full min-h-[500px] px-8 py-4 m-auto'>
      <ProductsList
        data={products as any}
        showPagination={true}
        title={'Fixed Blade Knives'}
      />
    </div>
  );
};

export default FixedBladeKnives;
