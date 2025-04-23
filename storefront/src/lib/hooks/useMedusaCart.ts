import { browser } from '$app/environment';
import { onMount } from 'svelte';
import { cart } from '$lib/stores/cartStore';
import { get } from 'svelte/store';
import { initializeCart } from '$lib/services/medusa/cart.service';
import toast from 'svelte-french-toast';

// Hook to initialize cart on component mount
export function useMedusaCart() {
  onMount(() => {
    if (browser) {
      initializeCart().catch(error => {
        console.error('Error initializing Medusa cart:', error);
        // We'll continue with local cart if Medusa fails
      });
    }
  });
  
  return { cart };
}