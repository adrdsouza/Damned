"use client"

import { isManual, isNmi, isSezzle, isStripe, paymentInfoMap } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import NmiPaymentForm from "../payment-methods/nmi/nmi-payment-form"
// import SezzlePaymentForm from "../payment-methods/sezzle/sezzle-payment-form" // Placeholder for future import

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]
  
  console.log("Payment Button - Payment Session:", paymentSession);
  console.log("Payment Button - Provider ID:", paymentSession?.provider_id);

  // Always print which provider would be selected with current logic
  if (isManual(paymentSession?.provider_id)) {
    console.log("Payment Button - Provider is Manual Payment");
  } else if (isNmi(paymentSession?.provider_id)) {
    console.log("Payment Button - Provider is NMI");
  } else if (isSezzle(paymentSession?.provider_id)) {
    console.log("Payment Button - Provider is Sezzle");
  } else {
    console.log("Payment Button - Provider is Unknown:", paymentSession?.provider_id);
  }

  // If no payment session or provider_id is null/undefined, use NMI as fallback
  if (!paymentSession || !paymentSession.provider_id) {
    console.log("Payment Button - No payment session or provider_id, using NMI as fallback");
    return <NmiPaymentForm cart={cart} data-testid={dataTestId} />;
  }

  switch (true) {
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isNmi(paymentSession?.provider_id) || paymentSession?.provider_id === "pp_nmi_nmi":
      return <NmiPaymentForm cart={cart} data-testid={dataTestId} />
    case isSezzle(paymentSession?.provider_id):
      // TODO: Replace with actual SezzlePaymentForm component when implemented
      // return <SezzlePaymentForm cart={cart} data-testid={dataTestId} />
      return <Button disabled>Sezzle (Not Implemented)</Button>
    default:
      // Fallback to NMI if we can't determine the payment provider
      console.log("Payment Button - Unknown provider, using NMI as fallback");
      return <NmiPaymentForm cart={cart} data-testid={dataTestId} />
  }
}

const GenericPaymentButton = ({
  notReady,
  providerId,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  providerId?: string
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  const paymentMethodTitle = providerId ? paymentInfoMap[providerId]?.title || "Unknown Payment Method" : "Select a payment method";

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        {paymentMethodTitle}
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid={`${providerId}-payment-error-message`}
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid="submit-order-button"
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
