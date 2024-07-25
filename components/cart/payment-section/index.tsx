import { text } from '@/app/styles';
import CartTotal from '../cart-total';
import { dispatch } from '@/redux/store';
import {
  setCartClose,
  setCartLoading,
  setCartSection,
} from '@/redux/slices/cart-slice';
import { ArrowLeft } from 'lucide-react';
import { useCheckoutDetails } from '@/client/CheckoutProvider';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, reloadBrowser } from '@/components/utils';
import { Button } from '@mui/material';

const PaymentSection = () => {
  const {
    customerId,
    billing,
    shipping,
    lineItems,
    shippingLines,
    coupons,
    createOrder,
  } = useCheckoutDetails();
  const { push } = useRouter();
  const [checkoutSuccess, setCheckoutSuccess] = useState<any>(null);

  const handleCheckout = async () => {
    dispatch(setCartLoading(true));
    try {
      const order = await createOrder({
        customerId,
        billing,
        shipping,
        lineItems,
        shippingLines,
        coupons,
        paymentMethod: 'cod',
        paymentMethodTitle: 'Cash on Delivery',
      });

      dispatch(setCartLoading(false));

      if (!order) {
        toast.error('Checkout session expired.');
        setTimeout(() => {
          reloadBrowser();
        }, 2000);
        return;
      }

      setCheckoutSuccess(true);

      setTimeout(() => {
        push(`/order-recieved/${order.orderNumber}?key=${order.orderKey}`);
        dispatch(setCartClose());
        dispatch(setCartSection('CART'));
      }, 5000);
    } catch (error) {
      console.log(error);
      toast.error('Checkout session expired.');
      setTimeout(() => {
        reloadBrowser();
      }, 2000);
      // dispatch(setCartLoading(false));
      // dispatch(setCartClose());
      // dispatch(setCartSection('CART'));
    }
  };

  return (
    <>
      <div className='w-full border-b p-2'>
        <div className='flex gap-6 items-center'>
          <ArrowLeft
            className='w-5 h-5 cursor-pointer'
            onClick={() => dispatch(setCartSection('CHECKOUT'))}
          />
          <p className={`${text.md} font-medium`}>PAYMENT</p>
        </div>
      </div>

      <div className='relative overflow-scroll flex-col no-scrollbar flex flex-1 justify-between '>
        <div className='p-2'>TESTING CHECKOUT WITH CASH ON DELIVERY</div>
        <CartTotal showDetails={true} />
      </div>

      <Button
        onClick={handleCheckout}
        className='py-8 bg-stone-500 w-full rounded-none text-white hover:bg-stone-600'
      >
        Checkout
      </Button>

      {checkoutSuccess ? (
        <div className='absolute bg-white z-[999] h-full w-full flex '>
          <div className='m-auto'>
            <p>
              {`Thank You for your order. We're redirecting to your order page`}
            </p>
            <Loader />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default PaymentSection;
