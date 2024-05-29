import FixedBladeKnivesMain from "@/components/shop/fixed-blade-knives/page";
import { fetchProducts } from "@/lib/integration/products/query";

const FixedBladeKnives: React.FC = async () => {
  const product = await fetchProducts('1266', '', '12');
  
  return (
    <div className="px-5">
      <p className="mt-5">Home / Fixed blade knives</p>
      <FixedBladeKnivesMain data={product} />
    </div>
  );
};

export default FixedBladeKnives;
