'use client';
import { ChevronDown, Menu, Search, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobileNavMenu from './mobile-nav-menu';
import {
  Box,
  Collapse,
  Grow,
  IconButton,
  Paper,
  useMediaQuery,
} from '@mui/material';
import Fade from '@mui/material/Fade';
import { usePathname } from 'next/navigation';
import SearchBar from './search-bar';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { text } from '@/app/styles';
import ShopDropdown from './shop-dropdown';
import Cart from '../cart';

const Page = () => {
  const path = usePathname();

  const [navStyle, setNavStyle] = useState<Boolean>(
    path === '/' || path === '/shop/osiris-chef-knives' || path === '/shop/edc'
  );

  useEffect(() => {
    setNavStyle(
      path === '/' ||
        path === '/shop/osiris-chef-knives' ||
        path === '/shop/edc'
    );
  }, [path]);

  return (
    <div
      className={`flex w-full transition-all duration-300 justify-between items-end py-4 px-8
         ${
           navStyle
             ? ' text-white'
             : 'text-slate-700 bg-white border-b border-stone-300'
         }
         `}
    >
      <Link href='/'>
        {navStyle ? (
          <Image
            src='https://admin.damneddesigns.com/wp-content/uploads/Asset-12.png'
            width={100}
            height={100}
            alt='this is mark'
            className='w-8'
          />
        ) : (
          <Image
            src='https://admin.damneddesigns.com/wp-content/uploads/Asset-14.png'
            width={100}
            height={100}
            alt='this is mark'
            className='w-8'
          />
        )}
      </Link>
      <div className='flex items-center gap-4'>
        <ShopDropdown />

        <Link href='/help' className='hidden sm:block hover:text-slate-400'>
          HELP
        </Link>

        <SearchBar />
      </div>

      <div className='flex gap-4 items-end '>
        <Cart />
        <Link href='/my-account'>
          <UserCircle className='h-5 w-5' />
        </Link>
      </div>
    </div>
  );
};

export default Page;
