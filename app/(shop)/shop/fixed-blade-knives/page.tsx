import FixedBladeKnivesMain from '@/components/shop/fixed-blade-knives/page';
import { fetchProducts } from '@/lib/integration/products/query';

const FixedBladeKnives: React.FC = async () => {
  const product = await fetchProducts('1266', '', '12');

  return (
    <div className='w-full px-[30px] py-[2em]  2xl:w-[1440px] m-auto'>
      <p className=''>Home / Fixed blade knives</p>
      <FixedBladeKnivesMain data={product} />
    </div>
  );
};

export default FixedBladeKnives;
