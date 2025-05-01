"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import NmiPaymentForm from "@modules/checkout/components/payment-methods/nmi/nmi-payment-form"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

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
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  // const searchParams = useSearchParams()
  // const router = useRouter()
  // const pathname = usePathname()

  const isOpen =checkoutStep === "payment"

  const isStripe = isStripeFunc(selectedPaymentMethod)

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    console.log("Payment method selected:", method);
    
    // Always initiate payment session for any payment method
    try {
      console.log("Initiating payment session for:", method);
      const response = await initiatePaymentSession(cart, {
        provider_id: method,
      });
      console.log("Payment session initiated response:", response);
    } catch (err) {
      console.error("Error initiating payment session:", err);
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard



  const handleEdit = () => {
    // router.push(pathname + "?" + createQueryString("step", "payment"), {
    //   scroll: false,
    // })
    setCheckoutStep("payment")
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        // return router.push(
        //   pathname + "?" + createQueryString("step", "review"),
        //   {
        //     scroll: false,
        //   }
        // )
        setCheckoutStep("review")

      }
    } catch (err: any) {
      setError(err.message)
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
          {!paidByGiftcard ? (
            <>
              <div className="mb-4">
                <Text className="mb-2">Choose a payment method:</Text>
              </div>
              
              {/* Simple radio group with just two options */}
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={setPaymentMethod}
              >
                {/* Define two specific payment methods we want to show */}
                <div className="space-y-3">
                  {/* Manual Payment Option */}
                  <RadioGroup.Option
                    value="pp_system_default"
                    className={({ checked }) => 
                      `flex flex-col gap-y-2 cursor-pointer py-4 border rounded-md px-8 
                      ${checked ? 'border-ui-border-interactive bg-ui-bg-highlight' : 'border-ui-border-base hover:shadow-borders-interactive'}`
                    }
                  >
                    {({ checked }) => (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-4">
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${checked ? 'border-ui-border-interactive' : 'border-ui-border-base'}`}>
                            {checked && <div className="h-3 w-3 rounded-full bg-ui-bg-interactive" />}
                          </div>
                          <Text className="text-base-regular">Manual Payment</Text>
                        </div>
                        <span className="justify-self-end text-ui-fg-base">
                          <CreditCard />
                        </span>
                      </div>
                    )}
                  </RadioGroup.Option>
                  
                  {/* NMI Payment Option */}
                  <RadioGroup.Option
                    value="pp_nmi_nmi"
                    className={({ checked }) => 
                      `flex flex-col gap-y-2 cursor-pointer py-4 border rounded-md px-8
                      ${checked ? 'border-ui-border-interactive bg-ui-bg-highlight' : 'border-ui-border-base hover:shadow-borders-interactive'}`
                    }
                  >
                    {({ checked }) => (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-x-4">
                            <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${checked ? 'border-ui-border-interactive' : 'border-ui-border-base'}`}>
                              {checked && <div className="h-3 w-3 rounded-full bg-ui-bg-interactive" />}
                            </div>
                            <Text className="text-base-regular">Credit Card (NMI)</Text>
                          </div>
                          <span className="justify-self-end text-ui-fg-base">
                            <CreditCard />
                          </span>
                        </div>
                        
                        {/* Show NMI form when selected */}
                        {checked && cart && (
                          <div className="mt-4 pt-4 border-t border-ui-border-base">
                            <NmiPaymentForm cart={cart} data-testid="nmi-payment-form" />
                          </div>
                        )}
                      </>
                    )}
                  </RadioGroup.Option>
                </div>
              </RadioGroup>
            </>
          ) : (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
            data-testid="submit-payment-button"
          >
            {!activeSession && isStripeFunc(selectedPaymentMethod)
              ? " Enter card details"
              : "Continue to review"}
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
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
