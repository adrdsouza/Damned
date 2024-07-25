import { Data, sessionContext, useSession } from '@/client/SessionProvider';
import { Cart, ShippingRate } from '@/graphql';
import { Button } from '@mui/material';
import { useOtherCartMutations } from '@woographql/react-hooks';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader, reloadBrowser } from '../utils';
import { useSelector } from 'react-redux';
import { dispatch } from '@/redux/store';
import { setCartLoading } from '@/redux/slices/cart-slice';

const CartTotal = ({ showDetails }: { showDetails?: Boolean | undefined }) => {
  const cartLoading = useSelector((state: any) => state.cartSlice.cartLoading);
  const { cart: cartData } = useSession();
  const cart = cartData as Cart;
  const subTotal = cart?.subtotal;
  const total = cart?.total;

  const cartItems =
    cart?.contents?.nodes?.map((d: any) => ({
      name: d.variation?.node?.name,
      quantity: d.quantity,
      total: d.subtotal,
    })) ?? null;

  return (
    <div className='relative w-full'>
      {cartLoading ? (
        <Loader className='absolute bg-[#ffffff75] z-[999] w-full h-full' />
      ) : null}

      <ApplyCoupon />

      <div className='border-y p-4 flex flex-col gap-2'>
        {showDetails ? (
          <>
            <div className='flex gap-4 justify-between'>
              <p className=''>Product</p>
              <p>Subtotal</p>
            </div>

            {cartItems?.map((item, index) => (
              <div key={index} className='flex gap-4 justify-between'>
                <p className=''>{`${item.name} x ${item.quantity}`}</p>
                <p>{item.total}</p>
              </div>
            ))}
          </>
        ) : null}

        <div className='flex gap-4 justify-between'>
          <p className=''>Subtotal</p>
          <p>{subTotal}</p>
        </div>
      </div>

      <AppliedCoupons />

      <ShippingOptions />

      {showDetails ? (
        <div className='flex gap-4 justify-between p-4 border-y'>
          <p className=''>Total</p>
          <p>{total}</p>
        </div>
      ) : null}
    </div>
  );
};

const ShippingOptions = () => {
  const { cart: cartData } = useSession();
  const cart = cartData as Cart;

  const availableShippingRates: ShippingRate[] = (
    cart?.availableShippingMethods || []
  ).reduce<ShippingRate[]>((rates, nextPackage) => {
    rates.push(...((nextPackage?.rates || []) as ShippingRate[]));

    return rates;
  }, [] as ShippingRate[]);

  return (
    <div className='p-4'>
      <p className='mb-2'>Shipping</p>
      <div className='flex gap-4 justify-between'>
        <p>{availableShippingRates[0]?.label}</p>
        <p>{`$${availableShippingRates[0]?.cost}`}</p>
      </div>
    </div>
  );
};

const ApplyCoupon = () => {
  const [open, setOpen] = useState(false);
  const [coupon, setCoupon] = useState('');
  const { applyCoupon, applyingCoupon } =
    useOtherCartMutations<Data>(sessionContext);

  const handleClick = async () => {
    if (coupon === '') {
      toast.error('Please enter a coupon code.');
      return;
    }
    dispatch(setCartLoading(true));
    try {
      await applyCoupon(coupon);
    } catch (error) {
      console.log(error);
      toast.error('Cart session expired');
      reloadBrowser();
    }
    dispatch(setCartLoading(false));
  };

  return (
    <div className='p-4'>
      <button className='font-medium' onClick={() => setOpen(!open)}>
        Have a coupon?
      </button>
      {open ? (
        <div className='border flex w-full'>
          <input
            className='p-2 flex-1 focus:outline-none'
            type='text'
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <Button
            onClick={handleClick}
            disabled={applyingCoupon}
            className='bg-stone-400 hover:bg-stone-500 rounded-none text-white px-2'
          >
            APPLY COUPON
          </Button>
        </div>
      ) : null}
    </div>
  );
};

const AppliedCoupons = () => {
  const { cart: cartData } = useSession();
  const cart = cartData as Cart;
  const { removeCoupon } = useOtherCartMutations<Data>(sessionContext);

  return (
    <>
      {cart?.appliedCoupons?.length ? (
        <div className='border-y p-4 flex flex-col gap-2'>
          {cart.appliedCoupons.map((coupon) => {
            const remove = async () => {
              dispatch(setCartLoading(true));
              try {
                await removeCoupon(coupon?.code as string);
              } catch (error) {
                console.log(error);
                toast.error('Cart session expired');
                reloadBrowser();
              }
              dispatch(setCartLoading(false));
            };
            return (
              <div key={coupon?.code} className='flex justify-between'>
                <p>
                  Coupon &ldquo;
                  {coupon?.code}
                  &rdquo;
                </p>

                <div className='flex gap-2'>
                  <button onClick={remove}>{`[ Remove ]`}</button>
                  <p>-{coupon?.discountAmount}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
};

export default CartTotal;
