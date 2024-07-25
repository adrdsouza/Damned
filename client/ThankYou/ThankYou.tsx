import Link from 'next/link';
import { Customer, fetchOrders, Order } from '@/graphql';
import { useSession } from '@/client/SessionProvider';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/utils';
import { OrderDetails } from '@/app/(assist)/my-account/orders/[id]/page';
import { useSearchParams } from 'next/navigation';
import { dispatch } from '@/redux/store';
import { setOrders } from '@/redux/slices/orders-slice';

export function ThankYou({ orderId, okey }: any) {
  const {
    cart,
    customer: customerData,
    updateCart,
    fetching,
    isAuthenticated,
  } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<any>(true);
  const customer = customerData as Customer;

  const fetchData = async (id: number) => {
    const data: any = await fetchOrders({ where: { customerId: id } });

    if (data) {
      const order: Order = data?.nodes?.find(
        ({ databaseId, orderKey }) =>
          Number(databaseId) === Number(orderId) && orderKey === okey
      );
      if (order) {
        setOrder(order);
      }
    }
    setLoading(false);
  };

  const emptyCart = async () => {
    if (!cart || !cart.contents) {
      return;
    }
    const itemCount = cart.contents.itemCount;
    if (itemCount) {
      try {
        await updateCart({
          mutation: 'emptyCart',
          input: {
            clearPersistentCart: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    emptyCart();
  }, [cart]);

  useEffect(() => {
    if (customer?.id) {
      fetchData(Number(customer?.databaseId));
    }
  }, [customer?.id]);

  useEffect(() => {
    if (fetching === false && customer && isAuthenticated) {
      dispatch(setOrders(null));
    }
  }, [fetching, customer, isAuthenticated]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : order ? (
        <div>
          <p className='text-center font-medium mb-4'>
            Thank you. Your order has been recieved. Your order number is{' '}
            <span className='font-medium'>{order.orderNumber}</span>.
          </p>

          <OrderDetails order={order} />
        </div>
      ) : (
        <div>
          <p>Invalid Order Number</p>
          <Link href='/shop'>Browse Products</Link>
        </div>
      )}
    </div>
  );
}
