'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface SezzleProps {
  onShow: any;
}

export function Sezzle(props: SezzleProps) {
  return (
    <div
      className='flex flex-col justify-center items-center fixed top-0 left-0 w-screen h-lvh z-[50] text-center'
      onClick={() => props.onShow(false)}
    >
      <div className='w-1/2 flex flex-col justify-center items-center px-10 py-5 gap-10 shadow-2xl bg-white rounded'>
        <div
          className='flex self-end cursor-pointer'
          onClick={() => props.onShow(false)}
        >
          <svg
            className='justify-items-end'
            xmlns='https://www.w3.org/2000/svg'
            height='36px'
            viewBox='0 0 24 24'
            width='36px'
            fill='#000000'
          >
            <path d='M0 0h24v24H0z' fill='none'></path>
            <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'></path>
          </svg>
        </div>
        <Image
          className='w-full h-full'
          src='https://admin.damneddesigns.com/wp-content/uploads/Abandoned-Cart-Email-Large-banner-1.png'
          alt=''
          width={759}
          height={349}
        />
      </div>
    </div>
  );
}

interface SheerMarkProps {
  onShow: any;
}

export function SheerMark(props: SheerMarkProps) {
  const [time, setTime] = useState(20);

  useEffect(() => {
    time == 0 ? props.onShow(false) : setTimeout(() => setTime(time - 1), 1000);
  }, [time]);
  return (
    <div className='flex flex-col justify-center items-center fixed top-0 left-0 w-screen h-lvh z-[50] text-center'>
      <div className='absolute top-0 left-0 w-screen h-lvh bg-black opacity-55'></div>
      <div className='w-1/4 flex flex-col justify-center items-center px-10 py-5 z-[55] gap-1 bg-white opacity-100 shadow-2xl'>
        <div
          className='flex self-end cursor-pointer'
          onClick={() => props.onShow(false)}
        >
          <svg
            className='justify-items-end'
            xmlns='https://www.w3.org/2000/svg'
            height='36px'
            viewBox='0 0 24 24'
            width='36px'
            fill='#000000'
          >
            <path d='M0 0h24v24H0z' fill='none'></path>
            <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'></path>
          </svg>
        </div>
        <Image
          src='https://admin.damneddesigns.com/wp-content/uploads/Asset-4-1.png'
          width={132}
          height={31}
          alt=''
        />
        <p className='text-xl'>UNLOCK ADDITIONAL DISCOUNTS INSTANTLY</p>
        <p>
          Sheerid is a service used by companies like Spotify, Youtube, Nike and
          more to instantly verify statuses of students, military personnel etc
          which is then used to enable special discounts. You will be routed to
          Sheerid and we do not see any of the information other than whether
          you are verified or not.
        </p>
        <p className='px-10'>
          Pay in 4 option is 0% APR (Annual Percentage Rage). 25% down payment
          then three payments of 25% every two weeks for 6 weeks.
        </p>
        <Link
          className='text-blue-900 pt-5'
          href='https://services.sheerid.com/verify/66394380141e0119a76dfaa1/?layout=landing'
        >
          Teacher
        </Link>
        <Link
          className='text-blue-900 pt-5'
          href='https://services.sheerid.com/verify/663944c3141e0119a76e0670/?layout=landing'
        >
          Senior
        </Link>
        <p>This will close in {time} seconds</p>
      </div>
    </div>
  );
}
