<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is locked and requires explicit consent for any changes.
-->

<script lang="ts">
  import { products } from "$lib/data/products";
  import { ArrowRight, ArrowLeft } from "lucide-svelte";
  import { browser } from '$app/environment';
  import Carousel from 'svelte-carousel';
  
  // Get featured products
  const featuredProducts = products
    .filter(product => product.featured)
    .slice(0, 4);

  let currentIndex = 0;
</script>

<section class="relative bg-white">
  <div class="w-full h-[800px] relative">
    {#if browser}
      <Carousel 
        autoplay 
        autoplayDuration={5000}
        pauseOnFocus
        arrows={false}
        dots={false}
        on:pageChange={({ detail }) => currentIndex = detail}
      >
        {#each featuredProducts as product, i}
          <div class="relative h-[800px] w-full">
            <img 
              src={product.image} 
              alt={product.name}
              class="w-full h-full object-cover"
            />
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            
            <!-- Content -->
            <div class="absolute inset-0 container flex items-center">
              <div class="max-w-2xl text-white">
                <div class="mb-4">
                  {#if i === 0}
                    <span class="bg-accent px-3 py-1 text-sm font-medium rounded-full">Best Seller</span>
                  {:else if i === 1}
                    <span class="bg-primary px-3 py-1 text-sm font-medium rounded-full">Featured</span>
                  {:else if i === 2}
                    <span class="bg-green-500 px-3 py-1 text-sm font-medium rounded-full">New Launch</span>
                  {/if}
                </div>
                <h2 class="text-5xl font-bold mb-4">{product.name}</h2>
                <p class="text-lg text-gray-200 mb-6 line-clamp-3">{product.description}</p>
                <div class="flex gap-4">
                  <a 
                    href={`/products/${product.slug}`} 
                    class="btn bg-white text-primary hover:bg-gray-100"
                  >
                    View Details
                  </a>
                  <button 
                    class="btn bg-primary text-white hover:bg-gray-800"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </Carousel>

      <!-- Custom Navigation -->
      <div class="container absolute inset-0 flex items-center justify-between pointer-events-none">
        <button 
          class="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors pointer-events-auto"
          on:click={() => {
            const carousel = document.querySelector('.sc-carousel');
            if (carousel) {
              // @ts-ignore
              carousel.prev();
            }
          }}
        >
          <ArrowLeft size={24} />
        </button>
        <button 
          class="p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors pointer-events-auto"
          on:click={() => {
            const carousel = document.querySelector('.sc-carousel');
            if (carousel) {
              // @ts-ignore
              carousel.next();
            }
          }}
        >
          <ArrowRight size={24} />
        </button>
      </div>
    {:else}
      <!-- SSR Fallback -->
      <div class="relative h-[800px] w-full">
        <img 
          src={featuredProducts[0].image} 
          alt={featuredProducts[0].name}
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        <div class="absolute inset-0 container flex items-center">
          <div class="max-w-2xl text-white">
            <div class="mb-4">
              <span class="bg-accent px-3 py-1 text-sm font-medium rounded-full">Best Seller</span>
            </div>
            <h2 class="text-5xl font-bold mb-4">{featuredProducts[0].name}</h2>
            <p class="text-lg text-gray-200 mb-6 line-clamp-3">{featuredProducts[0].description}</p>
            <div class="flex gap-4">
              <a 
                href={`/products/${featuredProducts[0].slug}`} 
                class="btn bg-white text-primary hover:bg-gray-100"
              >
                View Details
              </a>
              <button 
                class="btn bg-primary text-white hover:bg-gray-800"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</section>

<style>
  :global(.sc-carousel__dots-wrapper) {
    display: none !important;
  }
</style>