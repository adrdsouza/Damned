import DashboardBack from '@/components/dashboardBack';
import ProductsList from '@/components/shop/products-listing';
import { fetchProducts, OrderEnum, ProductsOrderByEnum } from '@/graphql';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Every Day Carry: EDC tools and accessories - Damned Designs',
  description:
    'EDC tools, expertly crafted with great attention to detail. Damned Designs is where breathtaking aesthetics meets uncompromising functionality.',
};

const Edc = async ({ searchParams }: any) => {
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
      categoryId: 1143,
      orderby: orderby as any,
    },
  });

  return (
    <div>
      <DashboardBack page='edc' />

      <div className='flex m-auto px-8 w-full h-[400px] md:h-screen'>
        <div className='text-white my-auto text-center md:text-left'>
          <p className='text-2xl md:text-3xl mb-2'>POCKET ART</p>
          <p className='text-base mb-4'>
            From knucks to beads from patches to coins. This is where you’ll
            find them.
          </p>
        </div>
      </div>

      <div className='flex m-auto px-8 min-h-[500px] h-full py-8 bg-white w-full'>
        <ProductsList
          data={products as any}
          showPagination={true}
          title={'Pocket Art'}
        />
      </div>
    </div>
  );
};

export default Edc;
