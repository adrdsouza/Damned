'use client';

import Link from 'next/link';
import { useState } from 'react';
import Dashboard from './dashboard';
import Orders from './orders';
import Address from './address';
import PaymentMethod from './payment-method';
import SupportTicket from './support-ticket';
import Points from './points';
import { useSession } from '@/client/SessionProvider';
import { useRouter } from 'next/navigation';

export default function Account() {
  const [page, setPage] = useState<number>(0);
  const { logout } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/');

    // toast({
    //   title: 'Logged out',
    //   description: `Goodbye, ${customer?.firstName}`,
    // });
  };

  return (
    <div className='px-[30px] py-[2em] md:py-[5em] 2xl:w-[1440px] w-full m-auto '>
      <p className='text-4xl mb-6'>ACCOUNT DASHBOARD</p>
      <div className='w-full flex gap-4'>
        <ul className='flex-[0.3] text-xl  uppercase'>
          <li className='cursor-pointer' onClick={() => setPage(0)}>
            <span>dashboard</span>
          </li>
          <li className='cursor-pointer' onClick={() => setPage(1)}>
            <span>orders</span>
          </li>
          <li className='cursor-pointer' onClick={() => setPage(2)}>
            <span>address</span>
          </li>
          <li className='cursor-pointer' onClick={() => setPage(3)}>
            <span>payment details</span>
          </li>
          <li className='cursor-pointer' onClick={() => setPage(4)}>
            <span>support tickets</span>
          </li>
          <li className='cursor-pointer' onClick={() => setPage(5)}>
            <span>points</span>
          </li>
          <li className='cursor-pointer' onClick={() => setPage(3)}>
            <span>your waitlists</span>
          </li>
          <li onClick={handleLogout} className='cursor-pointer'>
            <span>log out</span>
          </li>
        </ul>
        <div className='flex-[0.7]'>
          {page == 0 && <Dashboard />}
          {page == 1 && <Orders />}
          {page == 2 && <Address />}
          {page == 3 && <PaymentMethod />}
          {page == 4 && <SupportTicket />}
          {page == 5 && <Points />}
        </div>
      </div>
    </div>
  );
}
