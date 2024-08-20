import { fetchProduct, ProductIdTypeEnum } from '@/graphql';
import ProductDetails from './ProductDetails';
import ImageCarousel from '@/components/carousel/page';
import { Metadata } from 'next';

export interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = params;
  const product: any = await fetchProduct(slug, ProductIdTypeEnum.SLUG);

  let images = [
    product?.image?.sourceUrl ??
      'https://admin.damneddesigns.com/wp-content/uploads/woocommerce-placeholder-1000x1000.png',
    ...product?.galleryImages?.nodes?.map(
      (d: any) =>
        d.sourceUrl ??
        'https://admin.damneddesigns.com/wp-content/uploads/woocommerce-placeholder-1000x1000.png'
    ),
  ];

  return {
    title: product?.name
      ? `${product.name} - Damned Designs`
      : 'Product not found',

    openGraph: {
      images: images,
    },
  };
}

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
