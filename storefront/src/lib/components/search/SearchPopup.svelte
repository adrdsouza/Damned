<script lang="ts">
  import { X, Search } from "lucide-svelte";
  import { products } from "$lib/data/products";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  
  export let onClose: () => void;
  
  let searchQuery = "";
  let searchResults: typeof products = [];
  let inputElement: HTMLInputElement;
  
  $: {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      searchResults = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    } else {
      searchResults = [];
    }
  }
  
  function handleProductClick(slug: string) {
    onClose();
    goto(`/products/${slug}`);
  }
  
  onMount(() => {
    // Focus the search input when the component mounts
    if (inputElement) {
      inputElement.focus();
    }
  });
</script>

<div class="w-full bg-white shadow-xl pointer-events-auto">
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Search Products</h2>
      <button 
        class="text-gray-500 hover:text-gray-700 transition-colors"
        on:click={onClose}
        on:keydown={(e) => e.key === 'Enter' && onClose()}
        aria-label="Close search"
      >
        <X size={24} />
      </button>
    </div>
    
    <div class="relative mb-6">
      <input 
        type="text" 
        bind:value={searchQuery}
        bind:this={inputElement}
        placeholder="Search for products..."
        class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Search for products"
      />
      <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
    </div>
    
    {#if searchQuery.trim() && searchResults.length === 0}
      <div class="text-center py-8">
        <p class="text-lg mb-2">No products found for "{searchQuery}"</p>
        <p class="text-gray-500">Try a different search term or browse our categories</p>
      </div>
    {:else if searchResults.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each searchResults as product}
          <div 
            class="p-3 border border-gray-200 rounded-md hover:shadow-md transition-shadow cursor-pointer pointer-events-auto"
            on:click={() => handleProductClick(product.slug)}
            on:keydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleProductClick(product.slug);
              }
            }}
            tabindex="0"
            role="button"
            aria-label={`View ${product.name}`}
          >
            <div class="flex items-center">
              <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="ml-3">
                <h3 class="font-bold">{product.name}</h3>
                <p class="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                <p class="text-xs text-gray-400 capitalize">{product.category}</p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>