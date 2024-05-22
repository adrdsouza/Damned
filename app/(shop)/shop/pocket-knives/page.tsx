import PocketKnivesMain from '@/components/shop/pocket-knives/page';
import { fetchProducts } from '@/lib/integration/products/query';

const PocketKnives: React.FC = async () => {
  const data = await fetchProducts('1181', '', '12');
  console.log(data);
  return (
    <div>      
      <PocketKnivesMain className='mx-5 mt-10' data={data} />
    </div>
  );
};

export default PocketKnives;
