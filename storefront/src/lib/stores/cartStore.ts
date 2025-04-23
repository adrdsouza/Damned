import { writable, get } from 'svelte/store';
import type { Product, CartItem, ProductVariation } from '$lib/types';
import { browser } from '$app/environment';
import { 
  addToMedusaCart, 
  removeFromMedusaCart, 
  updateMedusaCartItemQuantity 
} from '$lib/services/medusa/cart.service';

// Initialize with a sample product for testing
const initialCart: CartItem[] = [
  {
    product: {
      id: 1,
      name: "Djinn XL Titanium",
      slug: "djinn-xl-titanium",
      description: "The Djinn XL is our flagship folding knife, featuring a premium titanium handle and a high-performance CPM-S35VN blade.",
      price: 249.99,
      salePrice: 199.99,
      image: "/images/products/djinn-xl.jpg",
      category: "knives"
    },
    quantity: 1,
    variation: {
      id: "djinn-xl-stonewash",
      name: "Stonewashed",
      price: 249.99,
      salePrice: 199.99,
      inStock: true,
      attributes: {
        finish: "Stonewashed",
        blade: "CPM-S35VN"
      },
      image: "/images/products/djinn-xl-stonewash.jpg"
    }
  }
];

export const cart = writable<CartItem[]>(initialCart);

export function addToCart(product: Product, quantity: number, variation?: ProductVariation) {
  if (browser) {
    // Try to add to Medusa cart first
    addToMedusaCart(product, quantity, variation)
      .catch(() => {
        // If Medusa fails, fall back to local cart
        fallbackAddToCart(product, quantity, variation);
      });
  } else {
    // When running on server (SSR), use local cart only
    fallbackAddToCart(product, quantity, variation);
  }
}

function fallbackAddToCart(product: Product, quantity: number, variation?: ProductVariation) {
  const cartItems = get(cart);
  const existingItemIndex = cartItems.findIndex(item => 
    item.product.id === product.id && 
    (!variation || !item.variation || item.variation.id === variation.id)
  );
  
  if (existingItemIndex !== -1) {
    // Update quantity if product already in cart
    const updatedItems = [...cartItems];
    updatedItems[existingItemIndex].quantity += quantity;
    cart.set(updatedItems);
  } else {
    // Add new item to cart
    cart.update(items => [...items, { product, quantity, variation }]);
  }
}

export function removeFromCart(productId: number | string, variationId?: string) {
  if (browser) {
    // Find the Medusa line item ID if it exists
    const cartItems = get(cart);
    const item = cartItems.find(item => 
      item.product.id === productId && 
      (!variationId || (item.variation && item.variation.id === variationId))
    );
    
    if (item && item.medusa_line_item_id) {
      // If we have the Medusa line item ID, use that
      removeFromMedusaCart(item.medusa_line_item_id)
        .catch(() => {
          // Fall back to local removal if Medusa fails
          fallbackRemoveFromCart(productId, variationId);
        });
    } else {
      // If no Medusa line item ID, just update local cart
      fallbackRemoveFromCart(productId, variationId);
    }
  } else {
    fallbackRemoveFromCart(productId, variationId);
  }
}

function fallbackRemoveFromCart(productId: number | string, variationId?: string) {
  cart.update(items => items.filter(item => 
    item.product.id !== productId || 
    (variationId && item.variation && item.variation.id !== variationId)
  ));
}

export function updateCartItemQuantity(productId: number | string, quantity: number, variationId?: string) {
  if (browser) {
    // Find the Medusa line item ID if it exists
    const cartItems = get(cart);
    const item = cartItems.find(item => 
      item.product.id === productId && 
      (!variationId || (item.variation && item.variation.id === variationId))
    );
    
    if (item && item.medusa_line_item_id) {
      // If we have the Medusa line item ID, use that
      updateMedusaCartItemQuantity(item.medusa_line_item_id, quantity)
        .catch(() => {
          // Fall back to local update if Medusa fails
          fallbackUpdateCartItemQuantity(productId, quantity, variationId);
        });
    } else {
      // If no Medusa line item ID, just update local cart
      fallbackUpdateCartItemQuantity(productId, quantity, variationId);
    }
  } else {
    fallbackUpdateCartItemQuantity(productId, quantity, variationId);
  }
}

function fallbackUpdateCartItemQuantity(productId: number | string, quantity: number, variationId?: string) {
  cart.update(items => 
    items.map(item => 
      (item.product.id === productId && (!variationId || (item.variation && item.variation.id === variationId)))
        ? { ...item, quantity } 
        : item
    )
  );
}

export function clearCart() {
  if (browser) {
    // Clear Medusa cart - we'll create a new one when needed
    localStorage.removeItem('medusa_cart_id');
  }
  
  // Clear local cart
  cart.set([]);
}