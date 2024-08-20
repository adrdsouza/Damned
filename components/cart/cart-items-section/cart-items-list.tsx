import { CartItem } from './cart-item';

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
