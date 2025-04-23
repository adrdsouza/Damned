<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is partially locked and requires explicit consent for changes.
  Only the reviews section (marked below) may be modified.
-->

<script lang="ts">
  import { ChevronDown, ChevronUp } from "lucide-svelte";
</script>

<section class="py-16 bg-cream">
  <div class="container">
    <!-- About Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h2 class="text-3xl font-bold mb-6">Crafted with Passion</h2>
        <p class="text-gray-700 mb-4">
          At Damned Designs, we're passionate about creating exceptional everyday carry tools that combine innovative design, premium materials, and superior craftsmanship.
        </p>
        <p class="text-gray-700 mb-6">
          Each knife we create is a perfect balance of form and function, designed to be used and appreciated for years to come. We take pride in our attention to detail, our innovative approach to design, and our unwavering commitment to quality.
        </p>
        <a href="/about" class="btn btn-primary">Learn More</a>
      </div>
      
      <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src="/images/about-section.jpg" 
          alt="Damned Designs workshop" 
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</section>