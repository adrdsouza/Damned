'use client';

import { useSession } from '@/client/SessionProvider';
import { Customer } from '@/graphql';

export default function DashboardPage() {
  const { customer } = useSession();

  return (
    <div className='flex flex-col gap-2'>
      <p>{`Hello ${customer?.firstName}`}</p>
      <p>
        From your account dashboard you can view your recent orders, manage your
        shipping and billing address, and edit your password and account
        details.
      </p>
    </div>
  );
}
