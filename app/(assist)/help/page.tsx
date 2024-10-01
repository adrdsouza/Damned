'use client';

import { useState } from 'react';
import { fetchOrders } from '@/graphql/client';
import CircularProgress from '@mui/material/CircularProgress';
import { OrderDetails } from '../my-account/orders/[id]/page';
import toast from 'react-hot-toast';

const Help: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch orders based on the email
      const fetchedOrders = await fetchOrders({
        where: {
          billingEmail: email,
        },
        first: 9999,
      });

      // Find the order matching the provided orderId
      const foundOrder = fetchedOrders.nodes.find(
        (order: any) => order.orderNumber === orderId
      );

      if (!foundOrder) {
        toast.error('No order found');
        setLoading(false);
        return;
      }

      // Set the found order to display
      setOrder(foundOrder);
      setOrderId('');
      setEmail('');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='2xl:w-[1440px] w-full px-[30px] m-auto py-[2em] md:py-[5em]'>
      <div>
        <p className='text-4xl bold-semibold'>HELP</p>
        <p className='text-md mt-2'>
          In stock products will be dispatched within 2 working days. Pre-order
          products will ship on the expected ship date visible on the product
          page and the order confirmation email.
        </p>
        <p className='text-md mt-2'>
          Packages are shipped out of Reno, Nevada, U.S.A. by USPS First class
          or equivalent.
        </p>
        <p className='text-md mt-32'>
          To track your order, enter your Order ID and email below, then press
          the track button. This information is provided in your receipt and
          confirmation email.
        </p>

        <form onSubmit={handleTrackOrder} className='mt-10 mb-5'>
          <div className='flex flex-wrap gap-5'>
            <div className='grid'>
              <label htmlFor='orderId'>Order ID</label>
              <input
                type='text'
                id='orderId'
                className='px-3 py-2.5 min-w-[250px] bg-gray-100 border border-gray-300 rounded-lg focus:outline-none'
                value={orderId}
                required
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <div className='grid'>
              <label htmlFor='email'>Billing Email</label>
              <input
                type='email'
                id='email'
                required
                className='min-w-[250px] px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <button
            type='submit'
            className='px-20 py-3 mt-5 border-2 border-slate-700 rounded hover:border-stone-100 text-center hover:bg-stone-100 flex justify-center items-center font-semibold'
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} className='text-gray-800' />
            ) : (
              'Track'
            )}
          </button>
        </form>
      </div>

      {order ? <OrderDetails order={order} /> : null}
    </div>
  );
};

export default Help;
