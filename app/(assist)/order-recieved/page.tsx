import Link from 'next/link';
import { fetchSingleOrder, OrderIdTypeEnum } from '@/graphql';
import { OrderDetails } from '@/app/(assist)/my-account/orders/[id]/page';
import { ThankYou } from '@/client/ThankYou';

export const dynamic = 'force-dynamic';

const Page = async ({ searchParams }) => {
  const { id, key } = searchParams;

  console.log(id, key);

  try {
    if (!id && !key) {
      throw Error('no id & key in search params');
    }
    // Fetch order using the key
    const order: any = await fetchSingleOrder(key, OrderIdTypeEnum.ORDER_KEY);

    // If order not found or mismatch with ID, return error
    if (!order || order.databaseId !== Number(id)) {
      throw Error('orer not found');
    }
    // Render order details
    return (
      <div className='w-full px-[30px] py-[2em] md:py-[4em] 2xl:w-[1440px] m-auto'>
        <ThankYou order={order} />
      </div>
    );
  } catch (error) {
    console.log(error);
    return <InvalidOrder />;
  }
};

const InvalidOrder = () => {
  return (
    <div className='w-full flex justify-center items-center min-h-[50vh]'>
      <div className='flex gap-2'>
        <p className=''>Invalid Order Details</p>
        <Link className='font-medium' href='/shop'>
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default Page;
