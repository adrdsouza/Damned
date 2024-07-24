'use client';

import Auth from '@/components/my-account/auth/page';
import Account from '@/components/my-account/account/page';
import { useSession } from '@/client/SessionProvider';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

const AccountClient = () => {
  const { isAuthenticated, customer, fetching, hasCredentials } = useSession();

  return (
    <div>
      {fetching === false ? (
        customer && isAuthenticated ? (
          <Account />
        ) : (
          <Auth />
        )
      ) : (
        <div className='w-full h-screen flex justify-center items-center'>
          <CircularProgress color='inherit' />
        </div>
      )}
    </div>
  );
};

export default AccountClient;
