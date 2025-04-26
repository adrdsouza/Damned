"use client"

import { RadioGroup } from "@headlessui/react"
import { paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
  checkoutStep,
  setCheckoutStep
}: {
  cart: any
  availablePaymentMethods: any[]
  checkoutStep:string
  setCheckoutStep:any
}) => {
  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const isOpen = checkoutStep === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    
    if (!method) {
      console.log("No payment method selected")
      return
    }
    
    // Initialize payment session for any provider
    try {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    } catch (err) {
      console.error("Error initializing payment session:", err)
      // Don't show error to user at selection time, only at submission time
    }
  }

  // Disable gift card functionality
  const paidByGiftcard = false

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams)
  //     params.set(name, value)

  //     return params.toString()
  //   },
  //   [searchParams]
  // )

  const handleEdit = () => {
    // router.push(pathname + "?" + createQueryString("step", "payment"), {
    //   scroll: false,
    // });
    setCheckoutStep("payment")
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Log current state for debugging
      console.log("Current Payment Method:", selectedPaymentMethod)
      console.log("Active Session:", activeSession)
      
      // Make sure we have a selected payment method
      if (!selectedPaymentMethod) {
        setError("Please select a payment method before continuing")
        setIsLoading(false)
        return
      }
      
      // Always make a fresh call to initiate the payment session
      // This ensures it's properly created AND selected as the active session
      try {
        console.log("Initiating and selecting payment session for:", selectedPaymentMethod)
        const updatedCart = await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
        
        if (updatedCart) {
          console.log("Updated cart after payment session init:", updatedCart)
          
          // Verify the session is now active/pending
          const newActiveSession = updatedCart?.payment_collection?.payment_sessions?.find(
            (s: any) => s.status === "pending" && s.provider_id === selectedPaymentMethod
          )
          
          console.log("New active session after setup:", newActiveSession)
          
          if (!newActiveSession) {
            console.warn("Session created but may not be active - continuing anyway")
          }
        } else {
          console.error("Failed to get updated cart after session setup")
        }
      } catch (initErr) {
        console.error("Payment session init/selection error:", initErr)
        // Continue even if this fails, as we'll let the user try to complete anyway
      }

      // Move to review step
      console.log("Moving to review step")
      setCheckoutStep("review")
      
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err?.message || "An error occurred while processing payment")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])


  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    <PaymentContainer
                      paymentInfoMap={paymentInfoMap}
                      paymentProviderId={paymentMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                    />
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {/* Gift card functionality disabled */}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={!selectedPaymentMethod && !paidByGiftcard}
            data-testid="submit-payment-button"
          >
            Continue to review
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    Another step will appear
                  </Text>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
