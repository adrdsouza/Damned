<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is locked and requires explicit consent for any changes.
  DO NOT CHANGE ANY PART OF THIS PRODUCT DETAIL PAGE WITHOUT EXPLICIT OWNER APPROVAL.
-->

<script lang="ts">
  import { page } from "$app/stores";
  import { products } from "$lib/data/products";
  import { addToCart } from "$lib/stores/cartStore";
  import { Minus, Plus, ShoppingCart, BellRing, X, ChevronDown, ChevronUp } from "lucide-svelte";
  import toast from "svelte-french-toast";
  
  export let data;
  const product = data.product;
  
  let quantity = 1;
  let selectedVariation = product.variations && product.variations.length > 0 
    ? product.variations.find(v => v.inStock) || null 
    : null;
  let showWaitlistModal = false;
  let waitlistEmail = "";
  let waitlistVariation: string | null = null;
  let showSpecs = false;
  
  function incrementQuantity() {
    quantity += 1;
  }
  
  function decrementQuantity() {
    if (quantity > 1) {
      quantity -= 1;
    }
  }
  
  function handleAddToCart() {
    if (product) {
      if (product.variations && product.variations.length > 0 && !selectedVariation) {
        toast.error("Please select a variation");
        return;
      }
      
      addToCart(product, quantity, selectedVariation);
      toast.success(`Added ${quantity} ${product.name} to cart`);
    }
  }

  function openWaitlist(variationName: string) {
    waitlistVariation = variationName;
    showWaitlistModal = true;
  }

  function handleWaitlistSubmit() {
    if (!waitlistEmail) {
      toast.error("Please enter your email");
      return;
    }
    
    // In a real app, this would submit to a server endpoint
    toast.success(`You'll be notified when ${waitlistVariation} is back in stock!`);
    showWaitlistModal = false;
    waitlistEmail = "";
    waitlistVariation = null;
  }
  
  $: currentPrice = selectedVariation ? selectedVariation.price : product?.price;
  $: currentSalePrice = selectedVariation ? selectedVariation.salePrice : product?.salePrice;
  $: currentImage = selectedVariation ? selectedVariation.image : product?.image;
  $: isOnSale = currentSalePrice !== undefined;
  $: discount = isOnSale && currentPrice && currentSalePrice 
    ? Math.round((1 - (currentSalePrice / currentPrice)) * 100) 
    : 0;
  
  // Calculate price range if variations exist with different prices
  $: hasPriceRange = product.variations && product.variations.length > 0 && 
    new Set(product.variations.map(v => v.price)).size > 1;
  
  $: minPrice = hasPriceRange && product.variations && product.variations.length > 0
    ? Math.min(...product.variations.map(v => v.price), product.price)
    : currentPrice || 0;
    
  $: maxPrice = hasPriceRange && product.variations && product.variations.length > 0
    ? Math.max(...product.variations.map(v => v.price))
    : currentPrice || 0;
</script>

<div class="container py-12">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
    <!-- Image Column -->
    <div class="md:sticky md:top-24 self-start">
      <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
        <img 
          src={currentImage} 
          alt={product.name} 
          class="w-full h-full object-cover"
        />
        {#if isOnSale && discount > 0}
          <div class="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-lg font-bold">
            SAVE {discount}%
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Text Column -->
    <div class="space-y-8 pt-3 md:pt-3">
      <div>
        <h1 class="text-3xl font-bold mb-4">{product.name}</h1>
        {#if isOnSale && currentSalePrice !== undefined}
          <div class="flex items-center gap-3 mb-1">
            <p class="text-2xl font-bold text-green-600">${currentSalePrice.toFixed(2)}</p>
            <p class="text-xl text-gray-500 line-through">${currentPrice.toFixed(2)}</p>
          </div>
          <p class="text-gray-600 text-sm font-medium mb-4">or 4 interest-free payments of ${((currentSalePrice || 0) / 4).toFixed(2)}</p>
        {:else}
          {#if hasPriceRange}
            <p class="text-2xl font-bold mb-1">${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</p>
            <p class="text-gray-600 text-sm font-medium mb-4">or 4 interest-free payments of ${(minPrice / 4).toFixed(2)} - ${(maxPrice / 4).toFixed(2)}</p>
          {:else if currentPrice !== undefined}
            <p class="text-2xl font-bold mb-1">${currentPrice.toFixed(2)}</p>
            <p class="text-gray-600 text-sm font-medium mb-4">or 4 interest-free payments of ${(currentPrice / 4).toFixed(2)}</p>
          {/if}
        {/if}
      </div>
      
      <div class="prose max-w-none">
        <p class="mb-6">{product.description}</p>
        
        {#if product.variations && product.variations.length > 0}
          <div class="mb-6">
            <h2 class="text-xl font-bold mb-4">Options</h2>
            <div class="space-y-3">
              {#each product.variations as variation}
                <label class="flex items-center group cursor-pointer">
                  <div class="w-4 h-4 relative flex items-center justify-center">
                    {#if variation.inStock}
                      <input 
                        type="radio" 
                        name="variation" 
                        value={variation}
                        bind:group={selectedVariation}
                        class="w-4 h-4 text-accent focus:ring-accent border-gray-300"
                        aria-label={`Select ${variation.name} variation`}
                      />
                    {:else}
                      <button 
                        class="w-4 flex items-center justify-center"
                        on:click|preventDefault={() => openWaitlist(variation.name)}
                        on:keydown={(e) => e.key === 'Enter' && openWaitlist(variation.name)}
                        aria-label={`Get notified when ${variation.name} is back in stock`}
                      >
                        <BellRing size={16} class="text-black" />
                      </button>
                    {/if}
                  </div>
                  <span class="ml-2 flex-grow flex items-center">
                    <span class="font-medium text-black" class:line-through={!variation.inStock}>
                      {variation.name}
                    </span>
                    {#if variation.salePrice !== undefined}
                      <span class="ml-2 text-green-600 font-medium" class:line-through={!variation.inStock}>
                        ${variation.salePrice.toFixed(2)}
                      </span>
                      <span class="ml-2 text-gray-500 line-through text-sm" class:line-through={!variation.inStock}>
                        ${variation.price.toFixed(2)}
                      </span>
                    {:else if variation.price !== product.price}
                      <span class="ml-2 text-black" class:line-through={!variation.inStock}>
                        ${variation.price.toFixed(2)}
                      </span>
                    {/if}
                  </span>
                </label>
              {/each}
            </div>
          </div>
        {/if}
        
        <div class="border-t border-gray-200 pt-6 mb-8">
          <button 
            class="w-full flex items-center justify-between py-3"
            on:click={() => showSpecs = !showSpecs}
            on:keydown={(e) => e.key === 'Enter' && (showSpecs = !showSpecs)}
            aria-expanded={showSpecs}
            aria-controls="specifications-panel"
          >
            <span class="font-bold">Specifications</span>
            {#if showSpecs}
              <ChevronUp size={20} />
            {:else}
              <ChevronDown size={20} />
            {/if}
          </button>
          
          {#if showSpecs}
            <div id="specifications-panel" class="mt-4 pl-4">
              <ul class="list-disc space-y-2">
                <li>Material: {product.specs?.material || 'Premium steel'}</li>
                <li>Length: {product.specs?.length || '8.5 inches'}</li>
                <li>Weight: {product.specs?.weight || '4.2 oz'}</li>
                <li>Handle: {product.specs?.handle || 'G10'}</li>
              </ul>
            </div>
          {/if}
        </div>
        
        <div class="flex items-center">
          <div class="flex items-center border border-gray-300 rounded-md">
            <button 
              class="px-3 py-2 border-r border-gray-300"
              on:click={decrementQuantity}
              on:keydown={(e) => e.key === 'Enter' && decrementQuantity()}
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <span class="px-4 py-2">{quantity}</span>
            <button 
              class="px-3 py-2 border-l border-gray-300"
              on:click={incrementQuantity}
              on:keydown={(e) => e.key === 'Enter' && incrementQuantity()}
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>
          
          <button 
            class="btn btn-primary ml-4 flex-grow"
            on:click={handleAddToCart}
            disabled={product.variations && product.variations.length > 0 && !selectedVariation}
          >
            <ShoppingCart size={20} class="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Waitlist Modal -->
{#if showWaitlistModal}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="waitlist-title"
  >
    <div class="bg-white p-6 rounded-lg max-w-md w-full mx-4" tabindex="-1">
      <div class="flex justify-between items-center mb-4">
        <h3 id="waitlist-title" class="text-xl font-bold">Get Notified</h3>
        <button 
          class="text-gray-500 hover:text-gray-700"
          on:click={() => showWaitlistModal = false}
          on:keydown={(e) => e.key === 'Enter' && (showWaitlistModal = false)}
          aria-label="Close notification dialog"
        >
          <X size={24} />
        </button>
      </div>
      
      <p class="mb-4">We'll email you when {waitlistVariation} is back in stock.</p>
      
      <form on:submit|preventDefault={handleWaitlistSubmit}>
        <input 
          type="email" 
          bind:value={waitlistEmail}
          placeholder="Enter your email"
          aria-label="Email address for stock notification"
          class="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
        />
        
        <button type="submit" class="w-full btn btn-primary" aria-label="Submit to get notified">
          Notify Me
        </button>
      </form>
    </div>
  </div>
{/if}