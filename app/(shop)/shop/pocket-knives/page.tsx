import ProductsList from '@/components/shop/products-listing';
import { fetchProducts } from '@/graphql';

const PocketKnives = async () => {
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
