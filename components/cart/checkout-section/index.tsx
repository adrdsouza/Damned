import { ArrowLeft } from 'lucide-react';
import { text } from '@/app/styles';
import CartTotal from '../cart-total';
import { dispatch } from '@/redux/store';
import {
  setCartClose,
  setCartLoading,
  setCartOpen,
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
import { v4 as uuidv4 } from 'uuid';
import { addCustomFieldToOrder } from '@/lib/graphql';
import { nmiResCodes } from './helpers';

const CheckoutSection = () => {
  //-------------------->     CONSTANTS & HOOKS
  //-------------------->
  //-------------------->

  const [validnumber, setValidNumber] = useState('');
  const [validexpiration, setValidExpiration] = useState('');
  const [validcvv, setValidCvv] = useState('');

  const cartLoading = useSelector((state: any) => state.cartSlice.cartLoading);

  const paymentMethods = [
    { value: 'nmi', name: 'NMI' },
    { value: 'sezzlepay', name: 'Sezzle' },
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

  const handleCreateOrder = async (customFields: any) => {
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

      const lineItemsData = cart?.contents?.nodes.map((item) => {
        const attributesList: any =
          item.variation?.attributes?.map((attr) => ({
            id: attr?.id,
            key: attr?.label,
            value: attr?.value,
          })) || [];

        // attributesList?.push({
        //   key: '_reduced_stock',
        //   value: String(item.quantity),
        // });

        return {
          name: item.variation?.node.name,
          productId: item.product?.node.databaseId,
          variationId: item.variation?.node.databaseId,
          quantity: item.quantity,
          metaData: attributesList,
          total: item?.total,
        };
      });

      //@ts-ignore
      const shippingMethod = cart?.availableShippingMethods[0]?.rates[0];
      const shippingLinesData = [
        {
          //id: String(shippingMethod?.id),
          //instanceId: String(shippingMethod?.instanceId),
          methodTitle: shippingMethod?.label,
          methodId: shippingMethod?.methodId,
          total: shippingMethod?.cost,
          metaData: [
            {
              key: 'Items',
              //@ts-ignore
              value: cart?.availableShippingMethods[0]?.packageDetails,
            },
          ],
        },
      ];

      let transactionId;

      if (paymentMethod === 'nmi') {
        transactionId = customFields?.find(
          (field) => field.key === '_nmi_charge_id'
        );
      }
      if (paymentMethod === 'sezzlepay') {
        transactionId = customFields?.find(
          (field) => field.key === 'Sezzle Checkout ID'
        );
      }

      const selectedPaymentMethod = paymentMethods.find(
        (d) => d.value === paymentMethod
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
        lineItems: lineItemsData,
        shippingLines: shippingLinesData,
        coupons,
        paymentMethod: paymentMethod,
        paymentMethodTitle: selectedPaymentMethod?.value ?? '',
        //status: 'PROCESSING',
        isPaid: true,
        transactionId: transactionId?.value ?? '',
      };

      const order = await createOrder(payload);
      if (!order) {
        console.log(order);
        toast.error('Error while creating order.');
        reloadBrowser();
        return;
      }

      await Promise.all(
        customFields?.map(
          async (field) =>
            await addCustomFieldToOrder(
              order?.databaseId as number,
              field.key,
              field.value
            )
        )
      );

      setCheckoutSuccess(true);

      setTimeout(() => {
        push(`/order-recieved/?id=${order.orderNumber}&key=${order.orderKey}`);
        dispatch(setCartClose());
        dispatch(setCartSection('CART'));
      }, 2000);
    } catch (error: any) {
      console.log(error);
      toast.error('Cart Session Expired');
      reloadBrowser();
    }
    dispatch(setCartLoading(false));
  };

  const handleNmiCheckout = async (token) => {
    dispatch(setCartLoading(true));
    try {
      const orderRef = uuidv4().replace(/-/g, '').substring(0, 16);
      //@ts-ignore
      const details = cart?.availableShippingMethods[0]?.packageDetails;
      const orderDesc = `Damned Designs Order Reference #${orderRef} (${details})`;
      const { billing, shipping } = formikValues.current;

      const data = {
        order: {
          total: cart?.total as string,
          orderDesc: orderDesc,
          orderRef: orderRef,
          billing: billing,
          shipping: diffShipAddress
            ? shipping
            : {
                firstName: billing.firstName,
                lastName: billing.lastName,
                address1: billing.address1,
                address2: billing.address2,
                city: billing.city,
                state: billing.state,
                postcode: billing.postcode,
                country: billing.country,
                phone: billing.phone,
              },
        },
        token: token,
      };

      //console.log(data);

      const res = await fetch(`${process.env.FRONTEND_URL}/api/process-nmi`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const resData = await res.json();

      if (!resData?.status) {
        throw new Error();
      }

      // const dummyRes = {
      //   response: '3',
      //   responsetext: 'Payment Token does not exist REFID:3129089407',
      //   authcode: '',
      //   transactionid: '',
      //   avsresponse: '',
      //   cvvresponse: '',
      //   orderid: '53090',
      //   type: 'sale',
      //   response_code: '300',
      // };

      if (resData?.data?.response === '2' || resData?.data?.response === '3') {
        const message = nmiResCodes[String(resData.data.response_code)];
        toast.error(message);
        dispatch(setCartLoading(false));
        dispatch(setCartClose());
        dispatch(setCartSection('CART'));
        return;
      }

      if (resData?.data?.response === '1') {
        toast.success('Transcation was successfull');
        handleCreateOrder([
          { key: 'Reference Order ID', value: orderRef },
          { key: 'NMI Transcation ID', value: resData?.data?.transactionid },
          { key: '_nmi_charge_id', value: resData?.data?.transactionid },
          { key: '_nmi_authorization_code', value: resData?.data?.authcode },
          { key: '_nmi_card_last4', value: token.card.number.slice(-4) },
          { key: '_nmi_card_type', value: token.card.type },
          { key: '_nmi_charge_captured', value: 'yes' },
        ]);
      }
    } catch (error) {
      console.log(error);
      toast.error('We were unable to complete transcation. Please try again');
      dispatch(setCartLoading(false));
      //reloadBrowser();
    }
  };

  const handleSezzleCheckout = async () => {
    if (
      paymentMethod === 'sezzlepay' &&
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

      const orderRef = uuidv4().replace(/-/g, '').substring(0, 16);
      //@ts-ignore
      const details = cart?.availableShippingMethods[0]?.packageDetails;
      const orderDesc = `Damned Designs Order Reference #${orderRef} (${details})`;

      checkout.init({
        onClick: () => {
          checkout.startCheckout({
            checkout_payload: {
              order: {
                intent: 'AUTH',
                reference_id: orderRef, // replace with your unique order ID
                description: orderDesc,
                order_amount: {
                  amount_in_cents: Number(cart?.total as string) * 100,
                  currency: 'USD',
                },
              },
            },
          });
        },
        onComplete: (event) => {
          //console.log('checkout complete');
          //console.log(event.data);
          // const x = {
          //   status: 'success',
          //   checkout_uuid: 'b88cc575-8587-4063-9d97-8811a84d354b',
          //   szl_source: 'checkout',
          //   session_uuid: null,
          //   order_uuid: null,
          // };

          if (event.data.status === 'success') {
            handleCreateOrder([
              { key: 'Reference Order ID', value: orderRef },
              { key: 'Sezzle Checkout ID', value: event.data.checkout_uuid },
            ]);
          } else {
            toast.error('Error while completing Sezzle transaction');
            //reloadBrowser();
          }
        },
        onCancel: () => {
          //console.log('checkout canceled');
          formik.setSubmitting(false);
        },
        onFailure: () => {
          //console.log('checkout failed');
          formik.setSubmitting(false);
        },
      });
    }

    const button = document.getElementById('sezzle-smart-button');

    if (button) {
      button.click();
    } else {
      formik.setSubmitting(false);
    }
  };

  const handleFormikSubmit = async () => {
    if (paymentMethod === '') {
      toast.error('Please choose a payment method.');
      formik.setSubmitting(false);
    } else if (paymentMethod === 'nmi') {
      if (typeof window !== 'undefined') {
        window.CollectJS.startPaymentRequest();
      }
    } else if (paymentMethod === 'sezzlepay') {
      handleSezzleCheckout();
    } else if (paymentMethod === 'cod') {
      handleCreateOrder([]);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: diffShipAddress ? combinedSchema : onlyBillingSchema,
    onSubmit: (values) => {
      handleFormikSubmit();
    },
  });

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
          handleNmiCheckout(token);
        },
      });
    }
  }, [paymentMethod, cart?.total]);

  // useEffect(() => {
  //   if (
  //     paymentMethod === 'sezzle' &&
  //     cart?.total &&
  //     typeof window !== 'undefined' &&
  //     window.Checkout
  //   ) {
  //     const checkout = new Checkout({
  //       mode: 'popup',
  //       publicKey: 'sz_pub_IW6NF5ARDHoLxAS4cCzOFKGDLNzJ0g0x', // replace with your Sezzle public key
  //       apiMode: 'sandbox', // or 'live'
  //       apiVersion: 'v2',
  //     });

  //     checkout.renderSezzleButton('sezzle-smart-button-container');

  //     checkout.init({
  //       onClick: () => {
  //         checkout.startCheckout({
  //           checkout_payload: {
  //             order: {
  //               intent: 'AUTH',
  //               reference_id: 'ord_12345', // replace with your unique order ID
  //               description: 'sezzle-store - #12749253509255',
  //               order_amount: {
  //                 amount_in_cents: Number(cart?.total as string) * 100,
  //                 currency: 'USD',
  //               },
  //             },
  //           },
  //         });
  //       },
  //       onComplete: (event) => {
  //         console.log('checkout complete');
  //         console.log(event.data);
  //         const x = {
  //           status: 'success',
  //           checkout_uuid: 'b88cc575-8587-4063-9d97-8811a84d354b',
  //           szl_source: 'checkout',
  //           session_uuid: null,
  //           order_uuid: null,
  //         };
  //         setSezzleResult(event.data);
  //       },
  //       onCancel: () => {
  //         console.log('checkout canceled');
  //         formik.setSubmitting(false);
  //       },
  //       onFailure: () => {
  //         console.log('checkout failed');
  //         formik.setSubmitting(false);
  //       },
  //     });
  //   }
  // }, [paymentMethod, cart?.total]);

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
              <MenuItem key={'sezzlepay'} value={'sezzlepay'}>
                <img
                  src='https://d34uoa9py2cgca.cloudfront.net/branding/sezzle-logos/png/sezzle-logo-sm-100w.png'
                  alt='sezzle'
                />
              </MenuItem>
              {/* <MenuItem key={'cod'} value={'cod'}>
                Cash on Delivery
              </MenuItem> */}
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

          {paymentMethod === 'sezzlepay' ? (
            <div className='hidden' id='sezzle-smart-button-container' />
          ) : null}
        </div>

        <CartTotal showDetails={true} />
      </div>

      <Button
        type='submit'
        disabled={cartLoading || formik.isSubmitting}
        onClick={() => formik.handleSubmit()}
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
