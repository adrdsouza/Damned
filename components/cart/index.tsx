'use client';

import Drawer from '@mui/material/Drawer';
import { ShoppingBagIcon } from 'lucide-react';
import CartComponent from './cart-component';
import { useSelector } from 'react-redux';
import { dispatch } from '@/redux/store';
import {
  setCartClose,
  setCartOpen,
  setCartSection,
} from '@/redux/slices/cart-slice';
import { CheckoutProvider } from '@/client/CheckoutProvider';
import { Badge } from '@mui/material';
import { useSession } from '@/client/SessionProvider';

const Cart = () => {
  const openCart = useSelector((state: any) => state.cartSlice.openCart);
  const { cart } = useSession();
  const count = cart?.contents.itemCount;

  return (
    <>
      <button onClick={() => dispatch(setCartOpen())}>
        <Badge badgeContent={count ?? 0} color='error'>
          <ShoppingBagIcon className='h-5 w-5' />
        </Badge>
      </button>

      {/* <button
        className='w-fit cursor-pointer'
        onClick={() => dispatch(setCartOpen())}
      >
        <Badge badgeContent={count ?? 0} color='error'>
          <ShoppingBagIcon className='h-5 w-5' />
        </Badge>
      </button> */}
      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            top: 'unset !important',
            bottom: '0 !important',
            maxHeight: '1500px',
            width: { md: '500px', xs: 'auto' },
          },
        }}
        anchor='right'
        onClose={() => {
          dispatch(setCartClose());
          dispatch(setCartSection('CART'));
        }}
        open={openCart}
      >
        <CheckoutProvider>
          <CartComponent />
        </CheckoutProvider>
      </Drawer>
    </>
  );
};

export default Cart;
