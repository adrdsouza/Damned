import type { Product } from '@woographql/react-hooks';

import { fetchProduct, ProductIdTypeEnum } from '@/graphql';
import { Suspense } from 'react';
import Carousel from '@/components/carousel/page';

import { ProductInfo } from '@/lib/graphql/type';
import ProductDetails from './ProductDetails';

export interface ProductPageProps {
  params: {
    slug: string;
  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = params;
  const product: any = await fetchProduct(slug, ProductIdTypeEnum.SLUG);

  console.log(product);

  if (!slug || !product) return <h1>Page not found</h1>;

  let images = [
    product?.image?.sourceUrl,
    ...product?.galleryImages?.nodes?.map((d: any) => d.sourceUrl),
  ];

  return (
    <div
      className='2xl:w-[1440px] w-full px-[30px] m-auto py-[2em] md:py-[5em]
      flex flex-col lg:flex-row gap-10'
    >
      <div className='w-full lg:w-1/2'>
        <Carousel images={images} />
      </div>
      <div className='w-full lg:w-1/2 flex flex-col gap-5 py-5'>
        <ProductDetails productInfo={product} price={product.price} />
      </div>
    </div>
  );
};

export default ProductPage;
