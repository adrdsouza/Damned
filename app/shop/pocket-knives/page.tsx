import ProductsList from '@/components/shop/products-listing';
import { fetchProducts } from '@/graphql';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Premium Folding Pocket Knives for All Occasions - Damned Designs',
  description:
    'Damned Designs offers expertly crafted folding knives that are both beautiful to look at and tremendously functional. Affordable yet substantial.',
};

const PocketKnives: React.FC = async () => {
  const { nodes: products } = await fetchProducts({
    first: 30,
    where: { categoryId: 1181 },
  });

  return (
    <div className='flex m-auto px-8 h-full w-full py-4 '>
      <ProductsList data={products} showPagination={true} />
    </div>
  );
};

export default PocketKnives;
