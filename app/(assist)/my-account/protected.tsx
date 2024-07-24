import { useSession } from '@/client/SessionProvider';
import Auth from '@/components/my-account/auth/page';
import { Loader } from '@/components/utils';
import { useRouter } from 'next/navigation';

export const Protected = ({ children }: any) => {
  const { isAuthenticated, customer, fetching, hasCredentials } = useSession();

  const { push } = useRouter();

  if (fetching === false && isAuthenticated && customer) {
    return children;
  }

  if (fetching === false && !isAuthenticated) {
    return <Auth />;
  }

  return <Loader className='h-full' />;
};
