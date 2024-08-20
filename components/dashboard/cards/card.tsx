'use client';

import { text } from '@/app/styles';
import Image from 'next/image';
import { useState } from 'react';

interface CardProps {
  name?: string;
  time?: string;
  star?: Number;
  text?: string;
}

const Card: React.FC<CardProps> = (props) => {
  const [wrap, setWrap] = useState(false);

  const starArray = [0, 1, 2, 3, 4];

  return (
    <div className='min-h-[150px] p-4'>
      <div className='w-full flex justify-between'>
        <div className='flex items-center gap-4'>
          <Image
            src='https://admin.damneddesigns.com/wp-content/plugins/reviews-feed-pro/vendor/smashballoon/customizer/sb-common/sb-customizer/assets/images/avatar.jpg'
            width={50}
            height={50}
            alt=''
          />
          <div>
            <p className={`${text.md} font-semibold`}>{props.name}</p>
            <p className={`${text.md}`}>{props.time}</p>
          </div>
        </div>
        <Image
          src='https://admin.damneddesigns.com/wp-content/plugins/reviews-feed-pro/assets/icons/trustpilot-provider.svg'
          width={25}
          height={25}
          alt='star'
        />
      </div>
      <div className='flex items-center gap-1 py-4'>
        {starArray.map((value, index) => (
          <span key={index}>
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
          </span>
        ))}
      </div>
      <div
        className={`${text.md} cursor-pointer truncate ${wrap && 'text-wrap'}`}
        onClick={() => setWrap(!wrap)}
      >
        {props.text}
      </div>
    </div>
  );
};

export default Card;
