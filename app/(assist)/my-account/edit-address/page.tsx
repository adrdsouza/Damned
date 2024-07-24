'use client';

import { useSession } from '@/client/SessionProvider';
import { Customer } from '@/graphql';
import Link from 'next/link';

const EditAddress = () => {
  const { customer } = useSession();
  const { billing, shipping } = customer as Customer;

  return (
    <div>
      <div className='flex gap-6'>
        <div className='flex-1 border p-4 border-stone-300'>
          <div className='flex justify-between'>
            <h1>BILLING ADDRESS</h1>
            <Link href='/my-account/edit-address/billing'>Edit</Link>
          </div>
          <p>{`${billing?.firstName ?? ''} ${billing?.lastName ?? ''}`}</p>
          <p>{billing?.address1}</p>
          <p>{billing?.address2}</p>
          <p>{billing?.city}</p>
          <p>{billing?.state}</p>
          <p>{billing?.postcode}</p>
          <p>{billing?.country}</p>
          <p>{billing?.phone}</p>
          <p>{billing?.email}</p>
        </div>

        <div className='flex-1 p-4 border border-stone-300'>
          <div className='flex justify-between'>
            <h1>SHIPPING ADDRESS</h1>
            <Link href='/my-account/edit-address/shipping'>Edit</Link>
          </div>
          <p>{`${shipping?.firstName ?? ''} ${shipping?.lastName ?? ''}`}</p>
          <p>{shipping?.address1}</p>
          <p>{shipping?.address2}</p>
          <p>{shipping?.city}</p>
          <p>{shipping?.state}</p>
          <p>{shipping?.postcode}</p>
          <p>{shipping?.country}</p>
        </div>
      </div>
    </div>
  );
};

export default EditAddress;
