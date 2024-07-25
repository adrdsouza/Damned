import Link from 'next/link';
import Buket from './bucket';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <div className=' bg-[#f1f1f1] w-full '>
      <div className='flex flex-col gap-10 m-auto 2xl:w-[1440px] w-full px-[30px] py-[2em] md:py-[5em]'>
        <div className='flex w-full sm:w-fit m-auto flex-col sm:flex-row'>
          <input
            type='email'
            placeholder='Email'
            className='w-full sm:w-[300px] p-3 text-center border border-[#c7c7c7] focus:border-0 focus:border-b focus:outline-none'
          />
          <button className='w-full sm:w-[200px] p-3 border border-slate-300 text-white text-center bg-[#a89c9c]'>
            SUBSCRIBE
          </button>
        </div>
        <div className='flex gap-2 text-center flex-col sm:flex-row  justify-between'>
          <p className=''>@2017 Damned Design All RightsReserved.</p>

          <div className='flex gap-2'>
            <Link href='/terms-conditions'>T&C</Link>
            <p> | </p>
            <Link href='/privacy-policy'>Privacy Policy</Link>
            <p> | </p>
            <Link href='#'>Shipping Information</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
