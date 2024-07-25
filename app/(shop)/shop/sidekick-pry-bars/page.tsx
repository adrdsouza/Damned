import { text } from '@/app/styles';
import ProductsList from '@/components/shop/products-listing';
import Products from '@/components/shop/products-listing/products';
import { fetchProducts } from '@/graphql';

import Image from 'next/image';

export default async function SideKid() {
  return (
    <div>
      <div className='relative flex justify-center items-center'>
        <Image
          className='w-screen h-screen object-cover'
          src='https://admin.damneddesigns.com/wp-content/uploads/IMG_23fh38.png'
          width={1000}
          height={1000}
          alt=''
        />
        <div className='absolute text-white w-full px-[30px] py-[2em] md:py-[5em] 2xl:w-[1440px] m-auto'>
          <p className={`${text.lg} mb-2`}>SIDEKICK PRY BARS</p>
          <p className={`${text.md} mb-2`}>FUNCTION X AESTHETIC</p>
          <p className={`${text.md}`}>
            Do we love creammig as much functionally into our products as
            possible? Or course, we do! The Sidekick pry have mm and inch
            measuring, a bubble level, a 1/4, wrench and driver hole and storage
            for 1 or 2 bids. And yes, it can pry!
          </p>
        </div>
      </div>
      <div className='w-full px-[30px] py-[2em] md:py-[5em] 2xl:w-[1440px] m-auto'>
        <Products id={1270} showPagination={false} />
      </div>
      <div
        className='flex flex-col md:flex-row w-full'
        style={{
          backgroundImage:
            "url('https://admin.damneddesigns.com/wp-content/uploads/1626981433015-scaled-e1714662604922.jpg')",
          backgroundSize: 'cover',
        }}
      >
        <div className='w-full md:w-1/2 h-screen'>
          <Image
            className='h-full w-full object-cover'
            src='https://admin.damneddesigns.com/wp-content/uploads/IMG_5234.jpg'
            width={1000}
            height={1000}
            alt='this is bar'
          />
        </div>
        <div className='w-full md:w-1/2 flex h-screen justify-center'>
          <div className='m-auto text-center w-[90%] md:w-1/2'>
            <p className={`${text.lg} text-white`}>Do More</p>
            <p className={`${text.lg} italic text-gray-300 `}>Bit by bit</p>
            <p className={`${text.md} text-white`}>
              {`Want to maintain your knife on the go? Replace the supplied bits
              with the relevant torq bits in our bit storage compartments with
              magnetic lids and you're good to go!`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
