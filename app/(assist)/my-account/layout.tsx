import { text } from '@/app/styles';

import { Protected } from './protected';
import AccountMenu from './account-menu';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account - Damned Designs',
};

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

export default AccountLayout;
