import { createMedusaClient } from '$lib/config/medusa';
import { browser } from '$app/environment';
import { cart } from '$lib/stores/cartStore';
import { get } from 'svelte/store';
import type { Product, ProductVariation, CartItem } from '$lib/types';
import toast from 'svelte-french-toast';

// Create the client with better error handling
let medusaClient;
try {
  medusaClient = createMedusaClient();
} catch (error) {
  console.error('Error initializing Medusa client in cart service:', error);
  // Will create client on demand later
}

// Helper function to get client with lazy initialization
function getClient() {
  if (!medusaClient) {
    try {
      medusaClient = createMedusaClient();
    } catch (error) {
      console.error('Failed to create Medusa client on demand:', error);
      return null;
    }
  }
  return medusaClient;
}

// Exponential backoff implementation for retries
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const getBackoffTime = (attempt) => Math.min(1000 * Math.pow(2, attempt), 10000); // Cap at 10 seconds

// Get or create Medusa cart
async function getOrCreateCart() {
  if (!browser) return null;

  // Check if we're in offline mode
  const offlineMode = localStorage.getItem('medusa_offline_mode') === 'true';
  if (offlineMode) {
    console.log('Operating in offline mode, using local cart only');
    return null;
  }

  // Check if we already have a cart ID in local storage
  const cartId = localStorage.getItem('medusa_cart_id');
  
  if (cartId) {
    try {
      // Try to get the existing cart
      const client = getClient();
      if (!client) {
        throw new Error('Medusa client unavailable');
      }
      
      const { cart: existingCart } = await client.carts.retrieve(cartId);
      if (existingCart) {
        return existingCart;
      }
      // If cart exists but is null, clear the ID so we create a new one
      localStorage.removeItem('medusa_cart_id');
    } catch (error) {
      // Cart might not exist anymore or other error
      localStorage.removeItem('medusa_cart_id');
      console.error('Error retrieving cart:', error);
      
      // Check if this is a network error
      const isNetworkError = 
        error.message?.includes('Network Error') || 
        error.name === 'TypeError' || 
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('Medusa client unavailable') ||
        !error.response;
      
      if (isNetworkError) {
        console.log('Network error when retrieving cart, setting offline mode');
        localStorage.setItem('medusa_offline_mode', 'true');
        
        // Set a timeout to try again later
        setTimeout(() => {
          localStorage.removeItem('medusa_offline_mode');
        }, 5 * 60 * 1000); // 5 minutes
        
        return null;
      }
      // Continue to create a new cart for non-network errors
    }
  }
  
  // Create a new cart with improved exponential backoff retry logic
  let attempt = 0;
  const maxAttempts = 3;
  
  while (attempt < maxAttempts) {
    try {
      const client = getClient();
      if (!client) {
        throw new Error('Medusa client unavailable');
      }
      
      const { cart: newCart } = await client.carts.create({});
      
      // Make sure we actually got a cart back
      if (newCart?.id) {
        localStorage.setItem('medusa_cart_id', newCart.id);
        return newCart;
      } else {
        throw new Error('Received invalid cart from server');
      }
    } catch (error) {
      attempt++;
      console.warn(`Cart creation attempt ${attempt} failed:`, error);
      
      // Check for network error and set offline mode
      const isNetworkError = 
        error.message?.includes('Network Error') || 
        error.name === 'TypeError' || 
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('Medusa client unavailable') ||
        error.name === 'AbortError' ||
        !error.response;
      
      if (isNetworkError && attempt >= maxAttempts) {
        console.log('Network error when creating cart, setting offline mode');
        localStorage.setItem('medusa_offline_mode', 'true');
        
        // Set a timeout to try again later
        setTimeout(() => {
          localStorage.removeItem('medusa_offline_mode');
        }, 5 * 60 * 1000); // 5 minutes
        
        // Show a user-friendly message about connection issues
        if (browser) {
          toast.error('Unable to connect to store backend. Using local cart instead.', {
            duration: 5000
          });
        }
        
        return null;
      }
      
      // If we have retries left, wait using exponential backoff then try again
      if (attempt < maxAttempts) {
        const backoffTime = getBackoffTime(attempt);
        console.log(`Retrying in ${backoffTime}ms...`);
        await wait(backoffTime);
        continue;
      }
      
      // No more retries, log error and return null for local cart fallback
      console.warn('Error creating Medusa cart after maximum retries, falling back to local cart');
      
      return null;
    }
  }
  
  // If we somehow exit the loop without returning, return null for local cart fallback
  return null;
}

// Add item to cart
export async function addToMedusaCart(product: Product, quantity: number, variation?: ProductVariation) {
  try {
    const medusaCart = await getOrCreateCart();
    if (!medusaCart) {
      console.log('No Medusa cart available, using local cart');
      const { addToCart } = await import('$lib/stores/cartStore');
      addToCart(product, quantity, variation);
      return null;
    }
    
    const variantId = variation?.id || product.variations?.[0]?.id;
    
    if (!variantId) {
      throw new Error('No variant ID found for product');
    }
    
    const client = getClient();
    if (!client) {
      throw new Error('Medusa client unavailable');
    }
    
    const { cart: updatedCart } = await client.carts.lineItems.create(medusaCart.id, {
      variant_id: variantId,
      quantity: quantity
    });
    
    // Update local cart to keep UI in sync
    syncMedusaCartToLocalCart(updatedCart);
    
    return updatedCart;
  } catch (error) {
    console.error('Error adding item to Medusa cart:', error);
    // Fallback to local cart
    const { addToCart } = await import('$lib/stores/cartStore');
    addToCart(product, quantity, variation);
    return null;
  }
}

// Remove item from cart
export async function removeFromMedusaCart(lineItemId: string) {
  try {
    const cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) throw new Error('No cart ID found');
    
    const client = getClient();
    if (!client) {
      throw new Error('Medusa client unavailable');
    }
    
    const { cart: updatedCart } = await client.carts.lineItems.delete(cartId, lineItemId);
    
    // Update local cart to keep UI in sync
    syncMedusaCartToLocalCart(updatedCart);
    
    return updatedCart;
  } catch (error) {
    console.error('Error removing item from Medusa cart:', error);
    
    // If we can't connect to Medusa, fall back to the local cart
    const currentCart = get(cart);
    const itemToRemove = currentCart.find(item => item.medusa_line_item_id === lineItemId);
    
    if (itemToRemove) {
      const { removeFromCart } = await import('$lib/stores/cartStore');
      removeFromCart(itemToRemove.product.id, itemToRemove.variation?.id);
    }
    
    return null;
  }
}

// Update item quantity in cart
export async function updateMedusaCartItemQuantity(lineItemId: string, quantity: number) {
  try {
    const cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) throw new Error('No cart ID found');
    
    const client = getClient();
    if (!client) {
      throw new Error('Medusa client unavailable');
    }
    
    const { cart: updatedCart } = await client.carts.lineItems.update(cartId, lineItemId, {
      quantity
    });
    
    // Update local cart to keep UI in sync
    syncMedusaCartToLocalCart(updatedCart);
    
    return updatedCart;
  } catch (error) {
    console.error('Error updating item in Medusa cart:', error);
    
    // Try to update local cart as fallback
    const currentCart = get(cart);
    const itemToUpdate = currentCart.find(item => item.medusa_line_item_id === lineItemId);
    
    if (itemToUpdate) {
      const { updateCartItemQuantity } = await import('$lib/stores/cartStore');
      updateCartItemQuantity(itemToUpdate.product.id, quantity, itemToUpdate.variation?.id);
    }
    
    return null;
  }
}

// Clear cart
export async function clearMedusaCart() {
  try {
    // Check if offline mode
    const offlineMode = localStorage.getItem('medusa_offline_mode') === 'true';
    if (offlineMode) {
      console.log('Operating in offline mode, clearing local cart only');
      const { clearCart } = await import('$lib/stores/cartStore');
      clearCart();
      return null;
    }
    
    const client = getClient();
    if (!client) {
      throw new Error('Medusa client unavailable');
    }
    
    // Create a new cart rather than emptying the current one
    const { cart: newCart } = await client.carts.create({});
    if (newCart?.id) {
      localStorage.setItem('medusa_cart_id', newCart.id);
      
      // Update local cart
      cart.set([]);
      
      return newCart;
    }
    throw new Error('Failed to create a new cart');
  } catch (error) {
    console.error('Error clearing Medusa cart:', error);
    
    // Fallback to local cart
    const { clearCart } = await import('$lib/stores/cartStore');
    clearCart();
    
    return null;
  }
}

// Get cart totals
export async function getCartTotals() {
  try {
    // Check if offline mode
    const offlineMode = localStorage.getItem('medusa_offline_mode') === 'true';
    if (offlineMode) {
      console.log('Operating in offline mode, calculating local cart totals');
      return getLocalCartTotals();
    }
    
    const cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) return getLocalCartTotals();
    
    const client = getClient();
    if (!client) {
      return getLocalCartTotals();
    }
    
    const { cart: medusaCart } = await client.carts.retrieve(cartId);
    
    if (!medusaCart) {
      return getLocalCartTotals();
    }
    
    return {
      subtotal: (medusaCart.subtotal || 0) / 100,
      shipping: ((medusaCart.shipping_total || 0) + (medusaCart.tax_total || 0)) / 100,
      total: (medusaCart.total || 0) / 100
    };
  } catch (error) {
    console.error('Error getting cart totals:', error);
    
    // Fallback to local cart
    return getLocalCartTotals();
  }
}

// Helper function to calculate totals from local cart
function getLocalCartTotals() {
  const currentCart = get(cart);
  const subtotal = currentCart.reduce(
    (sum, item) => sum + ((item.variation?.price || item.product.price) * item.quantity), 
    0
  );
  
  const shipping = currentCart.length > 0 ? 10 : 0;
  
  return {
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}

// Apply discount code to cart
export async function applyDiscountCode(code: string) {
  try {
    // Check if offline mode
    const offlineMode = localStorage.getItem('medusa_offline_mode') === 'true';
    if (offlineMode) {
      console.log('Operating in offline mode, cannot apply discount code');
      toast.error('Discount codes unavailable in offline mode');
      return null;
    }
    
    const cartId = localStorage.getItem('medusa_cart_id');
    if (!cartId) throw new Error('No cart ID found');
    
    const client = getClient();
    if (!client) {
      throw new Error('Medusa client unavailable');
    }
    
    const { cart: updatedCart } = await client.carts.update(cartId, {
      discounts: [{ code }]
    });
    
    // Update local cart to keep UI in sync
    syncMedusaCartToLocalCart(updatedCart);
    
    toast.success('Discount code applied successfully');
    return updatedCart;
  } catch (error) {
    console.error('Error applying discount code:', error);
    
    // Check if this is a network error
    const isNetworkError = 
      error.message?.includes('Network Error') || 
      error.name === 'TypeError' || 
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('Medusa client unavailable') ||
      !error.response;
    
    if (isNetworkError) {
      toast.error('Unable to connect to store backend. Please try again later.');
    } else {
      toast.error('Invalid coupon code');
    }
    
    return null;
  }
}

// Initialize cart on page load
export async function initializeCart() {
  if (!browser) return;
  
  try {
    // Clear offline mode if it's been more than 5 minutes
    const offlineModeTimestamp = localStorage.getItem('medusa_offline_mode_timestamp');
    if (offlineModeTimestamp) {
      const timestamp = parseInt(offlineModeTimestamp, 10);
      const now = Date.now();
      if (now - timestamp > 5 * 60 * 1000) { // 5 minutes
        localStorage.removeItem('medusa_offline_mode');
        localStorage.removeItem('medusa_offline_mode_timestamp');
      }
    }
    
    // Check if we're in offline mode
    const offlineMode = localStorage.getItem('medusa_offline_mode') === 'true';
    if (offlineMode) {
      console.log('Operating in offline mode, using local cart only');
      // We'll just use the local cart from the store
      return;
    }
    
    const medusaCart = await getOrCreateCart();
    // Only sync if we successfully got a cart
    if (medusaCart) {
      syncMedusaCartToLocalCart(medusaCart);
    } else {
      // If medusaCart is null, we'll just use the local cart
      console.log('Using local cart as fallback');
    }
  } catch (error) {
    console.error('Error initializing cart:', error);
    // We'll continue with the local cart if medusa fails
  }
}

// Helper to sync Medusa cart to local store
function syncMedusaCartToLocalCart(medusaCart: any) {
  if (!medusaCart || !medusaCart.items || !browser) return;
  
  // This is a simplified mapping - you'd need to fetch full product details
  // for each line item to populate the local cart properly
  const cartItems: CartItem[] = medusaCart.items.map((item: any) => ({
    product: {
      id: item.variant.product.id,
      name: item.variant.product.title,
      slug: item.variant.product.handle,
      description: item.variant.product.description || '',
      price: item.unit_price / 100,
      image: item.thumbnail || `/images/products/${item.variant.product.handle}.jpg`,
      category: item.variant.product.collection?.title?.toLowerCase() || 'uncategorized'
    },
    quantity: item.quantity,
    variation: item.variant ? {
      id: item.variant.id,
      name: item.variant.title,
      price: item.unit_price / 100,
      inStock: true,
      attributes: {},
      image: item.thumbnail
    } : undefined,
    medusa_line_item_id: item.id
  }));
  
  cart.set(cartItems);
}