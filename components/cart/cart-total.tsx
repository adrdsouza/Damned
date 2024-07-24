import { useSession } from '@/client/SessionProvider';
import { Cart, ShippingRate } from '@/graphql';
import React, { useEffect } from 'react';

const CartTotal = ({ showDetails }: { showDetails?: Boolean | undefined }) => {
  const { cart: cartData } = useSession();
  const cart = cartData as Cart;
  const subTotal = cart?.subtotal;
  const total = cart?.total;

  const cartItems =
    cart?.contents?.nodes?.map((d: any) => ({
      name: d.variation?.node?.name,
      quantity: d.quantity,
      total: d.total,
    })) ?? null;

  return (
    <div className='w-full'>
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

      {showDetails ? <ShippingOptions /> : null}

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
        <p>{availableShippingRates[0]?.cost}</p>
      </div>
    </div>
  );
};

export default CartTotal;
