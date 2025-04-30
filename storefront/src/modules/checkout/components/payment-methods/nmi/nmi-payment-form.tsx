"use client"

import React, { useEffect, useRef } from "react"
import { Button } from "@medusajs/ui"
import { useCart } from "@lib/hooks/use-cart"
import { placeOrder } from "@lib/data/cart"
import ErrorMessage from "../../error-message"
import { useCheckout } from "@lib/hooks/use-checkout"

// Declare CollectJS to avoid TypeScript errors
declare const CollectJS: any;

const NmiPaymentForm: React.FC = () => {
  const { cart } = useCart()
  const { onPaymentCompleted } = useCheckout()
  const [submitting, setSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!cart || !formRef.current) return

    // Ensure CollectJS script is loaded before configuring
    if (typeof CollectJS === 'undefined') {
      console.error("CollectJS script not loaded.")
      // You might want to handle this case, e.g., load the script dynamically
      return
    }

    try {
      CollectJS.configure({
        // Replace with your actual tokenization key from environment variables
        // You'll need to pass this from the backend or environment
        tokenizationKey: process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY, // Assuming an env var for the tokenization key
        paymentSelector: "#nmi-pay-button", // ID of the submit button
        variant: "inline", // Or "lightbox"
        fields: {
          ccnumber: {
            selector: "#nmi-ccnumber", // ID of the div for card number iframe
            placeholder: "Card Number",
          },
          ccexp: {
            selector: "#nmi-ccexp", // ID of the div for expiration date iframe
            placeholder: "MM / YY",
          },
          cvv: {
            selector: "#nmi-cvv", // ID of the div for CVV iframe
            placeholder: "CVV",
          },
        },
        callback: function(response: any) {
          // This callback is triggered after tokenization
          if (response.token) {
            // Add the payment_token to the form and submit
            const input = document.createElement("input")
            input.type = "hidden"
            input.name = "payment_token"
            input.value = response.token
            formRef.current?.appendChild(input)

            // Submit the form to your backend endpoint for processing
            // The backend will use this token with the NMI Payment API
            // For now, we'll call the placeOrder function which needs to be updated
            // on the backend to handle the payment_token
            handlePlaceOrder(response.token)

          } else if (response.fields && response.fields.ccnumber && response.fields.ccnumber.error) {
             setErrorMessage(response.fields.ccnumber.error)
             setSubmitting(false)
          } else {
            setErrorMessage("An unknown error occurred during tokenization.")
            setSubmitting(false)
          }
        },
        validationCallback: function(field: string, status: boolean, message: string) {
          // Handle validation feedback if needed
          console.log(`Field: ${field}, Status: ${status}, Message: ${message}`);
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

  }, [cart, onPaymentCompleted]) // Re-run effect if cart or onPaymentCompleted changes

  const handlePlaceOrder = async (paymentToken: string) => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      // Call the backend to place the order using the payment token
      // This part needs to be implemented in your backend's order placement logic
      // For now, we'll just call the existing placeOrder which needs modification
      await placeOrder()
      onPaymentCompleted() // Assuming placeOrder handles the payment with the token
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred while placing the order.")
      setSubmitting(false)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage(null)

    // CollectJS will handle the tokenization and call the callback
    // if the form is valid. If not, validationCallback will be called.
    // We don't directly submit the form here.
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      {/* Divs for CollectJS iframes */}
      <div>
        <label>Card Number</label>
        <div id="nmi-ccnumber"></div>
      </div>
      <div>
        <label>Expiration Date</label>
        <div id="nmi-ccexp"></div>
      </div>
      <div>
        <label>CVV</label>
        <div id="nmi-cvv"></div>
      </div>

      {/* Other form fields (billing address, etc.) would go here */}

      <Button
        type="submit"
        id="nmi-pay-button" // ID for CollectJS paymentSelector
        isLoading={submitting}
        disabled={submitting}
        className="mt-4"
      >
        Place Order
      </Button>

      <ErrorMessage error={errorMessage} />
    </form>
  )
}

export default NmiPaymentForm