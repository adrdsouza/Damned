import { Suspense } from 'react';
import Carousel from '@/components/carousel/page';
import { fetchProduct } from '@/lib/integration/product/query';
import { ProductInfo } from '@/lib/graphql/type';
import ProductDetails from './ProductDetails';

const CerberusPage = async ({
  params,
}: {
  params: { productId: string; price: string };
}) => {
  const productId = params.productId;
  const price = params.price;

  const productInfo: ProductInfo = await fetchProduct(productId);

  let images = [
    productInfo.image.sourceUrl,
    ...productInfo.galleryImages.edges.map((d) => d.node.sourceUrl),
  ];

  return (
    <div
      className='2xl:w-[1440px] w-full px-[30px] m-auto py-[2em] md:py-[5em]
      flex flex-col lg:flex-row gap-10 
      '
    >
      <div className='w-full lg:w-1/2'>
        <Carousel images={images} />
      </div>
      <div className='w-full lg:w-1/2 flex flex-col gap-5 py-5'>
        <ProductDetails productInfo={productInfo} price={price} />
      </div>
    </div>
  );
};

export default async function SuspenseCerberus({
  params,
}: {
  params: { productId: string; price: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CerberusPage params={params} />
    </Suspense>
  );
}
