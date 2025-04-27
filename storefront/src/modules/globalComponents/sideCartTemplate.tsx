"use client"
import SignInPrompt from '@modules/cart/components/sign-in-prompt';
import ItemsTemplate from '@modules/cart/templates/items';
import Summary from '@modules/cart/templates/summary';
import PaymentWrapper from '@modules/checkout/components/payment-wrapper';
import CheckoutForm from '@modules/checkout/templates/checkout-form';
import CheckoutSummary from '@modules/checkout/templates/checkout-summary';
import Divider from '@modules/common/components/divider';
import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'

export default function SideCartTemplate({ cart, customer }: any) {


  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);


  const hideCartfn = () => {
    setShowCart(false);
    setShowCheckout(false)
  }
  const showCartfn = () => {
    setShowCart(true);
    setShowCheckout(true)

  }
  const showCheckoutfn = () => {
    setShowCart(false);
    setShowCheckout(true)
  }

  return (
    <>
   <div className="fixed top-1/2 right-0 transform -translate-y-1/2 w-full md:w-[800px] max-w-[100vw] md:max-w-[90vw]">
  <div className='h-[85vh] bg-white shadow-xl rounded-l-lg overflow-hidden'>
    <div className='absolute top-[10px] right-[15px]'>
      <RxCross2 onClick={hideCartfn} className='text-base' />
    </div>
    
    <div className='flex flex-col h-full bg-white'>
      {cart?.items?.length > 0 ? (
        <div className='flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden'>
          {/* On mobile, cart items will stack above checkout form */}
          <div className="w-full md:w-2/5 bg-gray-50 p-4 md:overflow-y-auto flex flex-col h-full" 
               data-testid="cart-container">
            <ItemsTemplate cart={cart} />
          </div>
          <div className="w-full md:w-3/5 p-4 md:overflow-y-auto h-full">
            <PaymentWrapper cart={cart}>
              <CheckoutForm cart={cart} customer={customer} />
            </PaymentWrapper>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 px-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" stroke-linecap="round" strokeLinejoin="round" className="lucide-icon lucide lucide-shopping-bag mx-auto mb-4 text-gray-400"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-8">Start shopping with our featured products.</p>
        </div>
      )}
    </div>
  </div>
</div>
    </>
  )
}
