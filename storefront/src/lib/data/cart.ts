"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("carts")),
  }

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields:
          "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ cart }) => cart)
    .catch(() => null)
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart()

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id },
      {},
      headers
    )
    cart = cartResp.cart

    await setCartId(cart.id)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)

      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    return { 
      success: false, 
      error: "Missing variant ID when adding to cart" 
    }
  }

  try {
    const cart = await getOrSetCart(countryCode)

    if (!cart) {
      return { 
        success: false, 
        error: "Failed to retrieve or create cart" 
      }
    }

    const headers = {
      ...(await getAuthHeaders()),
    }

    // Use createLineItems instead to avoid gift card schema issue
    await sdk.client.fetch(
      `/store/carts/${cart.id}/line-items`,
      {
        method: "POST",
        headers,
        body: {
          variant_id: variantId,
          quantity
        }
      }
    )
      .then(async () => {
        // Revalidate cache tags to ensure UI shows updated cart
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)

        const fulfillmentCacheTag = await getCacheTag("fulfillment")
        revalidateTag(fulfillmentCacheTag)
      })
      .catch((err) => {
        console.error("Error adding item to cart:", err)
        throw err // Re-throw to be caught by the outer try/catch
      })
      
    return { 
      success: true,
      cartId: cart.id 
    }
  } catch (error) {
    console.error("AddToCart function error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error adding to cart" 
    }
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    })
    .catch(medusaError)
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    // Validate inputs
    if (!cart || !cart.id) {
      console.error("Invalid cart provided to initiatePaymentSession")
      return cart
    }

    if (!data || !data.provider_id) {
      console.error("Invalid provider_id in initiatePaymentSession")
      return cart
    }

    const cartId = cart.id
    const paymentCollectionId = cart.payment_collection?.id

    if (!paymentCollectionId) {
      console.error("No payment collection found on cart")
      return cart
    }

    // Use try/catch for the fetch operation
    try {
      // Step 1: Create a payment session
      await sdk.client.fetch(
        `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
        {
          method: "POST",
          headers,
          body: {
            provider_id: data.provider_id
          }
        }
      )
      
      // Step 2: Set it as the selected session
      // First try the Medusa 2.7+ endpoint format
      try {
        await sdk.client.fetch(
          `/store/payment-collections/${paymentCollectionId}/sessions/${data.provider_id}/authorize`,
          {
            method: "POST",
            headers
          }
        )
      } catch (authorizeError) {
        // If that fails, try the legacy format
        console.error("Error using new authorize endpoint, trying legacy format:", authorizeError)
        try {
          await sdk.client.fetch(
            `/store/payment-collections/${paymentCollectionId}`,
            {
              method: "POST",
              headers,
              body: {
                session_id: data.provider_id
              }
            }
          )
        } catch (legacyError) {
          console.error("Error using legacy selection endpoint:", legacyError)
          throw legacyError
        }
      }
      
      console.log(`Payment session for ${data.provider_id} created and selected`)
    } catch (fetchError) {
      // Log the error but don't throw - we'll still try to retrieve the updated cart
      console.error("Payment session initialization or selection error:", fetchError)
    }
    
    // Always refresh cache
    try {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
    } catch (cacheError) {
      console.error("Error refreshing cache:", cacheError)
    }
    
    // Return updated cart (fetch it again to be safe)
    try {
      return await retrieveCart(cartId)
    } catch (retrieveError) {
      console.error("Error retrieving updated cart:", retrieveError)
      return cart // Return original cart as fallback
    }
  } catch (error) {
    console.error("Fatal error in payment session flow:", error)
    // Return the original cart instead of throwing an error
    // This prevents the Server Component render error
    return cart
  }
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

// Gift card functionality completely removed

export async function applyGiftCard(code: string) {
  console.log("Gift card functionality disabled")
  return { success: false, error: "Gift cards are not supported" }
}

export async function removeDiscount(code: string) {
  console.log("Discount removal functionality disabled")
  return { success: false, error: "This functionality is not supported" }
}

export async function removeGiftCard(codeToRemove: string, giftCards: any[]) {
  console.log("Gift card functionality disabled")
  return { success: false, error: "Gift cards are not supported" }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) throw new Error("No form data found when setting addresses");

    const cartId = await getCartId();
    if (!cartId) throw new Error("No existing cart found when setting addresses");

    const data = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name"),
        last_name: formData.get("shipping_address.last_name"),
        address_1: formData.get("shipping_address.address_1"),
        address_2: "",
        company: formData.get("shipping_address.company"),
        postal_code: formData.get("shipping_address.postal_code"),
        city: formData.get("shipping_address.city"),
        country_code: formData.get("shipping_address.country_code"),
        province: formData.get("shipping_address.province"),
        phone: formData.get("shipping_address.phone"),
      },
      email: formData.get("email"),
    } as any;

    const sameAsBilling = formData.get("same_as_billing");
    if (sameAsBilling === "on") {
      data.billing_address = data.shipping_address;
    } else {
      data.billing_address = {
        first_name: formData.get("billing_address.first_name"),
        last_name: formData.get("billing_address.last_name"),
        address_1: formData.get("billing_address.address_1"),
        address_2: "",
        company: formData.get("billing_address.company"),
        postal_code: formData.get("billing_address.postal_code"),
        city: formData.get("billing_address.city"),
        country_code: formData.get("billing_address.country_code"),
        province: formData.get("billing_address.province"),
        phone: formData.get("billing_address.phone"),
      };
    }

    await updateCart(data);

    // Revalidate cart cache to ensure UI updates
    const cartCacheTag = await getCacheTag("carts");
    revalidateTag(cartCacheTag);

    // ✅ Tell the client it succeeded
    return { success: true, message: "Addresses set", step: "delivery" };
  } catch (e: any) {
    console.error("Error setting addresses:", e);
    return { success: false, message: e.message };
  }
}


/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartRes = await sdk.store.cart
    .complete(id, {}, headers)
    .then(async (cartRes) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)
      return cartRes
    })
    .catch(medusaError)

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase()

    const orderCacheTag = await getCacheTag("orders")
    revalidateTag(orderCacheTag)

    removeCartId()
    redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`)
  }

  return cartRes.cart
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
    cache: "force-cache",
  })
}
