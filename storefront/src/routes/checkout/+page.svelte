<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  
  onMount(() => {
    // Redirect to products page since we're using a popup cart/checkout now
    goto("/products");
  });
</script>

<div class="container py-12 text-center">
  <p>Redirecting to products page...</p>
</div>