<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is locked and requires explicit consent for any changes.
  DO NOT CHANGE ANY PART OF THIS CATEGORY PAGE WITHOUT EXPLICIT OWNER APPROVAL.
-->

<script lang="ts">
  import { page } from "$app/stores";
  import ProductCard from "$lib/components/products/ProductCard.svelte";
  import { ChevronRight } from "lucide-svelte";
  
  export let data;
  
  // Category information
  const categoryInfo = {
    "knives": {
      name: "Knives",
      description: "Our premium collection of folding and fixed blade knives, designed with precision and crafted from the finest materials for exceptional performance and durability.",
      image: "/images/categories/knives-banner.jpg"
    },
    "tools": {
      name: "Tools",
      description: "Versatile everyday carry tools designed to tackle a variety of tasks with ease and reliability, from pry bars to multi-tools.",
      image: "/images/categories/tools-banner.jpg"
    },
    "accessories": {
      name: "Accessories",
      description: "Essential add-ons to complement your EDC gear, including pouches, beads, and maintenance kits to keep your equipment in peak condition.",
      image: "/images/categories/accessories-banner.jpg"
    }
  };
  
  const currentCategory = data.category;
  const currentInfo = categoryInfo[currentCategory] || {
    name: "Products",
    description: "Browse our collection of premium EDC gear.",
    image: "/images/categories/default-banner.jpg"
  };
</script>

<svelte:head>
  <title>{currentInfo.name} | Damned Designs</title>
  <meta name="description" content={currentInfo.description} />
</svelte:head>

<div class="container py-12">
  <div class="flex items-center text-sm mb-6">
    <a href="/" class="hover:underline">Home</a>
    <ChevronRight size={16} class="mx-2" />
    <a href="/shop" class="hover:underline">Shop</a>
    <ChevronRight size={16} class="mx-2" />
    <span>{currentInfo.name}</span>
  </div>
  
  <div class="relative rounded-lg overflow-hidden mb-10 h-64">
    <img 
      src={currentInfo.image} 
      alt={currentInfo.name} 
      class="w-full h-full object-cover"
    />
    <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div class="text-center text-white p-6">
        <h1 class="text-4xl font-bold mb-2">{currentInfo.name}</h1>
        <p class="max-w-2xl">{currentInfo.description}</p>
      </div>
    </div>
  </div>
  
  {#if data.products.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each data.products as product}
        <ProductCard {product} />
      {/each}
    </div>
  {:else}
    <div class="text-center py-12">
      <p class="text-xl mb-4">No products found in this category.</p>
      <a href="/products" class="btn btn-primary">View All Products</a>
    </div>
  {/if}
</div>