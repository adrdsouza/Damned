<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is locked and requires explicit consent for any changes.
  DO NOT CHANGE ANY PART OF THIS PRODUCTS PAGE WITHOUT EXPLICIT OWNER APPROVAL.
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import medusaClient from '$lib/medusaClient';
  import ProductCard from "$lib/components/products/ProductCard.svelte";
  import ProductFilters from "$lib/components/products/ProductFilters.svelte";
  
  export let data;
  
  let products = [];
  let error = '';
  let filteredProducts = [];
  let selectedCategory = "all";
  let searchQuery = "";
  
  function filterProducts() {
    filteredProducts = products.filter(product => {
      // Filter by category
      const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
      
      // Filter by search query
      const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && searchMatch;
    });
  }
  
  function handleCategoryChange(event: CustomEvent) {
    selectedCategory = event.detail;
    filterProducts();
  }
  
  function handleSearch(event: CustomEvent) {
    searchQuery = event.detail;
    filterProducts();
  }
  
  onMount(async () => {
    try {
      const response = await medusaClient.get('/store/products');
      products = response.data.products;
      filterProducts();
    } catch (err) {
      error = 'Failed to fetch products. Please try again later.';
      console.error(err);
    }
  });
</script>

<svelte:head>
  <title>Products | Damned Designs</title>
  <meta name="description" content="Browse our collection of premium knives and EDC gear. Find the perfect tool for your everyday carry needs." />
</svelte:head>

<section class="py-12 bg-white">
  <div class="container">
    <h1 class="text-4xl font-bold mb-8 text-center">Our Products</h1>
    
    <ProductFilters 
      on:categoryChange={handleCategoryChange} 
      on:search={handleSearch}
    />
    
    {#if error}
      <p class="error text-center py-12">{error}</p>
    {:else if filteredProducts.length === 0}
      <div class="text-center py-12">
        <p class="text-xl">No products found matching your criteria.</p>
        <button 
          class="mt-4 btn btn-primary"
          on:click={() => {
            selectedCategory = "all";
            searchQuery = "";
            filterProducts();
          }}
        >
          Reset Filters
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {#each filteredProducts as product}
          <ProductCard {product} />
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .error {
    color: red;
  }
</style>