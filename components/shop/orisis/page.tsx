'use client';

import PocketItem from '@/components/card/card';

interface OrisisProps {
  className?: string;
  data: any;
}

const Orisis: React.FC<OrisisProps> = (props) => {
  console.log(props.data);

  return (
    <div className='w-full bg-white'>
      <div className='2xl:w-[1440px] w-full px-[30px] m-auto'>
        {/* <div className='py-[2em] md:py-[5em] flex flex-col lg:flex-row justify-center gap-8'>
          {props.data.map((p, index) => (
            <div key={index}>
              <PocketItem
                img={p.image && p.image.sourceUrl}
                productId={p.id}
                name={p.name}
                price={p.price}
                slug={p.slug}
                onSale={false}
                stockStatus={p.stockStatus === 'OUT_OF_STOCK' ? false : true}
              />
            </div>
          ))}
        </div> */}
        <div className='flex flex-col lg:flex-row py-[2em] md:py-[5em]'>
          <img
            className='w-full  lg:w-1/2 h-[350px] object-contain '
            src='https://admin.damneddesigns.com/wp-content/uploads/Presentation12.gif'
            alt='this is orisis'
          />
          <div className='relative w-full lg:w-1/2 grid'>
            <img
              className='w-full h-[350px] object-cover'
              src='https://admin.damneddesigns.com/wp-content/uploads/IMG_2642-scaled.jpg'
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
