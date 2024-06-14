'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/graphql/type';
import PocketItem from '@/components/card/card';
import orisisKnife4 from '@/public/assets/images/orisis-knife4.gif';
import orisisKnife5 from '@/public/assets/images/orisis-knife5.jpg';

interface OrisisProps {
  className?: string;
  data: Product[];
}

const Orisis: React.FC<OrisisProps> = (props) => {
  return (
    <div className='w-full bg-white'>
      <div className='2xl:w-[1440px] w-full px-[30px] m-auto'>
        <div className='py-[2em] md:py-[5em] flex flex-col lg:flex-row justify-center gap-8'>
          {props.data.map((p, index) => (
            <div key={index}>
              <PocketItem
                img={p.node.image && p.node.image.sourceUrl}
                productId={p.node.id}
                name={p.node.name}
                price={p.node.price}
                onSale={p.node.onSale}
              />
            </div>
          ))}
        </div>
        <div className='flex flex-col lg:flex-row py-[2em] md:py-[5em]'>
          <img
            className='w-full  lg:w-1/2 h-[350px] object-contain '
            src='https://damnedventures.com/wp-content/uploads/Presentation12.gif'
            alt='this is orisis'
          />
          <div className='relative w-full lg:w-1/2 grid'>
            <img
              className='w-full h-[350px] object-cover'
              src='https://damnedventures.com/wp-content/uploads/IMG_2642-scaled.jpg'
              alt='this is orisis'
            />
            <div className='absolute text-center self-center p-10  text-white'>
              <p className='text-2xl font-semibold'>MAKE IT YOURS</p>
              <p className='text-lg text-slate-400'>With replaceable scales</p>
              <p className='text-xs'>
                We are strong advocates of individual expressions fo self and as
                such we have always created products that yu ahve full control
                over. Borrowing from our EDC knives, the Osiris chef knives have
                scales that can be replaced with minimal effort. With many
                handle offerings in the future. you cooking companion cna be
                however you like!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orisis;
