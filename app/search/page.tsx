import { text } from '../styles';
import { fetchProducts } from '@/graphql';
import ProductsList from '@/components/shop/products-listing';

const SearchPage = async ({ searchParams }: any) => {
  const { query } = searchParams;
  const { nodes: products } = await fetchProducts({
    first: 30,
    where: { search: query ?? '' },
  });

  return (
    <div className='w-full px-8 py-4'>
      <p
        className={`${text.md} font-medium`}
      >{`Search results for "${query}"`}</p>
      <ProductsList data={products} showPagination={true} />
    </div>
  );
};

export default SearchPage;
