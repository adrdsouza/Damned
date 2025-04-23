<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT APPROVAL
  This component is locked and requires explicit consent for any changes.
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import { Star } from 'lucide-svelte';
  
  interface Review {
    title: string;
    text: string;
    rating: number;
    author: string;
    date: string;
  }
  
  let reviews: Review[] = [];
  let isLoading = true;
  let error: string | null = null;
  
  onMount(async () => {
    try {
      const response = await fetch('/api/reviews', {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      reviews = data.reviews;
    } catch (e) {
      error = "Failed to load reviews. Please try again later.";
      console.error('Reviews fetch error:', e);
    } finally {
      isLoading = false;
    }
  });
  
  function getRatingStars(rating: number) {
    return Array(5).fill(0).map((_, i) => i < rating);
  }
</script>

<section class="py-16 bg-cream">
  <div class="container">
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold mb-4">What Our Customers Say</h2>
      <p class="text-gray-700 max-w-2xl mx-auto">
        Don't just take our word for it. Here's what the EDC community has to say about our products and service.
      </p>
    </div>
    
    {#if isLoading}
      <div class="text-center py-12">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    {:else if error}
      <div class="text-center py-12 text-red-500">
        {error}
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each reviews as review}
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex mb-4">
              {#each getRatingStars(review.rating) as isFilled}
                <Star
                  size={20}
                  class={isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              {/each}
            </div>
            <h3 class="font-bold mb-2">{review.title}</h3>
            <p class="text-gray-700 mb-4 line-clamp-3">{review.text}</p>
            <div class="flex justify-between items-center text-sm text-gray-500">
              <span>{review.author}</span>
              <span>{review.date}</span>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="text-center mt-8">
        <a 
          href="https://www.trustpilot.com/review/damneddesigns.com" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn btn-primary"
        >
          Read More Reviews
        </a>
      </div>
    {/if}
  </div>
</section>