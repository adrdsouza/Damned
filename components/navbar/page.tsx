'use client';

import { UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import SearchBar from './search-bar';
import ShopDropdown from './shop-dropdown';
import Cart from '../cart';

const Page = () => {
  const path = usePathname();

  // State for navbar style based on path
  const [navStyle, setNavStyle] = useState<boolean>(
    path === '/' || path === '/shop/osiris-chef-knives' || path === '/shop/edc'
  );

  // State for scroll detection
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Update navStyle based on path
  useEffect(() => {
    setNavStyle(
      path === '/' ||
        path === '/shop/osiris-chef-knives' ||
        path === '/shop/edc'
    );
  }, [path]);

  // Scroll event listener to update scrolled state
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 z-[5] flex w-full transition-all duration-300 ease-in justify-between items-end py-4 px-8
         ${scrolled ? 'bg-white text-slate-700' : ''}
         ${
           navStyle && !scrolled
             ? 'text-white'
             : 'text-slate-700 bg-white border-b border-stone-100'
         }
         `}
    >
      <Link href='/'>
        {navStyle && !scrolled ? (
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
