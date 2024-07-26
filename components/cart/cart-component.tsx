import { ArrowLeft, X } from 'lucide-react';
import { text } from '@/app/styles';
import { dispatch } from '@/redux/store';
import { setCartClose, setCartSection } from '@/redux/slices/cart-slice';
import { useSelector } from 'react-redux';
import { CircularProgress, IconButton } from '@mui/material';
import { CheckoutProvider } from '@/client/CheckoutProvider';
import CartItemsSection from './cart-items-section';
import CheckoutSection from './checkout-section';
import PaymentSection from './payment-section';

const CartComponent = () => {
  const cartLoading = useSelector((state: any) => state.cartSlice.cartLoading);
  const cartSection = useSelector((state: any) => state.cartSlice.cartSection);

  const getCartSection = () => {
    switch (cartSection) {
      case 'CART':
        return <CartItemsSection />;
      case 'CHECKOUT':
        return <CheckoutSection />;
      case 'PAYMENT':
        return <PaymentSection />;
      default:
        return null;
    }
  };

  return (
    <div className='relative flex flex-col w-full h-full bg-white'>
      <IconButton
        onClick={() => {
          dispatch(setCartClose());
          dispatch(setCartSection('CART'));
        }}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      >
        <X />
      </IconButton>

      {cartLoading ? (
        <div className='absolute bg-[#ffffff75] z-[999] h-full w-full flex'>
          <CircularProgress className='m-auto' color='inherit' />
        </div>
      ) : null}

      {getCartSection()}
    </div>
  );
};

export default CartComponent;
