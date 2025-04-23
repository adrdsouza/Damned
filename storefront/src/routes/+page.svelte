<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is locked and requires explicit consent for any changes.
  DO NOT CHANGE ANY PART OF THIS HOMEPAGE WITHOUT EXPLICIT OWNER APPROVAL.
-->

<script lang="ts">

  import Hero from "$lib/components/home/Hero.svelte";
  import TrustBar from "$lib/components/home/TrustBar.svelte";
  import FeaturedProducts from "$lib/components/home/FeaturedProducts.svelte";
  import AboutSection from "$lib/components/home/AboutSection.svelte";
  import Newsletter from "$lib/components/home/Newsletter.svelte";
</script>

<svelte:head>
  <title>Damned Designs - Premium Knives & EDC Gear</title>
  <meta name="description" content="Discover premium knives and EDC gear at Damned Designs. Exceptional craftsmanship, innovative designs, and superior materials for enthusiasts and collectors." />
</svelte:head>

<Hero />
<TrustBar />
<FeaturedProducts />
<AboutSection />
<Newsletter />