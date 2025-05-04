"use client"

import { initiatePaymentSession, placeOrder, setAddresses, updateShippingCounty } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { useRef, useState, useEffect } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import SignInPrompt from "@modules/cart/components/sign-in-prompt"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption, listCartShippingMethods } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { Loader } from "@medusajs/icons"
import { Button, clx } from "@medusajs/ui"
import { RadioGroup, Radio } from "@headlessui/react"
import MedusaRadio from "@modules/common/components/radio"
import PaymentContainer from "@modules/checkout/components/payment-container"
import { paymentInfoMap } from "@lib/constants"
import { sdk } from "@lib/config"
import { revalidateTag } from "next/cache"
import { getCacheTag } from "@lib/data/cookies"
import { collectValidFormData } from "@lib/util/formValidData"

function formatAddress(address: any) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

const Addresses = ({
  cart,
  customer,
  checkoutStep,
  setCheckoutStep,
  availableShippingMethods,
  availablePaymentMethods
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  checkoutStep: string,
  setCheckoutStep: any
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
  availablePaymentMethods: any[]
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isOpen = checkoutStep === "address"
  const formRef = useRef<HTMLFormElement>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  // Shipping methods state
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [showPickupOptions, setShowPickupOptions] = useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, number>>({})
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart?.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  // Payment state
  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  // Assuming paid by giftcard is when total is 0, as gift_cards property might not be directly on cart
  const paidByGiftcard = cart?.total === 0
  const paymentReady = (activeSession && cart?.shipping_methods && cart.shipping_methods.length !== 0) || paidByGiftcard

  // Filter shipping methods
  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    // Calculate shipping prices
    setIsLoadingPrices(true)

    if (_shippingMethods?.length && cart?.id) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[(p as PromiseFulfilledResult<any>).value?.id || ""] = (p as PromiseFulfilledResult<any>).value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    } else {
      setIsLoadingPrices(false)
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods, cart?.id, _shippingMethods, _pickupMethods, shippingMethodId])

  const handleEdit = () => {
    setCheckoutStep("address")
  }

  const handleReginChange = async (region: string,formData:any) => {
    try {
      setIsLoading(true);
      setError("");  // Clear previous errors
      const validData = collectValidFormData(formRef);
      console.log(validData,"hgasdkfasdfasdfasdfad");
  
      if (!cart?.id) {
        throw new Error("Cart ID is missing.");
      }

     let res1= await updateShippingCounty({
        cartId: cart.id,
        data:validData
      });
      
  
      // Step 2: Get available shipping methods
      const shippingMethods = await listCartShippingMethods(cart.id);

      // Step 3: Verify shipping methods are available
      if (!shippingMethods || shippingMethods.length === 0) {
        throw new Error("Shipping options not available for this region");
      }
    let findFreeShipping = shippingMethods?.find((method) => method.amount == 0);

   if(cart?.item_total !== undefined && cart.item_total >=100 && findFreeShipping){
    
       const shippingMethodId = findFreeShipping.id;
       const result = await setShippingMethod({ 
         cartId: cart.id, 
         shippingMethodId 
       });
       return result;

   }else{
 // Step 4: Set default shipping method (first option)
 let paidShipping = shippingMethods?.filter((method) => method.amount > 0);
 
 const result = await setShippingMethod({ 
   cartId: cart.id, 
   shippingMethodId :paidShipping[0]?.id
 });
 console.log({shippingMethods,cart,findFreeShipping},"hgasdkfasdfasdfsdasdasdfad");
 return result;
   }
       
       // Optional: you could return the result here if needed
      
       
     } catch (error: any) {
       // Proper error handling
       const errorMessage = error instanceof Error ? error.message : "Failed to update region";
       setError(errorMessage);
       console.error("Region change error:", error);
     } finally {
       setIsLoading(false);
     }
   };
  
  // Step 1: Handle address submission
  const handleAddressSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      if (!formRef.current) {
        throw new Error("Form reference is missing.");
      }
      const formData = new FormData(formRef.current)
      
      // Set addresses in the backend
      const result = await setAddresses(null, formData)
      
      if (!result.success) {
        setError(result.message || "Failed to save addresses")
        setIsLoading(false) // Ensure loading is set to false on error
        return
      }
      
      // If shipping method is already selected, proceed to payment and place order
      if (cart?.shipping_methods && cart.shipping_methods.length > 0) {
        // Step 4: Handle payment submission
        const paymentReady = await handleSubmitPayment()
        
        if (!paymentReady) {
          setIsLoading(false) // Ensure loading is set to false if payment not ready
          return
        }
      
        // Step 5: Place order
        await placeOrder()
        
        // Order success - redirect or show confirmation would happen here
        // This would typically be handled by the Medusa backend redirecting
      } else {
        // Otherwise, stay on the same page to select shipping
        setError("Please select a shipping method")
        setIsLoading(false) // Ensure loading is set to false if shipping not selected
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      setIsLoading(false) // Ensure loading is set to false on error
    }
  }


  // Step 3: Handle payment method selection
  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    try {
      if (!cart) {
        throw new Error("Cart is missing.");
      }
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Step 4: Handle payment submission (simplified)
  const handleSubmitPayment = async () => {
    try {
      if (!cart) {
        throw new Error("Cart is missing.");
      }
      const activeSession = cart.payment_collection?.payment_sessions?.find(
        (paymentSession: any) => paymentSession.status === "pending"
      )
      const checkActiveSession = activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }
      
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  // handlePlaceOrder function is no longer needed as its logic is moved to handleAddressSubmit

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="w-full">
          {!customer && (
            <>
              <SignInPrompt />
              <Divider />
            </>
          )}
        </div>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      
      {isOpen ? (
        <>
          <form ref={formRef} onSubmit={handleAddressSubmit}>
            <div className="pb-2">
              <ShippingAddress
                customer={customer}
                checked={sameAsBilling}
                onChange={toggleSameAsBilling}
                cart={cart}
                handleReginChange={handleReginChange}
              />

              {!sameAsBilling && (
                <div>
                  <Heading
                    level="h2"
                    className="text-3xl-regular gap-x-4 pb-6 pt-8"
                  >
                    Billing address
                  </Heading>

                  <BillingAddress cart={cart} />
                </div>
              )}
                            <ErrorMessage error={formError} data-testid="shipping-error-message" />

              {/* Shipping Method Selection */}
               {/* <div className="grid mt-6">
                <div className="flex flex-col">
                  <span className="font-medium txt-medium text-ui-fg-base">
                    Shipping method
                  </span>
                  <span className="mb-4 text-ui-fg-muted txt-medium">
                    How would you like your order delivered
                  </span>
                </div>
                <div data-testid="delivery-options-container">
                  <div className="pb-3 md:pt-0 pt-2">
                    {hasPickupOptions && (
                      <RadioGroup
                        value={showPickupOptions}
                        onChange={(value) => {
                          const id = _pickupMethods?.find(
                            (option) => !option?.insufficient_inventory
                          )?.id

                          if (id) {
                            // Assuming handleSetShippingMethod exists and is relevant
                            // handleSetShippingMethod(id, "pickup")
                          }
                        }}
                      >
                        <Radio
                          value={PICKUP_OPTION_ON}
                          data-testid="delivery-option-radio"
                          className={clx(
                            "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                            {
                              "border-ui-border-interactive":
                                showPickupOptions === PICKUP_OPTION_ON,
                            }
                          )}
                        >
                          <div className="flex items-center gap-x-4">
                            <MedusaRadio
                              checked={showPickupOptions === PICKUP_OPTION_ON}
                            />
                            <span className="text-base-regular">
                              Pick up your order
                            </span>
                          </div>
                          <span className="justify-self-end text-ui-fg-base">
                            -
                          </span>
                        </Radio>
                      </RadioGroup>
                    )}
                    <RadioGroup
                      value={shippingMethodId}
                      onChange={(v) => {
                        // Assuming handleSetShippingMethod exists and is relevant
                        // handleSetShippingMethod(v, "shipping")
                      }}
                    >
                      {_shippingMethods?.map((option) => {
                        const isDisabled =
                          option.price_type === "calculated" &&
                          !isLoadingPrices &&
                          typeof calculatedPricesMap[option.id] !== "number"

                        return (
                          <Radio
                            key={option.id}
                            value={option.id}
                            data-testid="delivery-option-radio"
                            disabled={isDisabled}
                            className={clx(
                              "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                              {
                                "border-ui-border-interactive":
                                  option.id === shippingMethodId,
                                "hover:shadow-brders-none cursor-not-allowed":
                                  isDisabled,
                              }
                            )}
                          >
                            <div className="flex items-center gap-x-4">
                              <MedusaRadio
                                checked={option.id === shippingMethodId}
                              />
                              <span className="text-base-regular">
                                {option.name}
                              </span>
                            </div>
                            <span className="justify-self-end text-ui-fg-base">
                              {option.price_type === "flat" ? (
                                cart?.currency_code ? (
                                  convertToLocale({
                                    amount: option.amount!,
                                    currency_code: cart.currency_code,
                                  })
                                ) : (
                                  "-"
                                )
                              ) : calculatedPricesMap[option.id] ? (
                                cart?.currency_code ? (
                                  convertToLocale({
                                    amount: calculatedPricesMap[option.id],
                                    currency_code: cart.currency_code,
                                  })
                                ) : (
                                  "-"
                                )
                              ) : isLoadingPrices ? (
                                <Loader />
                              ) : (
                                "-"
                              )}
                            </span>
                          </Radio>
                        )
                      })}
                    </RadioGroup>
                  </div>
                </div>
              </div>
*/}

              {showPickupOptions === PICKUP_OPTION_ON && (
                <div className="grid mt-4">
                  <div className="flex flex-col">
                    <span className="font-medium txt-medium text-ui-fg-base">
                      Store
                    </span>
                    <span className="mb-4 text-ui-fg-muted txt-medium">
                      Choose a store near you
                    </span>
                  </div>
                  <div data-testid="delivery-options-container">
                    <div className="pb-8 md:pt-0 pt-2">
                      <RadioGroup
                        value={shippingMethodId}
                        onChange={(v) => {
                           // Assuming handleSetShippingMethod exists and is relevant
                           // handleSetShippingMethod(v, "pickup")
                        }}
                      >
                        {_pickupMethods?.map((option) => {
                           const isDisabled =
                           option.price_type === "calculated" &&
                           !isLoadingPrices &&
                           typeof calculatedPricesMap[option.id] !== "number"

                         return (
                           <Radio
                             key={option.id}
                             value={option.id}
                             data-testid="delivery-option-radio"
                             disabled={isDisabled}
                             className={clx(
                               "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                               {
                                 "border-ui-border-interactive":
                                   option.id === shippingMethodId,
                                 "hover:shadow-brders-none cursor-not-allowed":
                                   isDisabled,
                               }
                             )}
                           >
                             <div className="flex items-center gap-x-4">
                               <MedusaRadio
                                 checked={option.id === shippingMethodId}
                               />
                               <span className="text-base-regular">
                                 {option.name}
                               </span>
                             </div>
                             <span className="justify-self-end text-ui-fg-base">
                               {option.price_type === "flat" ? (
                                 cart?.currency_code ? (
                                   convertToLocale({
                                     amount: option.amount!,
                                     currency_code: cart.currency_code,
                                   })
                                 ) : (
                                   "-"
                                 )
                               ) : calculatedPricesMap[option.id] ? (
                                 cart?.currency_code ? (
                                   convertToLocale({
                                     amount: calculatedPricesMap[option.id],
                                     currency_code: cart.currency_code,
                                   })
                                 ) : (
                                   "-"
                                 )
                               ) : isLoadingPrices ? (
                                 <Loader />
                               ) : (
                                 "-"
                               )}
                             </span>
                           </Radio>
                         )
                        })}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method Selection */}
              {!paidByGiftcard && availablePaymentMethods?.length > 0 && (
                <div className="grid mt-6">
                  <div className="flex flex-col">
                    <span className="font-medium txt-medium text-ui-fg-base">
                      Payment method
                    </span>
                    <span className="mb-4 text-ui-fg-muted txt-medium">
                      Enter your payment details
                    </span>
                  </div>
                  <div data-testid="payment-options-container">
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onChange={(v) => setPaymentMethod(v)}
                    >
                      {availablePaymentMethods.map((paymentMethod) => (
                        <PaymentContainer
                          key={paymentMethod.id}
                          paymentProviderId={paymentMethod.id}
                          selectedPaymentOptionId={selectedPaymentMethod}
                          paymentInfoMap={paymentInfoMap}
                        />
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {error && (
                <Container
                  className="bg-rose-50 border-rose-500 text-rose-900 text-small-regular uppercase px-4 py-2 mt-4"
                  data-testid="checkout-error-container"
                >
                  <p data-testid="checkout-error-message">{error}</p>
                </Container>
              )}

              <SubmitButton
                className="mt-6"
                data-testid="submit-order-button"
              >
                Place order
              </SubmitButton>
            </div>
          </form>
        </>
      ) : (
        <div>
          <div className="text-small-regular">
            <Text className="txt-medium text-ui-fg-subtle">
              Contact:
            </Text>
            <Text className="txt-medium">
              {cart?.email}
            </Text>
          </div>
          <div className="flex items-start gap-x-8 mt-4">
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium text-ui-fg-subtle">
                Shipping address:
              </Text>
              <Text className="txt-medium">
                {cart?.shipping_address ? (
                  formatAddress(cart.shipping_address)
                ) : (
                  "N/A"
                )}
              </Text>
            </div>
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium text-ui-fg-subtle">
                Billing address:
              </Text>
              <Text className="txt-medium">
                {sameAsBilling ? (
                  formatAddress(cart?.shipping_address)
                ) : cart?.billing_address ? (
                  formatAddress(cart.billing_address)
                ) : (
                  "N/A"
                )}
              </Text>
            </div>
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium text-ui-fg-subtle">
                Delivery method:
              </Text>
              <Text className="txt-medium">
                {cart?.shipping_methods?.at(-1)?.name || "N/A"}
              </Text>
            </div>
          </div>
          <div className="mt-4">
            <Text className="txt-medium text-ui-fg-subtle">
              Payment method:
            </Text>
            <div className="flex items-center gap-x-2 mt-2">
              <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                {paymentInfoMap[selectedPaymentMethod]?.icon || <CreditCard />}
              </Container>
              <Text>
                {paymentInfoMap[selectedPaymentMethod]?.title || selectedPaymentMethod}
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Addresses