import Sidekidkpry from "@/components/shop/sidekick-pry-bars/page";
import { fetchProducts } from "@/lib/integration/products/query";

export default async function SideKid () {
    const products = await fetchProducts("1270", '', '12');
    console.log(products);
    return (
        <>
            <Sidekidkpry data={products} />
        </>
    )
}