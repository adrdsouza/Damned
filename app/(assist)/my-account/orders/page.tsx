'use client';

import { useSession } from '@/client/SessionProvider';
import { Customer, fetchOrders, Order } from '@/graphql';
import { Loader } from '@/components/utils';
import Link from 'next/link';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { dispatch } from '@/redux/store';
import { setOrders } from '@/redux/slices/orders-slice';

const Orders = () => {
  const { customer } = useSession();
  const orders = useSelector((state: any) => state.ordersSlice.orders);

  const fetchData = async (id: number) => {
    const data: any = await fetchOrders({ where: { customerId: id } });
    if (data) {
      dispatch(setOrders(data?.nodes));
    }
  };

  useEffect(() => {
    if (customer && !orders) {
      fetchData(Number(customer?.databaseId));
    }
  }, [customer, orders]);

  return (
    <div className='w-full'>
      {!orders ? (
        <Loader className='w-full mt-4' />
      ) : (
        <div className='overflow-x-scroll no-scrollbar'>
          {orders && orders.length === 0 ? (
            <div className='mb-4 flex gap-4'>
              <p>No order sent.</p>
              <Link className='font-bold' href='/shop'>
                Browse Products
              </Link>
            </div>
          ) : null}
          <table className='w-full border border-gray-300 '>
            <thead className='border-b [&>td]:p-4'>
              <td>Order</td>
              <td>Date</td>
              <td>Status</td>
              <td>Total</td>
              <td>Actions</td>
            </thead>
            <tbody>
              {orders?.map((order: Order) => (
                <tr key={order.databaseId} className='[&>td]:p-4'>
                  <td className='font-bold'>
                    <Link href={`/my-account/orders/${order.orderNumber}`}>
                      {order.orderNumber}
                    </Link>
                  </td>

                  <td>{new Date(order.date as string).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>{order.total}</td>
                  <td className='font-bold'>
                    <Link href={`/my-account/orders/${order.orderNumber}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
