<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is locked and requires explicit consent for any changes.
-->

<script lang="ts">
  import { Truck, Shield, CreditCard, Award } from "lucide-svelte";
</script>

<section class="bg-white py-3 border-y border-gray-200 sticky-trust-bar">
  <div class="container">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center">
      <!-- Free Shipping -->
      <div class="flex flex-col items-center text-center">
        <div class="w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2">
          <Truck size={20} />
        </div>
        <div>
          <p class="font-bold text-sm">Free Shipping</p>
          <p class="text-xs text-gray-600">On orders over $100</p>
        </div>
      </div>

      <!-- SheerID Verification -->
      <div class="flex flex-col items-center text-center">
        <div class="w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2">
          <Shield size={20} />
        </div>
        <div>
          <p class="font-bold text-sm">Military & First Responder</p>
          <p class="text-xs text-gray-600">Verified 10% discount</p>
        </div>
      </div>

      <!-- Sezzle Payments -->
      <div class="flex flex-col items-center text-center">
        <div class="w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2">
          <CreditCard size={20} />
        </div>
        <div>
          <p class="font-bold text-sm">Buy Now, Pay Later</p>
          <p class="text-xs text-gray-600">4 interest-free payments</p>
        </div>
      </div>

      <!-- Trustpilot -->
      <div class="flex flex-col items-center text-center">
        <div class="w-10 h-10 flex items-center justify-center bg-cream rounded-full mb-2">
          <Award size={20} />
        </div>
        <div>
          <p class="font-bold text-sm">Trusted by Customers</p>
          <p class="text-xs text-gray-600">4.8/5 on Trustpilot</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .sticky-trust-bar {
    position: relative;
    z-index: 10;
  }
  
  @media (max-height: 800px) {
    .sticky-trust-bar {
      position: sticky;
      bottom: 0;
    }
  }
</style>