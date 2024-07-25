import { ArrowLeft, X } from 'lucide-react';
import { text } from '@/app/styles';
import CartTotal from '../cart-total';
import { dispatch } from '@/redux/store';
import {
  setCartClose,
  setCartLoading,
  setCartSection,
  setCheckingOut,
  setPaymentMethod,
} from '@/redux/slices/cart-slice';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { setDiffShipAddress } from '@/redux/slices/cart-slice';
import {
  CheckoutProvider,
  useCheckoutDetails,
} from '@/client/CheckoutProvider';
import { useRouter } from 'next/navigation';
import { Data, sessionContext, useSession } from '@/client/SessionProvider';
import { useOtherCartMutations } from '@woographql/react-hooks';
import { useFormik } from 'formik';
import { Cart, CountriesEnum } from '@/graphql';
import { combinedSchema, onlyBillingSchema } from './checkout/helpers';
import BillingForm from './checkout/billing-form';
import ShippingForm from './checkout/shipping-form';
import toast from 'react-hot-toast';
import { Button, Divider, FormControl, MenuItem, Select } from '@mui/material';
import { Loader, reloadBrowser } from '@/components/utils';

const CheckoutSection = () => {
  //-------------------->     CONSTANTS & HOOKS
  //-------------------->
  //-------------------->
  const checkingOut = useSelector((state: any) => state.cartSlice.checkingOut);
  const cartLoading = useSelector((state: any) => state.cartSlice.cartLoading);

  const paymentMethods = [
    // { value: 'nmi', name: 'Credit Card' },
    // { value: 'sezzle', name: 'Sezzle' },
    { value: 'cod', name: 'Cash on Delivery' },
  ];
  const { push } = useRouter();
  const [checkoutSuccess, setCheckoutSuccess] = useState<any>(null);

  const diffShipAddress = useSelector(
    (state: any) => state.cartSlice.diffShipAddress
  );
  const paymentMethod = useSelector(
    (state: any) => state.cartSlice.paymentMethod
  );
  // const { cart: cartData, updateCart } = useSession();
  // const cart = cartData as Cart;

  const {
    customerId,
    billing,
    shipping,
    lineItems,
    shippingLines,
    coupons,
    createOrder,
    updateCheckoutDetails,
  } = useCheckoutDetails();

  const initialValues = { billing: billing, shipping: shipping };

  //------------------> FUNCTIONS
  //-------------------->
  //-------------------->

  const changePaymentMethod = (e: any) => {
    dispatch(setPaymentMethod(e.target.value));
  };

  const handleSubmit = async (values: any) => {
    dispatch(setCheckingOut(true));
    try {
      const detialsUpdated = await updateCheckoutDetails({
        billing: values.billing,
        shipping: diffShipAddress ? values.shipping : values.billing,
      });
      if (!detialsUpdated) {
        console.log(detialsUpdated);
        toast.error('Error while updating checkout details.');
        reloadBrowser();
        return;
      }

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

      if (!order) {
        console.log(order);
        toast.error('Error while creating order.');
        reloadBrowser();
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
      toast.error('Cart Session Expired');
      reloadBrowser();
    }
    dispatch(setCheckingOut(false));
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: diffShipAddress ? combinedSchema : onlyBillingSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    formik.setFormikState((prevState) => ({
      ...prevState,
      validationSchema: diffShipAddress ? combinedSchema : onlyBillingSchema,
    }));
  }, [diffShipAddress]);

  return (
    <>
      <div className='w-full border-b p-2'>
        <div className='flex gap-6 items-center'>
          <ArrowLeft
            className='w-5 h-5 cursor-pointer'
            onClick={() => dispatch(setCartSection('CART'))}
          />
          <p className={`${text.md} font-medium`}>CHECKOUT</p>
        </div>
      </div>
      <div className='relative overflow-scroll flex-col no-scrollbar flex flex-1 justify-between '>
        <div className='p-4 flex flex-col gap-8'>
          <BillingForm formik={formik} />

          <div className='flex gap-2'>
            <input
              type='checkbox'
              checked={diffShipAddress}
              onChange={() => dispatch(setDiffShipAddress(!diffShipAddress))}
            />
            <p>Ship to a different address?</p>
          </div>

          {diffShipAddress ? <ShippingForm formik={formik} /> : null}
        </div>

        <Divider sx={{ my: 1 }} />

        <div className='p-4'>
          <p className='mb-2 font-bold'>Select Payment Method</p>
          <FormControl fullWidth>
            <Select
              size='small'
              value={paymentMethod}
              onChange={changePaymentMethod}
            >
              {paymentMethods.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <CartTotal showDetails={true} />
      </div>

      <Button
        type='submit'
        disabled={cartLoading || checkingOut}
        onClick={() => formik.handleSubmit()}
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

export default CheckoutSection;
