'use client';

import Link from 'next/link';
import Card from './card';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CardsProps {
  className?: string;
}

const Cards: React.FC<CardsProps> = (props) => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: (
      <div>
        <div className='next-slick-arrow'>
          <svg
            className='h-8 w-8 px-1 py-1 text-black rounded-full ring-2 ring-slate-200 hover:ring-4 hover:ring-slate-100'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' />
            <polyline points='9 6 15 12 9 18' />
          </svg>
        </div>
      </div>
    ),
    prevArrow: (
      <div>
        <div className='prev-slick-arrow rounded-full shadow'>
          <svg
            className='h-8 w-8 px-1 py-1 text-black rounded-full ring-2 ring-slate-200 hover:ring-4 hover:ring-slate-100'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path stroke='none' d='M0 0h24v24H0z' />
            <polyline points='15 6 9 12 15 18' />
          </svg>
        </div>
      </div>
    ),
  };

  return (
    <div
      className={`${props.className} flex flex-col gap-5 py-[1em] md:py-[5em] `}
    >
      <p className='text-2xl text-center '>A PROVEN TRACK RECORD!</p>
      <div className='flex flex-col sm:flex-row items-center justify-between '>
        <div className='flex items-center'>
          <p className='text-xl px-2 font-semibold text-slate-500'>4.7</p>
          <div className='flex items-center gap-1'>
            <svg
              className='h-5 w-5 text-[#417505]'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                fill='#417505'
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              />
            </svg>
            <svg
              className='h-5 w-5 text-[#417505]'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                fill='#417505'
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              />
            </svg>
            <svg
              className='h-5 w-5 text-[#417505]'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                fill='#417505'
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              />
            </svg>
            <svg
              className='h-5 w-5 text-[#417505]'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                fill='#417505'
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              />
            </svg>
            <svg
              className='h-5 w-5 text-[#417505]'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                fill='#417505'
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              />
            </svg>
          </div>
        </div>
        <Link
          href='https://www.trustpilot.com/review/damneddesigns.com'
          target='_blank'
          className='px-2 py-2 bg-black text-white rounded hover:text-stone-200 flex jsutify-around items-center'
        >
          <svg
            className='h-8 w-8 text-green-100'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            {' '}
            <path stroke='none' d='M0 0h24v24H0z' />{' '}
            <path d='M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3' />{' '}
            <path d='M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3' />{' '}
            <line x1='16' y1='5' x2='19' y2='8' />
          </svg>
          Write a Review
        </Link>
      </div>
      <div style={{ width: 'calc(100% - 50px)' }} className=' m-auto'>
        <Slider {...settings}>
          <Card
            name='Gray'
            className='mx-2 px-2 pt-5 pb-2'
            time='2 years ago'
            star={3}
            text='I have multiple Dammed design Knives and love every one for a different reasons. The last 3 fixed blades I got exceed all expatiations. First quality of the product next the design and last the shipping experience.
                    The know how to make the customer happy.'
          />
          <Card
            name='Gray'
            className='mx-2 px-2 pt-5 pb-2'
            time='2 years ago'
            star={3}
            text='I have multiple Dammed design Knives and love every one for a different reasons. The last 3 fixed blades I got exceed all expatiations. First quality of the product next the design and last the shipping experience.
                    The know how to make the customer happy.'
          />
          <Card
            name='Gray'
            className='mx-2 px-2 pt-5 pb-2'
            time='2 years ago'
            star={3}
            text='I have multiple Dammed design Knives and love every one for a different reasons. The last 3 fixed blades I got exceed all expatiations. First quality of the product next the design and last the shipping experience.
                    The know how to make the customer happy.'
          />
        </Slider>
      </div>
    </div>
  );
};

export default Cards;
