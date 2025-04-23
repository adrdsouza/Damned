<script lang="ts">
  import { ShoppingCart } from "lucide-svelte";
  import { cart } from "$lib/stores/cartStore";
  import { fly } from "svelte/transition";
  import CartPopup from "$lib/components/cart/CartPopup.svelte";
  
  let isCartOpen = false;
  let cartCount = 0;
  
  $: cartCount = $cart.reduce((sum, item) => sum + item.quantity, 0);
  
  function toggleCart() {
    isCartOpen = !isCartOpen;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isCartOpen) {
      isCartOpen = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="fixed right-0 top-50vh transform -translate-y-1/2 z-40">
  <button 
    class="bg-primary p-3 rounded-l-lg shadow-lg flex items-center justify-center relative"
    on:click={toggleCart}
    aria-label="Cart"
    aria-expanded={isCartOpen}
    aria-haspopup="dialog"
  >
    <ShoppingCart size={24} class="text-white" />
    {#if cartCount > 0}
      <span 
        class="absolute bottom-0 left-0 -ml-1 -mb-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        aria-label={`${cartCount} items in cart`}
      >
        {cartCount}
      </span>
    {/if}
  </button>
</div>

<!-- Cart Popup -->
{#if isCartOpen}
  <div 
    class="fixed inset-0 z-50 overflow-hidden" 
    transition:fly={{ duration: 200, opacity: 0 }}
    role="dialog"
    aria-modal="true"
    aria-label="Shopping Cart"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div 
        class="absolute inset-0 bg-black bg-opacity-50 transition-opacity pointer-events-auto" 
        on:click={() => isCartOpen = false}
        on:keydown={(e) => e.key === 'Enter' && (isCartOpen = false)}
        tabindex="0"
        role="button"
        aria-label="Close cart"
      ></div>
      <div class="fixed top-50vh right-0 transform -translate-y-1/2 w-[800px] max-w-[90vw]" transition:fly={{ duration: 300, x: 800 }}>
        <div class="h-[85vh] bg-white shadow-xl rounded-l-lg overflow-hidden">
          <CartPopup onClose={toggleCart} />
        </div>
      </div>
    </div>
  </div>
{/if}