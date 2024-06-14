import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <div className='flex m-auto px-[30px] w-full 2xl:w-[1440px] h-[400px] md:h-[70vh]'>
      <div className='text-white my-auto text-center md:text-left'>
        <p className='text-2xl md:text-3xl font-semibold mb-1'>
          DAMNED DESIGNS
        </p>
        <p className='text-xs mb-4'>
          TIMELESS AESTHETIC x UNCOMPROMISING FUNCTION
        </p>
        <p className='text-xs mb-4'>
          We are on amission to create well designed, high quality products that
          are effective, reliable yet affordable. We design products that look
          great but work better.
        </p>
        <Link
          href='/shop'
          className='inline-block hover:bg-gray-600 text-center text-xs px-8 py-4 border border-white rounded hover:border-slate'
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
