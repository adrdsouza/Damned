import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useSession } from '@/client/SessionProvider';

export interface ProtectedProps {
  next?: string;
  children?: React.ReactNode;
}

export function Protected({ next, children }: ProtectedProps) {
  const pathname = usePathname();
  const { hasCredentials, isAuthenticated, fetching } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!hasCredentials() && !isAuthenticated && !fetching) {
      router.push(`/login?next=${encodeURIComponent(next || pathname)}`);
    }
  });

  return <>{children}</>;
}
