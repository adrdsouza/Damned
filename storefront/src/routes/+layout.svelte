<script>
import "../app.css";
import Header from "$lib/components/Header.svelte";
import Footer from "$lib/components/Footer.svelte";
import FloatingCart from "$lib/components/FloatingCart.svelte";
import { Toaster } from "svelte-french-toast";
import { page } from "$app/stores";
import { onMount } from "svelte";
import { useMedusaCart } from "$lib/hooks/useMedusaCart";

// Initialize Medusa cart
useMedusaCart();

// Only show hero layout on home page
$: isHomePage = $page.url.pathname === "/";
</script>

<Toaster />

<div class="flex flex-col min-h-screen bg-white">
  <Header />
  <main class="flex-grow">
    <slot />
  </main>
  <Footer />
  <FloatingCart />
</div>