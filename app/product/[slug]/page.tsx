import { type Product } from '@woographql/react-hooks';
import { fetchProduct, ProductIdTypeEnum } from '@/graphql';
import ProductDetails from './ProductDetails';
import { ProductProvider } from '@/client/ProductProvider';
import ImageCarousel from '@/components/carousel/page';

export interface ProductPageProps {
  params: {
    slug: string;
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = params;
  const product: any = await fetchProduct(slug, ProductIdTypeEnum.SLUG);

  if (!slug || !product) return <h1>Product not found</h1>;

  let images = [
    product?.image?.sourceUrl ??
      'https://admin.damneddesigns.com/wp-content/uploads/woocommerce-placeholder-1000x1000.png',
    ...product?.galleryImages?.nodes?.map(
      (d: any) =>
        d.sourceUrl ??
        'https://admin.damneddesigns.com/wp-content/uploads/woocommerce-placeholder-1000x1000.png'
    ),
  ];

  return (
    <div className='w-full px-8 m-auto py-8 flex flex-col lg:flex-row gap-10'>
      <div className='w-full lg:w-1/2'>
        <ImageCarousel images={images} />
      </div>
      <div className='w-full lg:w-1/2 flex flex-col gap-5 py-5'>
        <ProductDetails product={product} />
      </div>
    </div>
  );
};

export default ProductPage;
