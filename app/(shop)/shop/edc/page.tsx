import EdcMain from '@/components/shop/edc/page';
import EdcBack from '@/components/shop/edc/edcBack';
import { fetchProducts } from '@/lib/integration/products/query';

const Edc:React.FC = async () => {    
    const products = await fetchProducts('1143');
    // console.log(products);
    return(
        <div>
            <EdcBack />
            <EdcMain className="mx-5 mt-10" data={products} />
        </div>
    )
}

export default Edc;