'use client';

import Auth from '@/components/my-account/auth/page';
import Account from '@/components/my-account/account/page';
import { Protected } from '@/client/SessionProvider/Protected';
import { useSession } from '@/client/SessionProvider';

const AccountClient = () => {
  const { hasCredentials, isAuthenticated, fetching } = useSession();

  return (
    <div>
      {isAuthenticated ? <Account /> : <Auth />}

      {/* {isLogin && <Account />}
      {!isLogin && <Auth />} */}
    </div>
  );
};

export default AccountClient;
