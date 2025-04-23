<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is locked and requires explicit consent for any changes.
  DO NOT CHANGE ANY PART OF THIS SHOP PAGE WITHOUT EXPLICIT OWNER APPROVAL.
-->

<script lang="ts">
  import { ChevronRight } from "lucide-svelte";
  
  export let data;
  
  // Define the categories with images and descriptions
  const categories = [
    {
      id: "knives",
      name: "Knives",
      description: "Premium folding and fixed blade knives crafted with precision and designed for performance.",
      image: "/images/categories/knives.jpg",
      count: data.categoryCounts.knives || 0
    },
    {
      id: "tools",
      name: "Tools",
      description: "Versatile EDC tools designed to tackle everyday tasks with ease and reliability.",
      image: "/images/categories/tools.jpg",
      count: data.categoryCounts.tools || 0
    },
    {
      id: "accessories",
      name: "Accessories",
      description: "Essential add-ons to complement your EDC gear and enhance your everyday experience.",
      image: "/images/categories/accessories.jpg",
      count: data.categoryCounts.accessories || 0
    }
  ];
</script>

<svelte:head>
  <title>Shop | Damned Designs</title>
  <meta name="description" content="Browse our collection of premium knives, tools, and accessories. Find the perfect EDC gear for your needs." />
</svelte:head>

<div class="container py-12">
  <div class="flex items-center text-sm mb-6">
    <a href="/" class="hover:underline">Home</a>
    <ChevronRight size={16} class="mx-2" />
    <span>Shop</span>
  </div>
  
  <h1 class="text-4xl font-bold mb-8">Shop by Category</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
    {#each categories as category}
      <a href={`/shop/${category.id}`} class="group">
        <div class="bg-gray-100 rounded-lg overflow-hidden">
          <div class="aspect-[4/3] overflow-hidden">
            <img 
              src={category.image} 
              alt={category.name} 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="p-6">
            <h2 class="text-2xl font-bold mb-2">{category.name}</h2>
            <p class="text-gray-700 mb-3">{category.description}</p>
            <p class="text-sm text-gray-500">{category.count} products</p>
          </div>
        </div>
      </a>
    {/each}
  </div>
  
  <div class="bg-primary text-white rounded-lg p-10 text-center relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
    <div class="relative z-10">
      <h2 class="text-3xl font-bold mb-4">Explore Our Complete Collection</h2>
      <p class="text-gray-200 mb-6 max-w-2xl mx-auto">
        Discover the perfect everyday carry companion from our full range of meticulously crafted premium knives and tools.
      </p>
      <a href="/products" class="btn bg-white text-primary hover:bg-gray-100 px-8 py-3 font-bold">
        Browse All Products
      </a>
    </div>
  </div>
</div>