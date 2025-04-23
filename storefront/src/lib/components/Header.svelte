<!--
  @notice CRITICAL COMPONENT - DO NOT MODIFY WITHOUT EXPLICIT PERMISSION
  This component is locked and requires explicit consent for any changes.
  Header color and styling must remain as specified below.
-->

<script lang="ts">
  import { Menu, X, Search, User, ChevronDown } from "lucide-svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import CartPopup from "$lib/components/cart/CartPopup.svelte";
  import SearchPopup from "$lib/components/search/SearchPopup.svelte";
  import { user, isAuthenticated } from "$lib/stores/userStore";
  
  let isMenuOpen = false;
  let isScrolled = false;
  let isSearchOpen = false;
  let isContactDropdownOpen = false;
  let dropdownTimeout: NodeJS.Timeout;
  let dropdownContainer: HTMLDivElement;
  
  $: currentPath = $page.url.pathname;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function closeMenu() {
    isMenuOpen = false;
    isContactDropdownOpen = false;
  }
  
  function toggleSearch() {
    isSearchOpen = !isSearchOpen;
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      if (isSearchOpen) {
        isSearchOpen = false;
      }
      if (isMenuOpen) {
        closeMenu();
      }
    }
  }
  
  function handleMouseEnter() {
    clearTimeout(dropdownTimeout);
    dropdownTimeout = setTimeout(() => {
      isContactDropdownOpen = true;
    }, 100);
  }
  
  function handleMouseLeave() {
    clearTimeout(dropdownTimeout);
    dropdownTimeout = setTimeout(() => {
      isContactDropdownOpen = false;
    }, 150);
  }
  
  onMount(() => {
    const handleScroll = () => {
      isScrolled = window.scrollY > 10;
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(dropdownTimeout);
    };
  });
  
  const navItems = [
    { label: "Shop", href: "/products" },
    { 
      label: "Contact",
      children: [
        { label: "About Us", href: "/about" },
        { label: "Support", href: "/help" }
      ]
    }
  ];
</script>

<svelte:window on:keydown={handleKeyDown} />

<header class={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-cream'}`}>
  <div class="container-wide">
    <div class="flex items-center justify-between h-14">
      <!-- Logo -->
      <a href="/" class="flex-shrink-0 flex items-center">
        <div class="h-8 flex items-center">
          <svg class="h-full w-auto svelte-19i819d" viewBox="0 0 223.72 154.51" fill="currentColor">
            <g>
              <path d="M108.67,146.96c-4.3,3.09-8.1,5.71-11.49,7.55l-4.23-6.48c2.25-1.97,4.88-4.2,7.86-6.62,2.79,1.91,5.42,3.79,7.86,5.54Z"/>
              <path d="M171.49,90.61c-.44,2.6-1.1,5.13-1.96,7.57-1.73,4.86-4.43,9.32-7.7,13.32l-7.78,9.5c-5.52,6.41-10.91,12.51-16.02,18.16l-10.82-3.47-1.63-.52c-.84.56-1.67,1.1-2.48,1.64-2.53-2.02-5.27-4.17-8.2-6.43,1.12-.85,2.26-1.7,3.42-2.58,7.76-5.84,16.51-12.18,25.83-18.71,4.75-3.32,9.4-6.53,13.9-9.55,4.67-3.17,9.17-6.15,13.44-8.92Z"/>
              <path d="M130.77,148.03l-4.23,6.48c-4.22-2.28-9.03-5.78-14.67-9.84-2.51-1.79-5.18-3.71-8.03-5.69-1.81-1.25-3.71-2.53-5.69-3.83l-1.63.52-10.82,3.47c-5.11-5.64-10.5-11.75-16.02-18.16l-7.78-9.5c-3.27-4-5.97-8.45-7.7-13.32-.86-2.43-1.52-4.96-1.96-7.57,4.27,2.78,8.78,5.75,13.44,8.92,4.49,3.02,9.15,6.23,13.9,9.55,9.32,6.53,18.07,12.87,25.83,18.71,2.23,1.68,4.39,3.32,6.47,4.91,2.86,2.2,5.54,4.3,8.03,6.28,4.25,3.38,7.9,6.43,10.87,9.05Z"/>
              <path d="M124.23,61.66c.07.2.15.39.24.57,7.3,11.77,18.94,20.25,32.58,23.52,5.78-18.18,17.11-34.41,32.34-46.03.13-.13.31-.24.46-.35v-.07l2.14-1.57c.37-.26.76-.54,1.16-.78,8.63-5.99,18.11-10.46,28.25-13.27h.02c-1.74-8.74-5.69-16.89-11.42-23.65C209.18,0,208.33,0,207.5,0c-4.51,0-9,.37-13.38,1.05l-8.15,1.7c-4.9,1.26-9.68,2.94-14.23,5.01-3.75,1.7-7.32,3.77-10.79,5.99l-3.53,2.24c-1.87,1.31-3.7,2.7-5.47,4.14-6.12,5.08-11.35,11.14-15.87,17.7l-.37.54c-4.88,7.13-8.89,14.84-11.42,23.08l-.07.2Z"/>
              <path d="M188.19,66.45c0,10.64,2.94,20.77,8.52,29.62.89,1.42,1.83,2.79,2.86,4.12,2.22,2.9,4.73,5.6,7.45,8.02-.5-3.03-.74-6.15-.74-9.31,0-4.03.41-7.95,1.18-11.75,2.22-11.05,7.56-20.94,15.08-28.81.76-3.79,1.18-7.72,1.18-11.75,0-5.69-.81-11.18-2.33-16.39-10.13,2.81-19.61,7.28-28.25,13.27-3.25,7.15-4.95,15.02-4.95,22.97Z"/>
              <path d="M99.49,61.66c-.07.2-.15.39-.24.57-7.3,11.77-18.94,20.25-32.58,23.52-5.78-18.18-17.11-34.41-32.34-46.03-.13-.13-.31-.24-.46-.35v-.07l-2.14-1.57c-.37-.26-.76-.54-1.16-.78-8.63-5.99-18.11-10.46-28.25-13.27h-.02C4.05,14.93,8,6.78,13.73.02c.81-.02,1.66-.02,2.48-.02,4.51,0,9,.37,13.38,1.05l8.15,1.7c4.9,1.26,9.68,2.94,14.23,5.01,3.75,1.7,7.32,3.77,10.79,5.99l3.53,2.24c1.87,1.31,3.7,2.7,5.47,4.14,6.12,5.08,11.35,11.14,15.87,17.7l.37.54c4.88,7.13,8.89,14.84,11.42,23.08l.07.2Z"/>
              <path d="M35.52,66.45c0,10.64-2.94,20.77-8.52,29.62-.89,1.42-1.83,2.79-2.86,4.12-2.22,2.9-4.73,5.6-7.45,8.02.5-3.03.74-6.15.74-9.31,0-4.03-.41-7.95-1.18-11.75-2.22-11.05-7.56-20.94-15.08-28.81-.76-3.79-1.18-7.72-1.18-11.75,0-5.69.81-11.18,2.33-16.39,10.13,2.81,19.61,7.28,28.25,13.27,3.25,7.15,4.95,15.02,4.95,22.97Z"/>
            </g>
          </svg>
        </div>
      </a>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex space-x-8">
        {#each navItems as item}
          {#if item.children}
            <div 
              class="relative"
              bind:this={dropdownContainer}
              on:mouseenter={handleMouseEnter}
              on:mouseleave={handleMouseLeave}
            >
              <button 
                class="text-xl font-bold text-primary hover:text-gray-600 transition-colors flex items-center"
              >
                {item.label}
                <ChevronDown size={20} class="ml-1" />
              </button>
              
              {#if isContactDropdownOpen}
                <div 
                  class="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2"
                  transition:fly={{ y: -10, duration: 200 }}
                >
                  {#each item.children as child}
                    <a 
                      href={child.href}
                      class="block px-4 py-2 text-lg font-bold text-primary hover:bg-gray-100"
                    >
                      {child.label}
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          {:else}
            <a 
              href={item.href} 
              class="text-xl font-bold text-primary hover:text-gray-600 transition-colors"
            >
              {item.label}
            </a>
          {/if}
        {/each}
      </nav>
      
      <!-- Desktop Right Icons -->
      <div class="hidden md:flex items-center space-x-6">
        <button 
          class="text-primary hover:text-gray-600 transition-colors"
          on:click={toggleSearch}
          aria-label="Search"
        >
          <Search size={20} />
        </button>
        <a href={$isAuthenticated ? "/account" : "/login"} class="text-primary hover:text-gray-600 transition-colors">
          <User size={20} />
        </a>
      </div>
      
      <!-- Mobile Menu Button -->
      <div class="md:hidden flex items-center space-x-4">
        <button 
          type="button" 
          class="text-primary p-2"
          on:click={toggleMenu}
          on:keydown={(e) => e.key === 'Enter' && toggleMenu()}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {#if isMenuOpen}
            <X size={24} />
          {:else}
            <Menu size={24} />
          {/if}
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile Menu -->
  {#if isMenuOpen}
    <div
      id="mobile-menu" 
      class="md:hidden bg-white absolute top-14 inset-x-0 z-50 shadow-lg pointer-events-auto"
      transition:fly={{ y: -20, duration: 300 }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div class="container mx-auto px-4 py-4">
        <nav class="flex flex-col space-y-4">
          {#each navItems as item}
            {#if item.children}
              {#each item.children as child}
                <a 
                  href={child.href} 
                  class="text-xl font-bold py-2 text-primary hover:text-gray-600 transition-colors"
                  on:click={closeMenu}
                  on:keydown={(e) => e.key === 'Enter' && closeMenu()}
                >
                  {child.label}
                </a>
              {/each}
            {:else}
              <a 
                href={item.href} 
                class="text-xl font-bold py-2 text-primary hover:text-gray-600 transition-colors"
                on:click={closeMenu}
                on:keydown={(e) => e.key === 'Enter' && closeMenu()}
              >
                {item.label}
              </a>
            {/if}
          {/each}
          <div class="pt-4 border-t border-gray-200 flex space-x-6">
            <button 
              class="text-primary hover:text-gray-600 transition-colors"
              on:click={() => {
                toggleSearch();
                closeMenu();
              }}
              on:keydown={(e) => {
                if (e.key === 'Enter') {
                  toggleSearch();
                  closeMenu();
                }
              }}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <a 
              href={$isAuthenticated ? "/account" : "/login"} 
              class="text-primary hover:text-gray-600 transition-colors"
              on:click={closeMenu}
              on:keydown={(e) => e.key === 'Enter' && closeMenu()}
              aria-label={$isAuthenticated ? "My Account" : "Login"}
            >
              <User size={20} />
            </a>
          </div>
        </nav>
      </div>
    </div>
  {/if}
  
  <!-- Search Popup -->
  {#if isSearchOpen}
    <div class="fixed inset-0 z-50 overflow-hidden pointer-events-auto" transition:fly={{ duration: 300, y: -300 }}>
      <div class="absolute inset-0 overflow-hidden">
        <div 
          class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity pointer-events-auto" 
          on:click={toggleSearch}
          on:keydown={(e) => e.key === 'Enter' && toggleSearch()}
          tabindex="0"
          role="button"
          aria-label="Close search"
        ></div>
        <div class="fixed inset-x-0 top-0 pb-10 max-h-full flex">
          <SearchPopup onClose={toggleSearch} />
        </div>
      </div>
    </div>
  {/if}
</header>

<style>
  svg {
    color: currentColor;
  }
</style>