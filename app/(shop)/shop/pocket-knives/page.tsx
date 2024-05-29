import PocketKnivesMain from '@/components/shop/pocket-knives/page';
import { fetchProducts } from '@/lib/integration/products/query';

const PocketKnives: React.FC = async () => {
  const data = await fetchProducts('1181', '', '12');
  return (
    <div className='mt-4 px-5'>
      <span>shop/poket-knives</span>
      <PocketKnivesMain data={data} />
    </div>
  );
};

export default PocketKnives;
