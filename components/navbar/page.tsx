'use client';
import { ChevronDown, Menu, Search, UserCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MobileNavMenu from './mobile-nav-menu';
import { Collapse, Grow, useMediaQuery } from '@mui/material';
import Fade from '@mui/material/Fade';
import { usePathname } from 'next/navigation';
import SearchBar from './search-bar';

interface NavbarProps {
  style?: Boolean;
}

const Page: React.FC<NavbarProps> = (props) => {
  const [hover, setHover] = useState<boolean>();
  const [openMenu, setOpenMenu] = useState<any>(false);
  const [openSearch, setOpenSearch] = useState<any>(false);
  const isLargeScreen = useMediaQuery('(min-width:640px)');
  const path = usePathname();
  const [navStyle, setNavStyle] = useState<Boolean>(
    path === '/' ? true : false
  );

  useEffect(() => {
    if (isLargeScreen) {
      setOpenMenu(false);
    }
  }, [isLargeScreen]);

  useEffect(() => {
    setNavStyle(path === '/' ? true : false);
  }, [path]);

  return (
    <div
      className={`flex w-full
        transition-all duration-300 relative z-[9999]
         ${
           navStyle
             ? 'hover:bg-white hover:text-slate-700 text-white'
             : 'text-slate-700 bg-white border-b border-gray-300'
         }
         `}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <div className='m-auto w-full 2xl:w-[1440px] items-center px-[30px] py-[10px] flex justify-between'>
        <Link href='/'>
          {navStyle ? (
            hover ? (
              <Image
                src='https://admin.damneddesigns.com/wp-content/uploads/Asset-14.png'
                width={100}
                height={100}
                alt='this is mark'
                className='w-8'
              />
            ) : (
              <Image
                src='https://admin.damneddesigns.com/wp-content/uploads/Asset-12.png'
                width={100}
                height={100}
                alt='this is mark'
                className='w-8'
              />
            )
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
        <div className='flex items-center gap-[20px]'>
          <div className='hidden sm:flex items-center gap-[40px]'>
            <div className='relative group/shopbutton flex items-center'>
              <div className='flex items-center gap-1'>
                <button className='hover:text-slate-400'>SHOP</button>
                <ChevronDown className='h-3 w-3' />
              </div>

              <div
                className='
               hidden justify-center top-[35px] fixed m-auto w-auto 2xl:w-[1440px] left-0 right-0
              px-[50px] py-[20px] gap-y-0 gap-x-[40px] flex-wrap text-nowrap
              group-hover/shopbutton:flex 
               bg-[#a89c9c]  text-slate-700'
              >
                <Link
                  href='/shop/osiris-chef-knives'
                  className='hover:text-slate-200'
                >
                  OSIRIS CHEF KNIFE
                </Link>
                <Link
                  href='/shop/pocket-knives'
                  className='hover:text-slate-200'
                >
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
                <Link
                  href='/shop/sidekick-pry-bars'
                  className='hover:text-slate-200'
                >
                  SIDEKICK PRY BARS
                </Link>
              </div>
            </div>
            <Link
              href='/help'
              className='flex items-center hover:text-slate-400'
            >
              HELP
            </Link>
          </div>

          <Menu
            onClick={() => setOpenMenu((prev: any) => !prev)}
            className='block sm:hidden  cursor-pointer h-5 w-5'
          />

          <div className='absolute  top-[40px] w-[90vw] m-auto z-[999] left-0 right-0'>
            <Collapse unmountOnExit in={openMenu}>
              {/* <div className='w-[200px] h-[200px] bg-orange-600'>sscdscsd </div> */}
              <div>
                <MobileNavMenu />
              </div>
            </Collapse>
          </div>

          <Search
            onClick={() => setOpenSearch(!openSearch)}
            className='cursor-pointer h-5 w-5'
          />
          {openSearch ? <SearchBar /> : null}
        </div>
        {/* <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          stroke-width='2'
          stroke-linecap='round'
          stroke-linejoin='round'
        >
          <line x1='4' x2='20' y1='12' y2='12' />
          <line x1='4' x2='20' y1='6' y2='6' />
          <line x1='4' x2='20' y1='18' y2='18' />
        </svg> */}
        <Link href='/my-account'>
          <UserCircle className='cursor-pointer h-5 w-5' />
        </Link>
      </div>
    </div>
  );
};

export default Page;
