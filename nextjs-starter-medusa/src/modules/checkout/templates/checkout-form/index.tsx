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
        const shipping = await listCartShippingMethods(cart.id)
        const payment = await listCartPaymentMethods(cart.region?.id ?? "")

        if (shipping && payment) {
          setShippingMethods(shipping)
          setPaymentMethods(payment)
        }
      } catch (error) {
        console.error("Failed to fetch methods:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMethods()
  }, [cart])

  if (!cart || loading) {
    return null
  }

  return (
    <div className="w-full grid grid-cols-1 gap-y-8">
      <Addresses cart={cart} customer={customer} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep} />

      <Shipping cart={cart} availableShippingMethods={shippingMethods} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep}/>

      <Payment cart={cart} availablePaymentMethods={paymentMethods} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep} />

      <Review cart={cart} checkoutStep={checkoutStep} setCheckoutStep={setCheckoutStep}/>
    </div>
  )
}
