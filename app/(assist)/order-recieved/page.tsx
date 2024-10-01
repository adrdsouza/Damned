import Link from 'next/link';
import { fetchSingleOrder, OrderIdTypeEnum } from '@/graphql';
import { OrderDetails } from '@/app/(assist)/my-account/orders/[id]/page';

export const dynamic = 'force-dynamic';

const Page = async ({ searchParams }) => {
  const { id, key } = searchParams;

  try {
    if (!id && !key) {
      throw Error('error');
    }

    // Fetch order using the key
    const order: any = await fetchSingleOrder(key, OrderIdTypeEnum.ORDER_KEY);

    // If order not found or mismatch with ID, return error
    if (!order || order.orderNumber !== id) {
      throw Error('error');
    }

    // Render order details
    return (
      <div className='w-full px-[30px] py-[2em] md:py-[4em] 2xl:w-[1440px] m-auto'>
        <OrderDetails order={order} />
      </div>
    );
  } catch (error) {
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
