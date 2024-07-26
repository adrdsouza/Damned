import { text } from '@/app/styles';
import { useSession } from '@/client/SessionProvider';
import CartItemList from './cart-items-list';
import CartTotal from '../cart-total';
import { dispatch } from '@/redux/store';
import { CartItem as CartItemInterface } from '@/graphql';
import { setCartClose, setCartSection } from '@/redux/slices/cart-slice';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';

const CartItemsSection = () => {
  const { cart } = useSession();
  const items = (cart?.contents?.nodes || []) as CartItemInterface[];

  return (
    <>
      <div className='w-full flex justify-between border-b'>
        <div className={`${text.md} font-medium p-2`}>
          <div>CART</div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className='flex h-screen p-4'>
          <div className='m-auto text-center'>
            <p className='mb-6'>Your cart is empty!</p>
            <Button
              variant='outlined'
              onClick={() => dispatch(setCartClose())}
              className='border-stone-500 hover:border-stone-600 hover:bg-stone-200 text-stone-500'
            >
              RETURN TO SHOP
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className='relative overflow-scroll flex-col no-scrollbar flex flex-1 justify-between '>
            <CartItemList items={items} />
            <CartTotal showDetails={false} />
          </div>

          <Button
            onClick={() => dispatch(setCartSection('CHECKOUT'))}
            className='py-8 bg-stone-500 w-full rounded-none  text-white hover:bg-stone-600'
          >
            checkout
          </Button>
        </>
      )}
    </>
  );
};

export default CartItemsSection;
