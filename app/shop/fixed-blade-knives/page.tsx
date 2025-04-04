import ProductsList from '@/components/shop/products-listing';
import { fetchProducts } from '@/graphql';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Fixed Blade Knives - Damned Designs',
};

const FixedBladeKnives: React.FC = async () => {
  const { nodes: products } = await fetchProducts({
    first: 30,
    where: { categoryId: 1266 },
  });

  return (
    <div className='w-full h-full min-h-[500px] px-8 py-4 m-auto'>
      <ProductsList data={products} showPagination={true} />
    </div>
  );
};

export default FixedBladeKnives;
