<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is locked and requires explicit consent for any changes.
-->

<script lang="ts">
  import { browser } from '$app/environment';
</script>

<section class="relative bg-cream min-h-[600px] flex items-center">
  <div class="container">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div class="lg:pr-12 -mt-6">
        <h1 class="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Precision Crafted Knives for the Discerning Collector
        </h1>
        <p class="text-lg text-gray-700 mb-6 max-w-xl">
          Discover our premium collection of EDC knives, designed with meticulous attention to detail and crafted from the finest materials.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a href="/products" class="btn btn-primary">
            Shop Collection
          </a>
          <a href="/about" class="btn btn-secondary">
            About Us
          </a>
        </div>
      </div>
      
      <div class="relative h-full">
        <div class="w-full h-full min-h-[400px] relative flex justify-center items-center">
          <img 
            src="/hero.webp"
            alt="Premium knife from Damned Designs" 
            class="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  </div>
</section>