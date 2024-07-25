'use client';

import { text } from '@/app/styles';
import Image from 'next/image';
import Link from 'next/link';
interface PocketItemProps {
  className?: string;
  productId?: string;
  name?: string;
  price?: number;
  slug?: string;
  img?: any;
  star?: Number;
  onSale: Boolean | undefined;
  stockStatus: Boolean;
}

const Card: React.FC<PocketItemProps> = (props) => {
  return (
    <div>
      <Link href={`/product/${props.slug}`}>
        <div className='relative cursor-pointer'>
          <div className='transition-all ease-in duration-100 absolute h-full w-full hover:bg-stone-400 opacity-50 z-[1]' />
          <Image
            className=' w-full h-full'
            src={
              props.img ??
              'https://admin.damneddesigns.com/wp-content/uploads/woocommerce-placeholder-1000x1000.png'
            }
            width={1000}
            height={1000}
            alt=''
          />
          {!props.stockStatus ? (
            <div
              className={`absolute font-semibold ${text.sm} top-2 left-2 bg-stone-400 px-3 py-2`}
            >
              Sold Out
            </div>
          ) : null}
        </div>
      </Link>

      <div className='my-4'>
        <h5 className={`${text.md} mb-2 text-gray-600 font-medium uppercase`}>
          {props.name}
        </h5>
        <p className={`${text.md} font-light`}>{props.price}</p>
      </div>
    </div>
  );
};

export default Card;
