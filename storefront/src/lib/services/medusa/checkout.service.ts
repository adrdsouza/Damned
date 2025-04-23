import { createMedusaClient } from '$lib/config/medusa';
import { browser } from '$app/environment';
import toast from 'svelte-french-toast';

const medusaClient = createMedusaClient();

export async function createCheckout(
  email: string,
  firstName: string,
  lastName: string,
  address: string,
  city: string,
  state: string,
  postalCode: string,
  country: string,
  phone?: string
) {
  try {
    if (!browser) return null;
    const cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) throw new Error('No cart ID found');
    
    // First, add customer info to cart
    await medusaClient.carts.update(cartId, {
      email,
    });
    
    // Then add shipping address
    const { cart: updatedCart } = await medusaClient.carts.update(cartId, {
      shipping_address: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city,
        province: state,
        postal_code: postalCode,
        country_code: country,
        phone: phone || null
      },
      billing_address: {
        first_name: firstName,
        last_name: lastName,
        address_1: address,
        city,
        province: state,
        postal_code: postalCode,
        country_code: country,
        phone: phone || null
      }
    });
    
    // Get available shipping options
    const { shipping_options } = await medusaClient.shippingOptions.list({
      cart_id: cartId
    });
    
    // Add shipping method if available
    if (shipping_options && shipping_options.length > 0) {
      await medusaClient.carts.addShippingMethod(cartId, {
        option_id: shipping_options[0].id
      });
    }
    
    return updatedCart;
  } catch (error) {
    console.error('Error creating checkout:', error);
    toast.error('Error creating checkout. Please try again.');
    return null;
  }
}

export async function completeCheckout(
  paymentMethod: string,
  cardNumber?: string, 
  cardExpiry?: string,
  cardCvc?: string
) {
  try {
    if (!browser) return null;
    const cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) throw new Error('No cart ID found');
    
    // Check if payment providers are added to cart
    const { cart } = await medusaClient.carts.retrieve(cartId);
    
    if (!cart.payment_session) {
      // Add a payment session
      await medusaClient.carts.createPaymentSessions(cartId);
      
      // Update cart to select payment method
      await medusaClient.carts.setPaymentSession(cartId, {
        provider_id: paymentMethod === 'credit' ? 'stripe' : 'manual'
      });
    }
    
    // Complete the cart
    const { type, data } = await medusaClient.carts.complete(cartId);
    
    if (type === 'order') {
      // Clear the cart ID from storage since it's now an order
      localStorage.removeItem('medusa_cart_id');
      return { success: true, order: data };
    } else {
      // Something went wrong
      toast.error('Error processing your order. Please try again.');
      return { success: false, error: 'Checkout failed' };
    }
  } catch (error) {
    console.error('Error completing checkout:', error);
    toast.error('Error processing your order. Please try again.');
    return { success: false, error: 'Checkout failed' };
  }
}