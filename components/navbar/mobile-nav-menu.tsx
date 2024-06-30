import Link from 'next/link';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import FormControlLabel from '@mui/material/FormControlLabel';

const MobileNavMenu: React.FC = () => {
  return (
    <div className='p-[30px]  bg-[#bfb7b7]  '>
      <div className=''>
        <Link
          href='/shop'
          className='pl-4 flex items-center hover:text-white bg-[#b9b1b1] '
        >
          SHOP
        </Link>

        <div className='pl-[40px] bg-[#a89c9c] flex flex-col'>
          <Link
            href='/shop/osiris-chef-knives'
            className='hover:text-slate-200'
          >
            OSIRIS CHEF KNIFE
          </Link>
          <Link href='/shop/pocket-knives' className='hover:text-slate-200'>
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
          {/* <Link href='/shop/fidget' className='hover:text-slate-200'>
            FIDGET
          </Link> */}
          <Link href='/shop/sidekick-pry-bars' className='hover:text-slate-200'>
            SIDEKICK PRY BARS
          </Link>
        </div>
      </div>
      <Link
        href='/help'
        className='pl-4 flex items-center bg-[#b9b1b1] hover:text-white'
      >
        HELP
      </Link>
    </div>
  );
};

export default MobileNavMenu;
