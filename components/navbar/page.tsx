'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface NavbarProps {
  style?: Boolean;
}

const Page: React.FC<NavbarProps> = (props) => {
  const [hover, setHover] = useState<Boolean>();

  return (
    <div
      className={`flex w-full transition-all hover:bg-white duration-300  z-50 ${
        props.style ? 'text-slate-100' : 'text-slate-900 bg-white'
      } hover:text-slate-700`}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <div className='m-auto w-full xl:w-[1440px] px-[30px] py-[10px] flex justify-between'>
        <Link href='/' className='self-left'>
          {props.style ? (
            hover ? (
              <Image
                src='https://damnedventures.com/wp-content/uploads/Asset-14.png'
                width={100}
                height={100}
                alt='this is mark'
                className='w-12 hover:opacity-50'
              />
            ) : (
              <Image
                src='https://damnedventures.com/wp-content/uploads/Asset-12.png'
                width={100}
                height={100}
                alt='this is mark'
                className='w-12 hover:opacity-50'
              />
            )
          ) : (
            <Image
              src='https://damnedventures.com/wp-content/uploads/Asset-14.png'
              width={100}
              height={100}
              alt='this is mark'
              className='w-12 hover:opacity-50'
            />
          )}
        </Link>
        <div className='flex lg:justify-around lg:gap-10 lg:text-xl text-lg font-semibold'>
          <div className='flex flex-col justify-center'>
            <div className='items-center mx-auto'>
              <div className='relative group/bouton flex items-center'>
                <button className='hover:text-slate-400'>SHOP</button>
                <div>
                  <svg
                    className='h-4 w-4 ml-2'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='currentColor'
                    fill='none'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    {' '}
                    <path stroke='none' d='M0 0h24v24H0z' />{' '}
                    <polyline points='6 9 12 15 18 9' />
                  </svg>
                </div>
                <div className='absolute top-full lg:left-[-35vw] left-[-10vw] opacity-0 hidden lg:group-hover/bouton:flex lg:flex-wrap lg:justify-center group-hover/bouton:grid grid-cols-1 gap-[2vw] group-hover/bouton:opacity-100 lg:w-[80vw] w-[60vw] bg-[#a89c9c] py-5 z-10 text-slate-700'>
                  <Link
                    href='/shop/osiris-chef-knives'
                    className='hover:text-slate-200'
                  >
                    OSIRIS CHEF KNIFE
                  </Link>
                  <Link
                    href='/shop/pocket-knives'
                    className='hover:text-slate-200'
                  >
                    POCKET KNIVES
                  </Link>
                  <Link
                    href='/shop/fixed-blade-knives'
                    className='hover:text-slate-200'
                  >
                    FIXED BLADE KNIVES
                  </Link>
                  <Link href='/shop/edc' className='hover:text-slate-200'>
                    POCKET ART
                  </Link>
                  <Link href='/shop/fidget' className='hover:text-slate-200'>
                    FIDGET
                  </Link>
                  <Link
                    href='/shop/sidekick-pry-bars'
                    className='hover:text-slate-200'
                  >
                    SIDEKICK PRY BARS
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Link href='/help' className='flex items-center hover:text-slate-400'>
            HELP
            <svg
              className='h-4 w-4 text-gray-300 ml-2'
              viewBox='0 0 24 24'
              strokeWidth='2'
              stroke='currentColor'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              {' '}
              <path stroke='none' d='M0 0h24v24H0z' />{' '}
              <circle cx='10' cy='10' r='7' />{' '}
              <line x1='21' y1='21' x2='15' y2='15' />
            </svg>
          </Link>
        </div>
        <Link href='/my-account'>
          <svg
            className='h-8 w-8 hover:text-slate-400'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            {' '}
            <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />{' '}
            <circle cx='12' cy='7' r='4' />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Page;
