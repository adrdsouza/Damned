import { ThankYou } from '@/client/ThankYou';
import { fetchOrders } from '@/graphql';
import Link from 'next/link';

const Page = ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { key: string };
}) => {
  const { id } = params;
  const key = searchParams.key;

  if (id && key) {
    return (
      <div className=' w-full px-[30px] py-[2em] md:py-[4em] 2xl:w-[1440px] m-auto'>
        <ThankYou orderId={id} okey={key} />
      </div>
    );
  }
  return (
    <div className=' w-full px-[30px] py-[2em] md:py-[4em] 2xl:w-[1440px] m-auto'>
      <p className='text-center'>
        Invalid Order Number.{' '}
        <Link className='font-medium' href='/shop'>
          Browse Products
        </Link>
      </p>
    </div>
  );
};

export default Page;
