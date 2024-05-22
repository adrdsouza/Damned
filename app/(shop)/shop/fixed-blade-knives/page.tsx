import FixedBladeKnivesMain from "@/components/shop/fixed-blade-knives/page";
import { fetchProducts } from "@/lib/integration/products/query";

const FixedBladeKnives: React.FC = async () => {
  const product = await fetchProducts('1266', '', '12');
  
  return (
    <div>
      <FixedBladeKnivesMain className="mx-5 mt-10" data={product} />
    </div>
  );
};

export default FixedBladeKnives;
