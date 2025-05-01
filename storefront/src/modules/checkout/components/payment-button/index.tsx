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

  switch (true) {
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isNmi(paymentSession?.provider_id):
      return <NmiPaymentForm cart={cart} data-testid={dataTestId} />
    case isSezzle(paymentSession?.provider_id):
      // TODO: Replace with actual SezzlePaymentForm component when implemented
      // return <SezzlePaymentForm cart={cart} data-testid={dataTestId} />
      return <Button disabled>Sezzle (Not Implemented)</Button>
    default:
      return <Button disabled>Select a payment method</Button>
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
