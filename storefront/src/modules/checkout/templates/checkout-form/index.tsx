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

      try {
        // --- START: Added Logging ---
        console.log("CheckoutForm - Fetching methods for Cart ID:", cart.id, "Region ID:", cart.region?.id);
        // --- END: Added Logging ---

        const shipping = await listCartShippingMethods(cart.id) // Keep fetching shipping, just don't log it confusingly
        const payment = await listCartPaymentMethods(cart.region?.id ?? "")

        // --- START: Added Logging ---
        console.log("CheckoutForm - Fetched Payment Methods:", payment);
        // --- END: Added Logging ---

        if (shipping && payment) {
          setShippingMethods(shipping)
          setPaymentMethods(payment)
        }
      } catch (error) {
        console.error("CheckoutForm - Failed to fetch methods:", error) // Added context to error log
      } finally {
        setLoading(false)
      }
    }

    fetchMethods()
  }, [cart])

  if (!cart || loading) {
    return null // Or a loading skeleton
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep} availableShippingMethods={shippingMethods} availablePaymentMethods={paymentMethods} />

      {/* Uncommented Payment component */}
      <Payment cart={cart} availablePaymentMethods={paymentMethods} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep} />

      {/* <Review cart={cart} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep}/> */}
    </div>
  )
}
