<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user, isAuthenticated } from "$lib/stores/userStore";
  import { clearCart } from "$lib/stores/cartStore";
  import { ChevronRight, Check, Package, Truck, Calendar, ChevronDown, Mail, Home } from "lucide-svelte";
  import { fade, fly } from "svelte/transition";
  
  export let data;
  
  let showOrderDetails = false;
  let isLoading = true;
  
  // Mock order data - in a real application, you would fetch this from Medusa
  // based on the order ID that was returned after successful checkout
  let order = {
    id: data.orderId || '123456789',
    date: new Date().toISOString(),
    status: 'processing',
    total: 279.97,
    subtotal: 249.98,
    shipping: 29.99,
    tax: 0,
    items: [
      {
        id: 1,
        name: 'Djinn XL Titanium',
        price: 199.99,
        quantity: 1,
        image: '/images/products/djinn-xl.jpg'
      },
      {
        id: 2,
        name: 'EDC Organizer Pouch',
        price: 29.99,
        quantity: 1,
        image: '/images/products/pouch.jpg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address1: '123 Main St',
      address2: 'Apt 4B',
      city: 'Anytown',
      state: 'CA',
      postcode: '12345',
      country: 'United States'
    },
    shippingMethod: 'Standard Shipping',
    paymentMethod: 'Credit Card ending in 1234'
  };
  
  // Format date for display
  $: formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
  
  // Estimated delivery date (7 days from now)
  $: estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
  
  onMount(() => {
    // Clear cart on successful order
    clearCart();
    
    // Simulate loading delay for order details
    setTimeout(() => {
      isLoading = false;
    }, 1000);
  });
</script>

<svelte:head>
  <title>Order Confirmation | Damned Designs</title>
  <meta name="description" content="Thank you for your order at Damned Designs. Your premium EDC gear is on its way." />
</svelte:head>

<div class="container py-12">
  <div class="flex items-center text-sm mb-6">
    <a href="/" class="hover:underline">
      <Home size={14} class="inline mb-0.5" />
    </a>
    <ChevronRight size={14} class="mx-1" />
    <a href="/checkout" class="hover:underline">Checkout</a>
    <ChevronRight size={14} class="mx-1" />
    <span>Confirmation</span>
  </div>
  
  {#if isLoading}
    <div class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  {:else}
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
            <Check size={32} class="text-green-600" />
          </div>
        </div>
        
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold mb-2">Thank you for your order!</h1>
          <p class="text-gray-600">
            Your order #{order.id} has been confirmed and is now being processed.
          </p>
          {#if $isAuthenticated}
            <p class="text-gray-600 mt-2">
              You can track the status of your order in <a href="/account" class="text-primary hover:underline">your account</a>.
            </p>
          {/if}
        </div>
        
        <div class="border-t border-b border-gray-200 py-6 mb-6">
          <div class="flex flex-wrap gap-y-4">
            <div class="w-full md:w-1/3 flex md:mb-0">
              <Calendar size={20} class="text-primary mr-3 flex-shrink-0 mt-1" />
              <div>
                <p class="font-bold">Order Date</p>
                <p class="text-gray-600">{formattedDate}</p>
              </div>
            </div>
            <div class="w-full md:w-1/3 flex md:mb-0">
              <Truck size={20} class="text-primary mr-3 flex-shrink-0 mt-1" />
              <div>
                <p class="font-bold">Estimated Delivery</p>
                <p class="text-gray-600">{estimatedDelivery}</p>
              </div>
            </div>
            <div class="w-full md:w-1/3 flex">
              <Mail size={20} class="text-primary mr-3 flex-shrink-0 mt-1" />
              <div>
                <p class="font-bold">Confirmation Email</p>
                <p class="text-gray-600">{$user?.email || 'your@email.com'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          class="flex justify-between items-center w-full py-3"
          on:click={() => showOrderDetails = !showOrderDetails}
        >
          <span class="font-bold text-lg">Order Details</span>
          <ChevronDown 
            size={20} 
            class="transition-transform duration-300" 
            style={showOrderDetails ? 'transform: rotate(180deg)' : ''}
          />
        </button>
        
        {#if showOrderDetails}
          <div class="pt-4" transition:fly={{ duration: 300, y: -20 }}>
            <!-- Order Items -->
            <div class="mb-6">
              <h2 class="font-bold mb-4">Items</h2>
              <div class="space-y-4">
                {#each order.items as item}
                  <div class="flex border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="ml-4 flex-grow">
                      <div class="flex justify-between">
                        <div>
                          <h3 class="font-bold">{item.name}</h3>
                          <p class="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div class="text-right">
                          <p class="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
            
            <!-- Shipping Address -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 class="font-bold mb-4">Shipping Address</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address1}</p>
                  {#if order.shippingAddress.address2}
                    <p>{order.shippingAddress.address2}</p>
                  {/if}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postcode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
              <div>
                <h2 class="font-bold mb-4">Payment Information</h2>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p><span class="font-semibold">Method:</span> {order.paymentMethod}</p>
                  <p><span class="font-semibold">Shipping:</span> {order.shippingMethod}</p>
                </div>
              </div>
            </div>
            
            <!-- Order Summary -->
            <div>
              <h2 class="font-bold mb-4">Order Summary</h2>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  {#if order.tax > 0}
                    <div class="flex justify-between">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                  {/if}
                  <div class="pt-2 border-t border-gray-200 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
      
      <div class="text-center space-y-6">
        <h2 class="text-xl font-bold">What's Next?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <Mail size={32} class="text-primary mb-3" />
            <h3 class="font-bold mb-2">Check Your Email</h3>
            <p class="text-gray-600 text-sm">We've sent a confirmation email with your order details.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <Package size={32} class="text-primary mb-3" />
            <h3 class="font-bold mb-2">Track Your Order</h3>
            <p class="text-gray-600 text-sm">You'll receive shipping updates when your order is on its way.</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
            <Truck size={32} class="text-primary mb-3" />
            <h3 class="font-bold mb-2">Delivery</h3>
            <p class="text-gray-600 text-sm">Your order should arrive within 5-7 business days.</p>
          </div>
        </div>
        <div class="pt-8">
          <a href="/products" class="btn btn-primary">Continue Shopping</a>
        </div>
      </div>
    </div>
  {/if}
</div>