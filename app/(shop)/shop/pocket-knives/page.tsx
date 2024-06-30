import ProductsList from '@/components/shop/products-listing';
import Products from '@/components/shop/products-listing/products';
import { fetchProducts } from '@/graphql';

const PocketKnives: React.FC = async ({}) => {
  //const data = await fetchProducts('1181', '', '12');

  return (
    <div className='flex m-auto px-[30px] w-full 2xl:w-[1440px] py-[2em] md:py-[5em]'>
      <Products id={1181} showPagination={true} />
    </div>
  );
};

export default PocketKnives;
