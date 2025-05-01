"use client"

import React, { useEffect, useRef } from "react"
import { Button } from "@medusajs/ui"
import { placeOrder } from "@lib/data/cart"
import ErrorMessage from "../../error-message"
import { HttpTypes } from "@medusajs/types"
// Removed unused sdk import

// Declare CollectJS to avoid TypeScript errors
declare const CollectJS: any;

// Define props for the component
interface NmiPaymentFormProps {
  cart: HttpTypes.StoreCart
  "data-testid"?: string
}

const NmiPaymentForm: React.FC<NmiPaymentFormProps> = ({
  cart, // Use cart from props
  "data-testid": dataTestId, // Use data-testid from props
}) => {
  const [submitting, setSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const paymentButtonId = dataTestId || 'nmi-pay-button' // Define button ID for consistency

  useEffect(() => {
    // Don't proceed if cart is not available or form ref is not set
    if (!cart || !formRef.current) return

    // Ensure CollectJS script is loaded before configuring
    if (typeof CollectJS === 'undefined') {
      console.error("CollectJS script not loaded.")
      setErrorMessage("Payment script failed to load. Please refresh.")
      return
    }

    // Clear previous errors and configure CollectJS
    setErrorMessage(null)
    try {
      CollectJS.configure({
        tokenizationKey: process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY,
        paymentSelector: `#${paymentButtonId}`, // Use consistent button ID
        variant: "inline",
        fields: {
          ccnumber: { selector: "#nmi-ccnumber", placeholder: "Card Number" },
          ccexp: { selector: "#nmi-ccexp", placeholder: "MM / YY" },
          cvv: { selector: "#nmi-cvv", placeholder: "CVV" },
        },
        callback: function(response: any) {
          if (response.token) {
            // Call handlePlaceOrder with the token
            handlePlaceOrder(response.token)
          } else if (response.fields?.ccnumber?.error) {
             setErrorMessage(response.fields.ccnumber.error)
             setSubmitting(false)
          } else {
            setErrorMessage("An unknown error occurred during tokenization.")
            setSubmitting(false)
          }
        },
        validationCallback: function(field: string, status: boolean, message: string) {
          console.log(`NMI Validation - Field: ${field}, Status: ${status}, Message: ${message}`);
          // Optionally update UI based on validation status
        },
        timeoutCallback: function() {
          setErrorMessage("Payment tokenization timed out.")
          setSubmitting(false)
        }
      });
    } catch (e: any) {
      setErrorMessage(`Error configuring CollectJS: ${e.message}`)
      setSubmitting(false)
    }

    // Cleanup CollectJS instance on component unmount
    return () => {
      if (typeof CollectJS !== 'undefined' && CollectJS.empty) {
         CollectJS.empty();
      }
    };

  }, [cart, paymentButtonId]) // Re-run effect if cart or paymentButtonId changes

  const handlePlaceOrder = async (paymentToken: string) => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      // Assuming the backend NMI plugin handles the token associated with the session
      console.log("NMI Payment Token obtained:", paymentToken);
      console.log("Calling placeOrder() - Backend NMI plugin should handle token.");
      await placeOrder() // Call original placeOrder

    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred while processing payment.")
      setSubmitting(false) // Ensure submitting is false on error
    }
    // Note: setSubmitting(false) should ideally happen after successful order placement
    // or navigation, but placeOrder currently handles navigation internally.
  }

  // This function prevents default form submission; CollectJS handles the submission logic
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true) // Set submitting state when button is clicked
    setErrorMessage(null)
    // CollectJS takes over via the paymentSelector
    // It will call the 'callback' upon successful tokenization.
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      {/* Divs for CollectJS iframes */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
        <div id="nmi-ccnumber" className="p-2 border border-gray-300 rounded-md"></div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
          <div id="nmi-ccexp" className="p-2 border border-gray-300 rounded-md"></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <div id="nmi-cvv" className="p-2 border border-gray-300 rounded-md"></div>
        </div>
      </div>

      <Button
        type="submit"
        id={paymentButtonId} // Use consistent button ID
        isLoading={submitting}
        disabled={submitting || !cart} // Disable if submitting or no cart
        className="w-full"
        data-testid={dataTestId || "nmi-submit-button"}
      >
        Place Order
      </Button>

      <ErrorMessage error={errorMessage} data-testid="nmi-payment-error-message" />
    </form>
  )
}

export default NmiPaymentForm