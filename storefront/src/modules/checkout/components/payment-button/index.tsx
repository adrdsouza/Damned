"use client"

import { isCOD, isManual, isNMI, isSezzle } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import React, { useState, useEffect } from "react"
import ErrorMessage from "../error-message"

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

  // Find any payment session, regardless of status
  const allSessions = cart?.payment_collection?.payment_sessions || []
  
  // Debug all payment sessions
  console.log("All Payment Sessions:", allSessions)
  
  // Find active payment session (should be the selected one)
  const activeSession = allSessions.find(s => s.status === "pending")
  
  // If there's no active session, look for COD session
  const findCODSession = allSessions.find(s => isCOD(s.provider_id))
  
  // Use the active session if available, or the first session, or null
  // Important: The active session is what matters, regardless of payment type
  const effectiveSession = activeSession || findCODSession || allSessions[0] || null
  
  const [buttonText, setButtonText] = useState("Place Order")
  
  // Set appropriate button text based on payment method
  useEffect(() => {
    if (!effectiveSession) {
      setButtonText("Select a payment method")
      return
    }
    
    const providerId = effectiveSession.provider_id || ""
    console.log("Setting button text for provider:", providerId)
    
    let newButtonText = "Place Order"
    
    if (isCOD(providerId)) {
      newButtonText = "Pay on Delivery"
    } else if (isNMI(providerId)) {
      newButtonText = "Pay with Credit Card"
    } else if (isSezzle(providerId)) {
      newButtonText = "Pay with Sezzle" 
    } else if (isManual(providerId)) {
      newButtonText = "Place Order"
    }
    
    // Set the button text and log it
    setButtonText(newButtonText)
    console.log("Button text set to:", newButtonText, "for provider:", providerId)
  }, [effectiveSession])

  // Return disabled button if no payment method selected
  if (!effectiveSession) {
    return <Button disabled>Select a payment method</Button>
  }

  // Always use the standard payment button with the appropriate text
  return (
    <StandardPaymentButton 
      notReady={notReady} 
      data-testid={dataTestId}
      buttonText={buttonText}
    />
  )
}

// Unified payment button for all payment methods
const StandardPaymentButton = ({ 
  notReady, 
  "data-testid": dataTestId,
  buttonText = "Place Order" 
}: { 
  notReady: boolean
  "data-testid"?: string
  buttonText?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePayment = () => {
    setSubmitting(true)

    placeOrder()
      .catch((err) => {
        console.error("Place order error:", err)
        setErrorMessage(err?.message || "An error occurred while placing your order")
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId || "submit-order-button"}
      >
        {buttonText}
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="payment-error-message"
      />
    </>
  )
}

export default PaymentButton
