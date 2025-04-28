"use client"

import { initiatePaymentSession, placeOrder, setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { useRef, useState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import SignInPrompt from "@modules/cart/components/sign-in-prompt"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { Loader } from "@medusajs/icons"
import { Button, clx } from "@medusajs/ui"
import { useEffect } from "react" 
import { RadioGroup, Radio } from "@headlessui/react"
import MedusaRadio from "@modules/common/components/radio"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"

function formatAddress(address) {
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
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  
  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const isStripe = isStripeFunc(selectedPaymentMethod)
  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
  const paymentReady = (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

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

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

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
  }, [availableShippingMethods])

  const handleEdit = () => {
    setCheckoutStep("address")
  }

  // Step 1: Handle address submission
  const handleAddressSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const formData = new FormData(formRef.current)
      
      // Set addresses in the backend
      const result = await setAddresses(null, formData)
      console.log(result,"ashdfasdfasdfasd");
      
      if (!result.success) {
        setError(result.message || "Failed to save addresses")
        return
      }
      
      // If shipping method is already selected, move to payment step
      if (cart?.shipping_methods?.length > 0) {
        setCheckoutStep("payment")
      } else {
        // Otherwise, stay on the same page to select shipping
        setError("Please select a shipping method")
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Handle shipping method selection
  const handleSetShippingMethod = async (id: string, variant: "shipping" | "pickup") => {
    setError(null)
    if (formRef.current) {
      const isValid = formRef.current.checkValidity();
      
      if (!isValid) {
        // Trigger the browser's built-in validation UI
        const tempSubmitButton = document.createElement('button');
        tempSubmitButton.type = 'submit';
        formRef.current.appendChild(tempSubmitButton);
        tempSubmitButton.click();
        tempSubmitButton.remove();
        
        setFormError("Please fill in all required fields");
        return;
      }
    }
    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    try {
      const formData = new FormData(formRef?.current)
      // Set addresses in the backend
      const result = await setAddresses(null, formData)
      await setShippingMethod({ cartId: cart?.id, shippingMethodId: id })
      
    } catch (err) {
      setShippingMethodId(currentId)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 3: Handle payment method selection
  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    
    if (isStripeFunc(method)) {
      try {
        await initiatePaymentSession(cart, {
          provider_id: method,
        })
      } catch (err) {
        setError(err.message)
      }
    }
  }

  // Step 4: Handle payment submission
  const handleSubmitPayment = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const shouldInputCard = isStripeFunc(selectedPaymentMethod) && !activeSession
      const checkActiveSession = activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (shouldInputCard) {
        setError("Please enter card details")
        setIsLoading(false)
        return false
      }
      
      return true
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
      return false
    }
  }

  // Step 5: Place order
  const handlePlaceOrder = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      
      console.log("done","ashdfasdfasdfasd");

      // First confirm payment is ready
      const paymentReady = await handleSubmitPayment()
      
      if (!paymentReady) {
        return
      }
    
      // Then place the order
      await placeOrder()
      
      // Order success - redirect or show confirmation would happen here
      // This would typically be handled by the Medusa backend redirecting
    } catch (err) {
      setError(err.message || "Failed to place order")
    } finally {
      setIsLoading(false)
    }
  }

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
              <div className="grid mt-6">
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
                          const id = _pickupMethods.find(
                            (option) => !option?.insufficient_inventory
                          )?.id

                          if (id) {
                            handleSetShippingMethod(id, "pickup")
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
                      onChange={(v) => handleSetShippingMethod(v, "shipping")}
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
                                convertToLocale({
                                  amount: option.amount!,
                                  currency_code: cart?.currency_code,
                                })
                              ) : calculatedPricesMap[option.id] ? (
                                convertToLocale({
                                  amount: calculatedPricesMap[option.id],
                                  currency_code: cart?.currency_code,
                                })
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
                        onChange={(v) => handleSetShippingMethod(v, "pickup")}
                      >
                        {_pickupMethods?.map((option) => {
                          return (
                            <Radio
                              key={option.id}
                              value={option.id}
                              disabled={option?.insufficient_inventory}
                              data-testid="delivery-option-radio"
                              className={clx(
                                "flex items-center justify-between text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active",
                                {
                                  "border-ui-border-interactive":
                                    option.id === shippingMethodId,
                                  "hover:shadow-brders-none cursor-not-allowed":
                                    option?.insufficient_inventory,
                                }
                              )}
                            >
                              <div className="flex items-start gap-x-4">
                                <MedusaRadio
                                  checked={option.id === shippingMethodId}
                                />
                                <div className="flex flex-col">
                                  <span className="text-base-regular">
                                    {option.name}
                                  </span>
                                  <span className="text-base-regular text-ui-fg-muted">
                                    {formatAddress(
                                      option?.service_zone?.fulfillment_set?.location
                                        ?.address
                                    )}
                                  </span>
                                </div>
                              </div>
                              <span className="justify-self-end text-ui-fg-base">
                                {convertToLocale({
                                  amount: option.amount!,
                                  currency_code: cart?.currency_code,
                                })}
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
              <div className="mt-6">
                <div className="flex flex-col mb-4">
                  <span className="font-medium txt-medium text-ui-fg-base">
                    Payment Option
                  </span>
                </div>
                
                {!paidByGiftcard && availablePaymentMethods?.length > 0 && (
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onChange={(value: string) => setPaymentMethod(value)}
                  >
                    {availablePaymentMethods.map((paymentMethod) => (
                      <div key={paymentMethod.id} className="mb-3">
                        {isStripeFunc(paymentMethod.id) ? (
                          <StripeCardContainer
                            paymentProviderId={paymentMethod.id}
                            selectedPaymentOptionId={selectedPaymentMethod}
                            paymentInfoMap={paymentInfoMap}
                            setCardBrand={setCardBrand}
                            setError={setError}
                            setCardComplete={setCardComplete}
                          />
                        ) : (
                          <PaymentContainer
                            paymentInfoMap={paymentInfoMap}
                            paymentProviderId={paymentMethod.id}
                            selectedPaymentOptionId={selectedPaymentMethod}
                          />
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {paidByGiftcard && (
                  <div className="flex flex-col w-1/3 mb-4">
                    <Text className="txt-medium text-ui-fg-subtle">
                      Gift card
                    </Text>
                  </div>
                )}
              </div>

              <ErrorMessage error={error} data-testid="checkout-error-message" />

              <Button
                size="large"
                className="mt-6 w-full"
                onClick={handlePlaceOrder}
             
                isLoading={isLoading}
                disabled={
                  !shippingMethodId || 
                  (isStripe && !cardComplete) ||
                  (!selectedPaymentMethod && !paidByGiftcard)
                }
                data-testid="place-order-button"
              >
                Place Order
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex items-start gap-x-1 w-full">
                  <div
                    className="flex flex-col w-1/3"
                    data-testid="shipping-address-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Shipping Address
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3 "
                    data-testid="shipping-contact-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Contact
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.email}
                    </Text>
                  </div>

                  <div
                    className="flex flex-col w-1/3"
                    data-testid="billing-address-summary"
                  >
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Billing Address
                    </Text>

                    {sameAsBilling ? (
                      <Text className="txt-medium text-ui-fg-subtle">
                        Billing- and delivery address are the same.
                      </Text>
                    ) : (
                      <>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.first_name}{" "}
                          {cart.billing_address?.last_name}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.address_1}{" "}
                          {cart.billing_address?.address_2}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.postal_code},{" "}
                          {cart.billing_address?.city}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address?.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                  
                  {cart.shipping_methods?.length > 0 && (
                    <div className="flex flex-col w-1/3">
                      <Text className="txt-medium-plus text-ui-fg-base mb-1">
                        Shipping Method
                      </Text>
                      <Text className="txt-medium text-ui-fg-subtle">
                        {cart.shipping_methods[0].shipping_option?.name}
                      </Text>
                      <Text className="txt-medium text-ui-fg-subtle">
                        {convertToLocale({
                          amount: cart.shipping_methods[0].price,
                          currency_code: cart?.currency_code,
                        })}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
            
            {/* Payment method summary (when not in edit mode) */}
            {cart && paymentReady && activeSession && (
              <div className="flex items-start gap-x-1 w-full mt-6">
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
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses