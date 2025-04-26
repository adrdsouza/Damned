"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import { paymentInfoMap, isCOD, isNMI, isSezzle, isManual } from "@lib/constants"
import PaymentButton from "../payment-button"

const Review = ({ 
  cart, 
  checkoutStep,
  setCheckoutStep
}: { 
  cart: any, 
  checkoutStep: string
  setCheckoutStep: any 
}) => {
  const isOpen = checkoutStep === "review"

  // Disable gift card functionality
  const paidByGiftcard = false

  // Check if all previous steps are completed
  const previousStepsCompleted =
    cart?.shipping_address &&
    cart?.shipping_methods?.length > 0 &&
    (cart?.payment_collection || paidByGiftcard)

  // Find the active payment session (should be in pending status)
  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (session: any) => session.status === "pending"
  )
  
  // Find COD session as a fallback
  const codSession = cart?.payment_collection?.payment_sessions?.find(
    (session: any) => isCOD(session.provider_id)
  )
  
  // Use active session or COD session if available
  const effectiveSession = activeSession || codSession || cart?.payment_collection?.payment_sessions?.[0]

  // Debug the payment sessions
  console.log("Review component - Active payment session:", activeSession)
  console.log("Review component - COD session:", codSession)
  console.log("Review component - Effective session:", effectiveSession)
  console.log("Review component - All payment sessions:", cart?.payment_collection?.payment_sessions)

  // Get payment provider details for display
  const paymentProviderId = effectiveSession?.provider_id
  const paymentMethod = paymentInfoMap[paymentProviderId]?.title || 
    (paymentProviderId ? `${paymentProviderId.split('_').pop()}` : "Unknown")

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          {paymentProviderId && (
            <div className="flex items-start gap-x-1 w-full mb-4">
              <div className="w-full">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment Method: {paymentMethod}
                </Text>
              </div>
            </div>
          )}
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                By clicking the button below, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read Damned Designs&apos;s Privacy Policy.
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
