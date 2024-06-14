import PocketKnivesMain from '@/components/shop/pocket-knives/page';
import { fetchProducts } from '@/lib/integration/products/query';

const PocketKnives: React.FC = async () => {
  const data = await fetchProducts('1181', '', '12');
  return (
    <div className='w-full px-[30px] py-[2em] md:py-[5em] 2xl:w-[1440px] m-auto'>
      <span>shop/poket-knives</span>
      <PocketKnivesMain data={data} />
    </div>
  );
};

export default PocketKnives;
