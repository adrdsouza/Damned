import ProductsList from '@/components/shop/products-listing';
import { fetchProducts } from '@/graphql';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fixed Blade Knives - Damned Designs',
};

const FixedBladeKnives: React.FC = async () => {
  try {
    const { nodes: products } = await fetchProducts({
      first: 30,
      where: { categoryId: 1266 },
    });

    if (!products) {
      return <div>No products found</div>;
    }

    return (
      <div className='w-full h-full min-h-[500px] px-8 py-4 m-auto'>
        <ProductsList data={products} showPagination={true} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return <div>No products found</div>;
  }
};

export default FixedBladeKnives;
