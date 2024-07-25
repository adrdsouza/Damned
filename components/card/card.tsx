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
    <div className={`relative`}>
      <Link
        href={{
          pathname: `/product/${props.slug}`,
        }}
        className='relative w-full bg-white shadow flex justify-center items-center group/button'
      >
        {props.img && (
          <Image
            className='group-hover/button:opacity-50'
            src={`${props.img}`}
            width={1000}
            height={1000}
            alt='product image'
          />
        )}
        {!props.img && (
          <Image
            src='https://admin.damneddesigns.com/wp-content/uploads/woocommerce-placeholder-1000x1000.png'
            width={411}
            height={308}
            alt='product Image'
          />
        )}
        <div className='absolute text-white hidden group-hover/button:block'>
          <div className='flex items-center mt-2.5 mb-5'>
            <div className='flex items-center space-x-1 rtl:space-x-reverse'>
              <svg
                className='w-4 h-4 text-yellow-300'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-yellow-300'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-yellow-300'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-yellow-300'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
              <svg
                className='w-4 h-4 text-gray-200 dark:text-gray-600'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 22 20'
              >
                <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
              </svg>
            </div>
            <span className='bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3'>
              5.0
            </span>
            <span>{props.price}</span>
          </div>
        </div>
      </Link>
      {!props.stockStatus ? (
        <div
          className={`absolute font-semibold ${text.sm} top-2 left-2 bg-stone-400 px-3 py-2`}
        >
          Sold Out!
        </div>
      ) : null}
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
