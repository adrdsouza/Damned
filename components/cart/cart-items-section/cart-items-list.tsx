import { useSession } from '@/client/SessionProvider';
import { CartItem } from './cart-item';
import { CartItem as CartItemInterface } from '@/graphql';
import { dispatch } from '@/redux/store';
import { setCartClose } from '@/redux/slices/cart-slice';

const CartItemList = ({ items }: any) => {
  return (
    <div>
      {items.map((item: any) => (
        <CartItem key={item.key} item={item} />
      ))}
    </div>
  );
};

export default CartItemList;
