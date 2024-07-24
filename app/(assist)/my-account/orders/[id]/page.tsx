'use client';

import { useSession } from '@/client/SessionProvider';
import { Customer, LineItem, Order } from '@/graphql';
import Link from 'next/link';
import './styles.css';
import { useSelector } from 'react-redux';

const OrderPage = ({ params }: any) => {
  const { id } = params;
  const orders = useSelector((state: any) => state.ordersSlice.orders);
  const order = orders?.find((order: Order) => order.orderNumber === id);

  return (
    <>
      {order ? (
        <div>
          <Link href='/my-account/orders' className='font-medium'>
            View all orders
          </Link>
          <OrderDetails order={order} />
        </div>
      ) : (
        <div>
          <p>Invalid Order Number</p>
          <Link href='/my-account/orders'>View all orders</Link>
        </div>
      )}
    </>
  );
};

export const OrderDetails = ({ order }: { order: Order }) => {
  return (
    <div>
      <table className='mb-10 order-details w-full border border-stone-300'>
        <thead className='font-medium border-b border-stone-300'>
          <td>Product</td>
          <td>Total</td>
        </thead>
        <tbody>
          {order.lineItems?.nodes.map((product: LineItem) => (
            <tr key={product.databaseId} className='border-b border-stone-300'>
              <td>{`${product.variation?.node.name} x ${product.quantity}`}</td>
              <td>{product.variation?.node.price}</td>
            </tr>
          ))}

          <tr className='border-b border-stone-300'>
            <td>Subtotal</td>
            <td>{order.subtotal}</td>
          </tr>

          <tr className='border-b border-stone-300'>
            <td className='font-medium'>Shipping</td>
            <td>{order.shippingTotal}</td>
          </tr>

          <tr className='border-b border-stone-300'>
            <td className='font-medium'>Payment Method</td>
            <td>{order.paymentMethodTitle}</td>
          </tr>

          <tr className='border-b border-stone-300'>
            <td>Total</td>
            <td>{order.total}</td>
          </tr>
        </tbody>
      </table>

      <div className='flex gap-6'>
        <div className='flex-1 border p-4 border-stone-400'>
          <h1>BILLING ADDRESS</h1>
          <p>{`${order.billing?.firstName} ${order.billing?.lastName}`}</p>
          <p>{order.billing?.address1}</p>
          <p>{order.billing?.address2}</p>
          <p>{order.billing?.city}</p>
          <p>{order.billing?.state}</p>
          <p>{order.billing?.postcode}</p>
          <p>{order.billing?.country}</p>
          <p>{order.billing?.phone}</p>
          <p>{order.billing?.email}</p>
        </div>

        <div className='flex-1 p-4 border border-stone-400'>
          <h1>SHIPPING ADDRESS</h1>
          <p>{`${order.shipping?.firstName} ${order.shipping?.lastName}`}</p>
          <p>{order.shipping?.address1}</p>
          <p>{order.shipping?.address2}</p>
          <p>{order.shipping?.city}</p>
          <p>{order.shipping?.state}</p>
          <p>{order.shipping?.postcode}</p>
          <p>{order.shipping?.country}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
