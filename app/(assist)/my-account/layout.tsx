'use client';

import { text } from '@/app/styles';
import { useSession } from '@/client/SessionProvider';
import Link from 'next/link';
import { Protected } from './protected';
import { useRouter } from 'next/navigation';

const AccountLayout = ({ children }: any) => {
  return (
    <Protected>
      <div className='w-full px-[30px] 2xl:w-[1440px] m-auto py-[2em]'>
        <h1 className={`text-center ${text.lg} mb-10`}>ACCOUNT DASHBOARD</h1>
        <div className='flex flex-col  md:flex-row'>
          <AccountMenu />
          <div className='flex-1'>{children}</div>
        </div>
      </div>
    </Protected>
  );
};

const AccountMenu = () => {
  const { logout } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      router.refresh();
    }
  };

  return (
    <div className='font-medium flex flex-row md:flex-col gap-2 w-full md:w-[300px] flex-wrap mb-10 md:mb-0'>
      <Link className='w-fit' href={'/my-account'}>
        Dashboard
      </Link>
      <Link className='w-fit' href={'/my-account/orders'}>
        Orders
      </Link>
      <Link className='w-fit' href={'/my-account/edit-address'}>
        Addresses
      </Link>
      <Link className='w-fit' href={'/my-account/account-details'}>
        Account Details
      </Link>
      <Link className='w-fit' onClick={handleLogout} href={'/'}>
        Log Out
      </Link>
    </div>
  );
};

export default AccountLayout;
