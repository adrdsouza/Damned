"use client"

import { useEffect, useState } from "react"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes, StoreCartShippingOption, StorePaymentProvider } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

export default function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  const [shippingMethods, setShippingMethods] = useState<StoreCartShippingOption[]>([])
  const [paymentMethods, setPaymentMethods] = useState<StorePaymentProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutStep, setCheckoutStep] = useState("address")


  useEffect(() => {
    const fetchMethods = async () => {
      if (!cart) return

      setLoading(true); // Ensure loading state is true at the start
      try {
        console.log("============= CHECKOUT DEBUG START =============");
        console.log("CheckoutForm - Cart:", JSON.stringify({
          id: cart.id,
          region_id: cart.region?.id,
          payment_collection: cart.payment_collection,
          payment_session: cart.payment_collection?.payment_sessions?.[0]
        }));

        // Fetch shipping methods
        console.log("CheckoutForm - Fetching shipping methods for Cart ID:", cart.id);
        const shipping = await listCartShippingMethods(cart.id);
        console.log("CheckoutForm - Shipping Methods:", JSON.stringify(shipping));

        // Fetch payment methods
        console.log("CheckoutForm - Fetching payment methods for Region ID:", cart.region?.id);
        const payment = await listCartPaymentMethods(cart.region?.id ?? "");
        console.log("CheckoutForm - Payment Methods FINAL:", JSON.stringify(payment));
        console.log("CheckoutForm - Available Payment Provider IDs:", payment ? payment.map(p => p.id).join(", ") : "None");

        if (shipping) {
          console.log("CheckoutForm - Setting shipping methods, count:", shipping.length);
          setShippingMethods(shipping);
        } else {
          console.warn("CheckoutForm - No shipping methods returned");
        }
        
        if (payment && payment.length > 0) {
          console.log("CheckoutForm - Setting payment methods, count:", payment.length);
          setPaymentMethods(payment);
        } else {
          console.warn("CheckoutForm - No payment methods returned!");
        }
        console.log("============= CHECKOUT DEBUG END =============");
      } catch (error) {
        console.error("CheckoutForm - Failed to fetch methods:", error);
        setShippingMethods([]); // Clear methods on error
        setPaymentMethods([]); // Clear methods on error
      } finally {
        setLoading(false);
      }
    }

    fetchMethods();
  }, [cart]); // Dependency array includes cart

  if (!cart) {
    // Optionally show a message or skeleton if cart is null initially
    return <div>Loading cart...</div>;
  }

  if (loading) {
    // Optionally show a loading state for methods
    return <div>Loading checkout methods...</div>;
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep} availableShippingMethods={shippingMethods} availablePaymentMethods={paymentMethods} />

      {/* Payment component is uncommented */}
      <Payment cart={cart} availablePaymentMethods={paymentMethods} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep} />

      {/* <Review cart={cart} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep}/> */}
    </div>
  )
}
