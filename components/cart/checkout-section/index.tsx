import { ArrowLeft } from 'lucide-react';
import { text } from '@/app/styles';
import CartTotal from '../cart-total';
import { dispatch } from '@/redux/store';
import {
  setCartClose,
  setCartLoading,
  setCartSection,
  setPaymentMethod,
} from '@/redux/slices/cart-slice';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { setDiffShipAddress } from '@/redux/slices/cart-slice';
import { useCheckoutDetails } from '@/client/CheckoutProvider';
import { useRouter } from 'next/navigation';
import { useSession } from '@/client/SessionProvider';
import { useFormik } from 'formik';
import { Cart } from '@/graphql';
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

  const [validnumber, setValidNumber] = useState('');
  const [validexpiration, setValidExpiration] = useState('');
  const [validcvv, setValidCvv] = useState('');
  const [sezzleResult, setSezzleResult] = useState(null);

  const cartLoading = useSelector((state: any) => state.cartSlice.cartLoading);

  const paymentMethods = [
    { value: 'nmi', name: 'NMI' },
    { value: 'sezzle', name: 'Sezzle' },
    //{ value: 'cod', name: 'Cash on Delivery' },
  ];
  const { push } = useRouter();
  const [checkoutSuccess, setCheckoutSuccess] = useState<any>(null);
  const diffShipAddress = useSelector(
    (state: any) => state.cartSlice.diffShipAddress
  );
  const paymentMethod = useSelector(
    (state: any) => state.cartSlice.paymentMethod
  );
  const { cart: cartData } = useSession();
  const cart = cartData as Cart;

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

  const formikValues = useRef(initialValues);
  //------------------> FUNCTIONS
  //-------------------->
  //-------------------->
  //-------------------->
  //-------------------->
  //-------------------->

  const changePaymentMethod = (e: any) => {
    dispatch(setPaymentMethod(e.target.value));
  };

  const handleFormikSubmit = () => {
    //setValues(values);
    if (paymentMethod === '') {
      toast.error('Please choose a payment method.');
      formik.setSubmitting(false);
    } else if (paymentMethod === 'nmi') {
      if (typeof window !== 'undefined') {
        window.CollectJS.startPaymentRequest();
      }
    } else if (paymentMethod === 'sezzle') {
      const button = document.getElementById('sezzle-smart-button');
      if (button) {
        button.click();
      } else {
        formik.setSubmitting(false);
      }
    } else if (paymentMethod === 'cod') {
      handleSubmit();
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: diffShipAddress ? combinedSchema : onlyBillingSchema,
    onSubmit: (values) => {
      handleFormikSubmit(values);
    },
  });

  const handleSubmit = async () => {
    dispatch(setCartLoading(true));
    try {
      const values = formikValues.current;

      let detialsUpdated;

      if (diffShipAddress) {
        detialsUpdated = await updateCheckoutDetails({
          billing: values.billing,
          shipping: values.shipping,
        });
      } else {
        detialsUpdated = await updateCheckoutDetails({
          billing: values.billing,
        });
      }

      if (!detialsUpdated) {
        console.log(detialsUpdated);
        toast.error('Error while updating checkout details.');
        reloadBrowser();
        return;
      }

      const selectedPaymentMethod = paymentMethods.find(
        (item) => item.value === paymentMethod
      );

      const payload: any = {
        customerId,
        billing: values.billing,
        shipping: diffShipAddress
          ? values.shipping
          : {
              firstName: values.billing.firstName,
              lastName: values.billing.lastName,
              address1: values.billing.address1,
              address2: values.billing.address2,
              city: values.billing.city,
              state: values.billing.state,
              postcode: values.billing.postcode,
              country: values.billing.country,
              phone: values.billing.phone,
            },
        lineItems,
        shippingLines,
        coupons,
        paymentMethodTitle: selectedPaymentMethod?.name ?? '',
      };

      const order = await createOrder(payload);
      if (!order) {
        console.log(order);
        toast.error('Error while creating order.');
        reloadBrowser();
        return;
      }

      return order;

      // setCheckoutSuccess(true);

      // setTimeout(() => {
      //   push(`/order-recieved/${order.orderNumber}?key=${order.orderKey}`);
      //   dispatch(setCartClose());
      //   dispatch(setCartSection('CART'));
      // }, 3000);
    } catch (error: any) {
      console.log(error);
      toast.error('Cart Session Expired');
      reloadBrowser();
    }
    dispatch(setCartLoading(false));
  };

  const processNMI = async (token) => {
    try {
      // const order = await handleSubmit();
      // if (!order) return;

      const order = {
        id: 'b3JkZXI6NTMwOTA=',
        databaseId: 53090,
        orderKey: 'wc_order_JcqYbdQgFGxiT',
        orderNumber: '53090',
        status: 'PROCESSING',
        date: '2024-08-06T18:39:38+00:00',
        paymentMethodTitle: 'NMI',
        subtotal: '$75.00',
        shippingTotal: '$8.00',
        shippingTax: '$0.00',
        discountTotal: '$0.00',
        discountTax: '$0.00',
        totalTax: '$0.00',
        total: '$83.00',
        billing: {
          firstName: 'test from nextjs',
          lastName: 'Kamal',
          company: null,
          address1: 'Lahore',
          address2: 'Lahore',
          city: 'Lahore',
          state: 'PB',
          postcode: '54000',
          country: 'PK',
          email: 'fareedkamal.dev@gmail.com',
          phone: '77777777777',
        },
        shipping: {
          firstName: null,
          lastName: null,
          company: null,
          address1: null,
          address2: null,
          city: null,
          state: null,
          postcode: null,
          country: null,
          email: null,
          phone: null,
        },
        lineItems: {
          nodes: [
            {
              id: 'b3JkZXJfaXRlbTo1MzA5MCs3MzgxNA==',
              databaseId: 73814,
              product: {
                node: {
                  id: 'cHJvZHVjdDo0MTEyNQ==',
                  databaseId: 41125,
                  name: 'Basilisk Fixed',
                  slug: 'basilisk-fixed',
                  type: 'VARIABLE',
                  image: {
                    id: 'cG9zdDo0OTIyNQ==',
                    sourceUrl:
                      'https://admin.damneddesigns.com/wp-content/uploads/DSC_0219-01-800x600.png',
                    altText: '',
                  },
                  price: '$75.00',
                  regularPrice: '$75.00',
                  salePrice: null,
                  stockStatus: 'IN_STOCK',
                  stockQuantity: null,
                  soldIndividually: false,
                },
              },
              variation: {
                node: {
                  id: 'cHJvZHVjdF92YXJpYXRpb246NDExNDc=',
                  databaseId: 41147,
                  name: 'Basilisk Fixed - Black G10, Stonewashed 14c28n',
                  slug: 'basilisk-fixed',
                  type: 'VARIATION',
                  image: {
                    id: 'cG9zdDo0OTIyNQ==',
                    sourceUrl:
                      'https://admin.damneddesigns.com/wp-content/uploads/DSC_0219-01-800x600.png',
                    altText: '',
                  },
                  price: '$75.00',
                  regularPrice: '$75.00',
                  salePrice: null,
                  stockStatus: 'IN_STOCK',
                  stockQuantity: 1,
                  soldIndividually: null,
                },
              },
              quantity: 1,
              total: '75',
              subtotal: '75',
              subtotalTax: null,
            },
          ],
        },
      };

      const token = {
        tokenType: 'inline',
        token: 'gpxE2G97-exjG7C-xAvdqk-f7b5972P88zJ',
        card: {
          number: '559049******1142',
          bin: '559049',
          exp: '0628',
          type: 'mastercard',
          hash: '',
        },
        check: {
          name: null,
          account: null,
          aba: null,
          transit: null,
          institution: null,
          hash: null,
        },
        wallet: {
          cardDetails: null,
          cardNetwork: null,
          email: null,
          billingInfo: {
            address1: null,
            address2: null,
            firstName: null,
            lastName: null,
            postalCode: null,
            city: null,
            state: null,
            country: null,
            phone: null,
          },
          shippingInfo: {
            method: null,
            address1: null,
            address2: null,
            firstName: null,
            lastName: null,
            postalCode: null,
            city: null,
            state: null,
            country: null,
            phone: null,
          },
        },
      };

      const data = {
        order: order,
        token: token,
      };

      const res = await fetch(`${process.env.FRONTEND_URL}/api/process-nmi`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      console.log('NMI process res: ', res);

      // setCheckoutSuccess(true);

      // setTimeout(() => {
      //   push(`/order-recieved/${order.orderNumber}?key=${order.orderKey}`);
      //   dispatch(setCartClose());
      //   dispatch(setCartSection('CART'));
      // }, 3000);
    } catch (error) {}
  };

  //-----------------> USE EFFECTS ------------------------------>
  //-------------------->
  //-------------------->

  useEffect(() => {
    formikValues.current = formik.values;
  }, [formik.values]);

  useEffect(() => {
    if (
      paymentMethod === 'nmi' &&
      cart?.total &&
      typeof window !== 'undefined'
    ) {
      window.CollectJS.configure({
        price: cart?.total ?? '',
        variant: 'inline',
        currency: 'USD',
        country: 'US',
        customCss: {
          border: '1px solid #d6d3d1',
          padding: '20px',
          'border-radius': '4px',
          'font-size': '20px',
          'font-family': 'Montserrat',
        },
        invalidCss: {
          border: '1px solid red',
        },
        validCss: {
          'background-color': '#d0ffd0',
        },
        // placeholderCss: {
        //   color: 'green',
        //   'background-color': '#687C8D',
        // },
        // focusCss: {
        //   border: '1px solid blue',
        // },
        fields: {
          ccnumber: {
            selector: '#ccnumber',
            title: 'Card Number',
            placeholder: '0000 0000 0000 0000',
          },
          ccexp: {
            selector: '#ccexp',
            title: 'Card Expiration',
            placeholder: 'MM / YY',
          },
          cvv: {
            // display: 'show',
            selector: '#cvv',
            title: 'CVV Code',
            placeholder: 'CVV',
          },
        },
        validationCallback: (field, status, message) => {
          if (!status) {
            //const m = field + ' is invalid: ' + message;
            if (field === 'ccnumber') {
              setValidNumber(message);
            }
            if (field === 'ccexp') {
              setValidExpiration(message);
            }
            if (field === 'cvv') {
              setValidCvv(message);
            }
          } else {
            if (field === 'ccnumber') {
              setValidNumber('');
            }
            if (field === 'ccexp') {
              setValidExpiration('');
            }
            if (field === 'cvv') {
              setValidCvv('');
            }
          }
        },

        // timeoutDuration: 2000,
        // timeoutCallback: () => {
        //   console.log('timeout callback');
        //   formik.setSubmitting(false);
        //   // console.log(
        //   //   "The tokenization didn't respond in the expected timeframe.  This could be due to an invalid or incomplete field or poor connectivity"
        //   // );
        //   //setAlertMessage(message);
        // },

        callback: (token: any) => {
          console.log(token);
          if (!token) {
            toast.error('Transaction failed. Please try again.');
            return;
          }
          processNMI(token);
        },
      });
    }
  }, [paymentMethod, cart?.total]);

  useEffect(() => {
    if (
      paymentMethod === 'sezzle' &&
      cart?.total &&
      typeof window !== 'undefined' &&
      window.Checkout
    ) {
      const checkout = new Checkout({
        mode: 'popup',
        publicKey: 'sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT', // replace with your Sezzle public key
        apiMode: 'live', // or 'live'
        apiVersion: 'v2',
      });

      checkout.renderSezzleButton('sezzle-smart-button-container');

      checkout.init({
        onClick: () => {
          checkout.startCheckout({
            checkout_payload: {
              order: {
                intent: 'AUTH',
                reference_id: 'ord_12345', // replace with your unique order ID
                description: 'sezzle-store - #12749253509255',
                order_amount: {
                  amount_in_cents: Number(cart?.total as string) * 100,
                  currency: 'USD',
                },
              },
            },
          });
        },
        onComplete: (event) => {
          console.log(event.data);
          setSezzleResult(event.data);
        },
        onCancel: () => {
          console.log('checkout canceled');
          formik.setSubmitting(false);
        },
        onFailure: () => {
          console.log('checkout failed');
          formik.setSubmitting(false);
        },
      });
    }
  }, [paymentMethod, cart?.total]);

  useEffect(() => {
    formik.setFormikState((prevState) => ({
      ...prevState,
      validationSchema: diffShipAddress ? combinedSchema : onlyBillingSchema,
    }));
  }, [diffShipAddress]);

  return (
    <>
      {sezzleResult ? (
        <div className=' fixed w-[50%] h-[50%] z-[999999] left-0 text-lg p-4 bg-white text-black'>
          {JSON.stringify(sezzleResult)}
        </div>
      ) : null}

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
              <MenuItem key={'nmi'} value={'nmi'}>
                <div className='flex gap-2'>
                  <img
                    src='https://admin.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/visa.svg'
                    alt='Visa'
                    width='32'
                  />
                  <img
                    src='https://admin.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/mastercard.svg'
                    alt='Mastercard'
                    width='32'
                  />
                  <img
                    src='https://admin.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/amex.svg'
                    alt='Amex'
                    width='32'
                  />
                  <img
                    src='https://admin.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/discover.svg'
                    alt='Discover'
                    width='32'
                  />
                  <img
                    src='https://admin.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/diners.svg'
                    alt='Diners Club'
                    width='32'
                  />
                  <img
                    src='https://admin.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/jcb.svg'
                    alt='JCB'
                    width='32'
                  />
                  <img
                    src='https://admin.damneddesigns.com/wp-content/plugins/woocommerce/assets/images/icons/credit-cards/maestro.svg'
                    alt='Maestro'
                    width='32'
                  />
                </div>
              </MenuItem>
              <MenuItem key={'sezzle'} value={'sezzle'}>
                <img
                  src='https://d34uoa9py2cgca.cloudfront.net/branding/sezzle-logos/png/sezzle-logo-sm-100w.png'
                  alt='sezzle'
                />
              </MenuItem>
              <MenuItem key={'cod'} value={'cod'}>
                Cash on Delivery
              </MenuItem>
            </Select>
          </FormControl>

          {paymentMethod === 'nmi' ? (
            <div className='mt-4'>
              <div className='mb-2'>
                <div id='ccnumber' />
                {validnumber && (
                  <div className='text-red-600 text-[12px]'>{validnumber}</div>
                )}
              </div>

              <div className='flex justify-between gap-4'>
                <div className='w-full'>
                  <div id='ccexp' />
                  {validexpiration && (
                    <div className='text-red-600 text-[12px]'>
                      {validexpiration}
                    </div>
                  )}
                </div>

                <div className='w-full'>
                  <div id='cvv' />
                  {validcvv && (
                    <div className='text-red-600 text-[12px]'>{validcvv}</div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {paymentMethod === 'sezzle' ? (
            <div className='hidden' id='sezzle-smart-button-container' />
          ) : null}
        </div>

        <CartTotal showDetails={true} />
      </div>

      <Button
        type='submit'
        disabled={cartLoading || formik.isSubmitting}
        //onClick={() => formik.handleSubmit()}
        onClick={processNMI}
        className='py-8 bg-stone-500 w-full rounded-none text-white hover:bg-stone-600 hidden'
      >
        {`Place Order - $${cart?.total}`}
      </Button>

      {checkoutSuccess ? (
        <div className='absolute bg-white z-[999] h-full w-full flex '>
          <div className='m-auto p-4 text-center'>
            <p className='mb-2'>
              {`Thank You. Your order has been recieved. Plese wait. We're redirecting to your order...`}
            </p>
            <Loader />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CheckoutSection;
