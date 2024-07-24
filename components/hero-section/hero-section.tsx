import { text } from '@/app/styles';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <div className='flex m-auto px-8 w-full h-[400px] md:h-screen'>
      <div className='text-white my-auto text-center md:text-left'>
        <p className={`${text.lg} md:text-3xl font-semibold mb-1`}>
          DAMNED DESIGNS
        </p>
        <p className={`${text.md} mb-4`}>
          TIMELESS AESTHETIC x UNCOMPROMISING FUNCTION
        </p>
        <p className={`${text.md} mb-4`}>
          We are on amission to create well designed, high quality products that
          are effective, reliable yet affordable. We design products that look
          great but work better.
        </p>
        <Link
          href='/shop'
          className={`inline-block hover:bg-gray-600 ${text.md} text-xs px-8 py-4 border border-white rounded hover:border-slate`}
        >
          SHOP NOW
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
