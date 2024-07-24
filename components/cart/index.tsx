'use client';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ShoppingBagIcon } from 'lucide-react';
import { useState } from 'react';
import CartComponent from './cart-component';
import { useSelector } from 'react-redux';
import { dispatch } from '@/redux/store';
import {
  setCartClose,
  setCartOpen,
  setCartSection,
} from '@/redux/slices/cart-slice';
import { CheckoutProvider } from '@/client/CheckoutProvider';
import { Badge, CircularProgress, IconButton } from '@mui/material';
import { useSession } from '@/client/SessionProvider';
import { LoadingButton } from '@mui/lab';

const Cart = () => {
  const openCart = useSelector((state: any) => state.cartSlice.openCart);
  const { cart, fetching } = useSession();
  const count = cart?.contents.itemCount;
  const loading = fetching || fetching === null;
  return (
    <>
      <button className='flex' onClick={() => dispatch(setCartOpen())}>
        {loading ? (
          <CircularProgress sx={{ color: 'grey' }} size={20} />
        ) : (
          <Badge badgeContent={count ?? 0} color='error'>
            <ShoppingBagIcon className='h-5 w-5' />
          </Badge>
        )}
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
