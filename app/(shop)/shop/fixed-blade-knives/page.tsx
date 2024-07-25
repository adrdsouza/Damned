import ProductsList from '@/components/shop/products-listing';
import Products from '@/components/shop/products-listing/products';
import { fetchProducts } from '@/graphql';

const FixedBladeKnives: React.FC = async () => {
  return (
    <div className='w-full px-[30px] py-[2em] md:[5em] 2xl:w-[1440px] m-auto'>
      <p className=''>Home / Fixed blade knives</p>
      <Products id={1266} showPagination={true} />
    </div>
  );
};

export default FixedBladeKnives;
