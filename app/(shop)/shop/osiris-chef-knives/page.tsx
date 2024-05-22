import OrisisMain from "@/components/shop/orisis/page";
import { fetchProducts } from "@/lib/integration/products/query";

const Orisis:React.FC = async () => {
    const products = await fetchProducts('1269', '', '12');
    console.log(products);
    return (
        <div>
            <video loop autoPlay className="w-screen h-auto" src="https://damneddesigns.com/wp-content/uploads/Hero-Video.mp4">
				<source type="video/mp4" src="https://damneddesigns.com/wp-content/uploads/Hero-Video.mp4"/>				
			</video>
            <OrisisMain data={products}/>
        </div>
    )
}

export default Orisis;