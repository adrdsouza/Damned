<script lang="ts">
  import type { Product } from "$lib/types";
  import { ShoppingCart } from "lucide-svelte";
  import { getImageWithFallback } from "$lib/utils";
  import { addToCart } from "$lib/stores/cartStore";
  import toast from "svelte-french-toast";
  
  export let product: Product;
  
  function handleAddToCart() {
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart`);
  }
  
  // Calculate price range if variations exist with different prices
  $: hasPriceRange = product.variations && product.variations.length > 0 && 
    new Set(product.variations.map(v => v.price)).size > 1;
  
  $: minPrice = hasPriceRange && product.variations && product.variations.length > 0
    ? Math.min(...product.variations.map(v => v.price), product.price)
    : product.price;
    
  $: maxPrice = hasPriceRange && product.variations && product.variations.length > 0
    ? Math.max(...product.variations.map(v => v.price))
    : product.price;
    
  $: saleVariations = (product.variations || []).filter(v => v.salePrice !== undefined);
  $: hasSaleVariations = saleVariations.length > 0;
    
  $: minSalePrice = hasSaleVariations && saleVariations.length > 0
    ? Math.min(...saleVariations.map(v => v.salePrice || 0), product.salePrice !== undefined ? product.salePrice : Infinity)
    : product.salePrice;
    
  $: maxSalePrice = hasSaleVariations && saleVariations.length > 0
    ? Math.max(...saleVariations.map(v => v.salePrice || 0))
    : product.salePrice;
    
  $: isOnSale = product.onSale || product.salePrice !== undefined || hasSaleVariations;
  
  $: discount = isOnSale && minPrice && minSalePrice !== undefined && minSalePrice > 0
    ? Math.round((1 - (minSalePrice / minPrice)) * 100) 
    : 0;
</script>

<div class="group">
  <a 
    href={`/products/${product.slug}`} 
    class="block"
    aria-label={`View ${product.name} details`}
  >
    <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
      <img 
        src={getImageWithFallback(product.image)} 
        alt={product.name} 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div class="absolute top-2 left-2 flex flex-col gap-2">
        {#if isOnSale && discount > 0}
          <div class="bg-green-600 text-white text-xs px-2 py-1 rounded" aria-label={`Save ${discount}%`}>
            SAVE {discount}%
          </div>
        {/if}
      </div>
      <div class="absolute top-2 right-2 flex flex-col gap-2">
        {#if product.new}
          <div class="bg-accent text-white text-xs px-2 py-1 rounded" aria-label="New product">
            NEW
          </div>
        {/if}
      </div>
    </div>
    <h3 class="text-lg font-bold mb-1">{product.name}</h3>
    {#if isOnSale && minSalePrice !== undefined}
      <div class="flex items-center gap-2">
        {#if hasPriceRange && minSalePrice !== undefined && maxSalePrice !== undefined}
          <p class="font-bold">${minSalePrice.toFixed(2)} - ${maxSalePrice.toFixed(2)}</p>
          <p class="text-gray-500 line-through text-sm">${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</p>
        {:else if product.salePrice !== undefined}
          <p class="font-bold">${product.salePrice.toFixed(2)}</p>
          <p class="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</p>
        {:else}
          <p class="font-bold">${product.price.toFixed(2)}</p>
        {/if}
      </div>
    {:else}
      <div>
        {#if hasPriceRange}
          <p class="font-bold">${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}</p>
        {:else}
          <p class="font-bold">${product.price.toFixed(2)}</p>
        {/if}
      </div>
    {/if}
    <p class="text-gray-600 text-sm">or 4 interest-free payments</p>
  </a>
</div>