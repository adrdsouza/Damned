<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Search } from "lucide-svelte";
  
  const dispatch = createEventDispatcher();
  
  let selectedCategory = "all";
  let searchQuery = "";
  
  const categories = [
    { id: "all", name: "All Products" },
    { id: "knives", name: "Knives" },
    { id: "tools", name: "Tools" },
    { id: "accessories", name: "Accessories" }
  ];
  
  function handleCategoryChange(category: string) {
    selectedCategory = category;
    dispatch("categoryChange", category);
  }
  
  function handleSearch() {
    dispatch("search", searchQuery);
  }
</script>

<div class="flex flex-col md:flex-row justify-between gap-6">
  <div class="flex flex-wrap gap-2">
    {#each categories as category}
      <button 
        class={`px-4 py-2 rounded-full border ${selectedCategory === category.id ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-gray-300 hover:bg-gray-100'}`}
        on:click={() => handleCategoryChange(category.id)}
        on:keydown={(e) => e.key === 'Enter' && handleCategoryChange(category.id)}
        aria-pressed={selectedCategory === category.id}
        aria-label={`Filter by ${category.name}`}
      >
        {category.name}
      </button>
    {/each}
  </div>
  
  <div class="relative">
    <input 
      type="text" 
      placeholder="Search products..." 
      bind:value={searchQuery}
      on:input={handleSearch}
      aria-label="Search products"
      class="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
    />
    <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <Search size={18} />
    </div>
  </div>
</div>