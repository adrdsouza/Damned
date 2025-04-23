<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user, isAuthenticated } from "$lib/stores/userStore";
  import { ChevronRight, ArrowLeft, Truck, Package, AlertTriangle, FileEdit as Edit, Home } from "lucide-svelte";
  import toast from "svelte-french-toast";
  
  export let data;
  
  let order = data.order;
  let cancelReasonOpen = false;
  let addressChangeOpen = false;
  let cancelReason = "";
  let newAddress = {
    address1: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: ""
  };
  
  $: canCancel = ['pending', 'processing'].includes(order.status);
  $: canUpdateAddress = ['pending', 'processing'].includes(order.status) && !order.shipped;
  $: formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
  
  onMount(() => {
    // If not authenticated, redirect to login page
    if (!$isAuthenticated) {
      goto("/login");
    }
  });
  
  function submitCancelRequest() {
    if (!cancelReason) {
      toast.error("Please provide a reason for cancellation");
      return;
    }
    
    // Here you would send the cancellation request to Medusa
    // For now we'll just show a success message
    toast.success("Cancellation request submitted. We'll review it shortly.");
    cancelReasonOpen = false;
  }
  
  function submitAddressChange() {
    if (!newAddress.address1 || !newAddress.city || 
        !newAddress.state || !newAddress.postcode || !newAddress.country) {
      toast.error("Please complete all required address fields");
      return;
    }
    
    // Here you would send the address change request to Medusa
    // For now we'll just show a success message  
    toast.success("Address change request submitted. We'll update your order if possible.");
    addressChangeOpen = false;
  }
  
  // Get the status timeline based on current order status
  function getStatusTimeline() {
    const allStatuses = [
      { key: 'pending', label: 'Order Placed', description: 'We received your order' },
      { key: 'processing', label: 'Processing', description: 'Your order is being processed' },
      { key: 'shipped', label: 'Shipped', description: 'Your order is on the way' },
      { key: 'delivered', label: 'Delivered', description: 'Your order has been delivered' }
    ];
    
    // Find current status index
    const currentIndex = allStatuses.findIndex(status => status.key === order.status);
    
    // Add 'complete' class to all completed statuses
    return allStatuses.map((status, index) => ({
      ...status,
      complete: index <= currentIndex,
      current: status.key === order.status
    }));
  }
  
  $: statusTimeline = getStatusTimeline();
</script>

<svelte:head>
  <title>Order #{order.id} | Damned Designs</title>
  <meta name="description" content="View your order details and status" />
</svelte:head>

<div class="container py-12">
  <div class="flex items-center text-sm mb-6">
    <a href="/" class="hover:underline">
      <Home size={14} class="inline mb-0.5" />
    </a>
    <ChevronRight size={14} class="mx-1" />
    <a href="/account" class="hover:underline">My Account</a>
    <ChevronRight size={14} class="mx-1" />
    <span>Order #{order.id}</span>
  </div>
  
  <div class="flex items-center mb-8">
    <button 
      class="flex items-center text-gray-600 hover:text-gray-900"
      on:click={() => goto('/account')}
    >
      <ArrowLeft size={16} class="mr-1" />
      <span>Back to Orders</span>
    </button>
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Order Details Column -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Order Header -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="flex flex-wrap justify-between items-start mb-4">
          <div>
            <h1 class="text-2xl font-bold">Order #{order.id}</h1>
            <p class="text-gray-600">Placed on {formattedDate}</p>
          </div>
          <div>
            <span 
              class={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>
        
        <!-- Order Timeline -->
        <div class="mb-8">
          <div class="flex items-center justify-between relative text-sm">
            <!-- Progress Bar -->
            <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
            <div 
              class="absolute top-1/2 left-0 h-0.5 bg-green-500 -z-10" 
              style={`width: ${statusTimeline.filter(s => s.complete).length / statusTimeline.length * 100}%`}
            ></div>
            
            {#each statusTimeline as status, i}
              <div class="flex flex-col items-center">
                <div 
                  class={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    status.complete ? 
                      'bg-green-500 text-white' : 
                      'bg-gray-200 text-gray-400'
                  }`}
                >
                  {#if status.complete}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  {:else}
                    {i + 1}
                  {/if}
                </div>
                <div class={`font-medium ${status.current ? 'text-green-600' : ''}`}>
                  {status.label}
                </div>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-4 mt-6">
          {#if canCancel}
            <button 
              class="btn btn-outline border-red-500 text-red-500 hover:bg-red-50 flex-1 pointer-events-auto"
              on:click={() => cancelReasonOpen = true}
            >
              <AlertTriangle size={16} class="mr-2" /> 
              Request Cancellation
            </button>
          {:else}
            <button 
              class="btn btn-outline border-gray-300 text-gray-400 flex-1 pointer-events-auto"
              disabled
              title="Order cannot be cancelled at this time"
            >
              <AlertTriangle size={16} class="mr-2" /> 
              Request Cancellation
            </button>
          {/if}
          
          {#if canUpdateAddress}
            <button 
              class="btn btn-outline border-primary text-primary hover:bg-gray-50 flex-1 pointer-events-auto"
              on:click={() => addressChangeOpen = true}
            >
              <Edit size={16} class="mr-2" /> 
              Update Address
            </button>
          {:else}
            <button 
              class="btn btn-outline border-gray-300 text-gray-400 flex-1 pointer-events-auto"
              disabled
              title="Address cannot be changed at this time"
            >
              <Edit size={16} class="mr-2" /> 
              Update Address
            </button>
          {/if}
        </div>
      </div>
      
      <!-- Order Items -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-bold mb-6">Order Items</h2>
        <div class="space-y-6">
          {#each order.items as item}
            <div class="flex border-b border-gray-100 pb-6 last:border-0 last:pb-0 first:mt-0 mt-6">
              <div class="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="ml-6 flex-grow">
                <div class="flex justify-between">
                  <div>
                    <h3 class="font-bold text-lg">{item.name}</h3>
                    <p class="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    <p class="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Shipping Information -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-bold mb-6">Shipping Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 class="font-bold mb-3 text-lg flex items-center">
              <Truck size={18} class="mr-2" />
              Shipping Address
            </h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p>{order.shippingAddress?.name || ($user ? `${$user.firstName} ${$user.lastName}` : 'John Doe')}</p>
              <p>{order.shippingAddress?.address_1 || '123 Main Street'}</p>
              {#if order.shippingAddress?.address_2}
                <p>{order.shippingAddress.address_2}</p>
              {/if}
              <p>{order.shippingAddress?.city || 'Anytown'}, {order.shippingAddress?.province || 'CA'} {order.shippingAddress?.postal_code || '12345'}</p>
              <p>{order.shippingAddress?.country_code === 'US' ? 'United States' : 
                 order.shippingAddress?.country_code === 'CA' ? 'Canada' : 
                 order.shippingAddress?.country_code === 'GB' ? 'United Kingdom' :
                 order.shippingAddress?.country_code === 'AU' ? 'Australia' : 
                 'United States'}</p>
            </div>
          </div>
          
          <div>
            <h3 class="font-bold mb-3 text-lg flex items-center">
              <Package size={18} class="mr-2" />
              Shipping Method
            </h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="font-medium">Standard Shipping</p>
              <p class="text-gray-600">Estimated delivery: 3-5 business days</p>
              {#if order.status === 'shipped' || order.status === 'delivered'}
                <div class="mt-4 pt-4 border-t border-gray-200">
                  <p class="font-medium">Tracking Number</p>
                  <p class="text-primary hover:underline">
                    <a href="https://track.carrier.com/{order.trackingNumber || '123456789'}" target="_blank" rel="noopener noreferrer">
                      {order.trackingNumber || '123456789'}
                    </a>
                  </p>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Order Summary Column -->
    <div class="lg:col-span-1">
      <div class="bg-white p-6 rounded-lg shadow-sm sticky top-24">
        <h2 class="text-xl font-bold mb-4">Order Summary</h2>
        
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Subtotal</span>
            <span>${(order.total * 0.9).toFixed(2)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Shipping</span>
            <span>${(order.total * 0.1).toFixed(2)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Tax</span>
            <span>$0.00</span>
          </div>
          <div class="pt-3 border-t border-gray-200 mt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="mt-8">
          <h3 class="font-bold mb-2">Need Help?</h3>
          <p class="text-sm text-gray-600 mb-4">
            If you have any questions about your order, please contact our customer service team.
          </p>
          <a href="/contact" class="btn btn-primary w-full pointer-events-auto">Contact Us</a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Cancel Request Modal -->
{#if cancelReasonOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 pointer-events-auto">
    <div class="bg-white rounded-lg max-w-lg w-full p-6 relative pointer-events-auto">
      <button 
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 pointer-events-auto"
        on:click={() => cancelReasonOpen = false}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <h2 class="text-xl font-bold mb-4">Request Order Cancellation</h2>
      <p class="mb-4 text-gray-600">
        Please provide a reason for your cancellation request. Note that we can only cancel orders that haven't been shipped yet.
      </p>
      
      <div class="mb-4">
        <label for="cancelReason" class="block font-bold mb-2">Cancellation Reason</label>
        <select 
          id="cancelReason" 
          bind:value={cancelReason}
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto"
        >
          <option value="">Select a reason</option>
          <option value="mistake">Ordered by mistake</option>
          <option value="dupe">Duplicate order</option>
          <option value="payment">Payment issues</option>
          <option value="found">Found a better price elsewhere</option>
          <option value="changed_mind">Changed my mind</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      {#if cancelReason === 'other'}
        <div class="mb-4">
          <label for="cancelDetails" class="block font-bold mb-2">Additional Details</label>
          <textarea 
            id="cancelDetails" 
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto"
            placeholder="Please provide more details about your cancellation request"
          ></textarea>
        </div>
      {/if}
      
      <div class="flex justify-end space-x-4">
        <button 
          class="px-4 py-2 text-gray-600 hover:text-gray-800 pointer-events-auto"
          on:click={() => cancelReasonOpen = false}
        >
          Cancel
        </button>
        <button 
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 pointer-events-auto"
          on:click={submitCancelRequest}
        >
          Submit Request
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Address Change Modal -->
{#if addressChangeOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 pointer-events-auto">
    <div class="bg-white rounded-lg max-w-lg w-full p-6 relative pointer-events-auto">
      <button 
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 pointer-events-auto"
        on:click={() => addressChangeOpen = false}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <h2 class="text-xl font-bold mb-4">Update Shipping Address</h2>
      <p class="mb-4 text-gray-600">
        Please provide your new shipping address. We can only update the address if your order hasn't been shipped yet.
      </p>
      
      <div class="space-y-4">
        <div>
          <label for="address1" class="block font-bold mb-2">Address Line 1</label>
          <input 
            id="address1" 
            bind:value={newAddress.address1}
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto"
            placeholder="Street address"
          />
        </div>
        
        <div>
          <label for="address2" class="block font-bold mb-2">Address Line 2 (optional)</label>
          <input 
            id="address2" 
            bind:value={newAddress.address2}
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto"
            placeholder="Apt, suite, unit, etc."
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="city" class="block font-bold mb-2">City</label>
            <input 
              id="city" 
              bind:value={newAddress.city}
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto"
            />
          </div>
          <div>
            <label for="state" class="block font-bold mb-2">State/Province</label>
            <input 
              id="state" 
              bind:value={newAddress.state}
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto"
            />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="postcode" class="block font-bold mb-2">Postal/Zip Code</label>
            <input 
              id="postcode" 
              bind:value={newAddress.postcode}
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto"
            />
          </div>
          <div>
            <label for="country" class="block font-bold mb-2">Country</label>
            <select 
              id="country" 
              bind:value={newAddress.country}
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto"
            >
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-4 mt-6">
        <button 
          class="px-4 py-2 text-gray-600 hover:text-gray-800 pointer-events-auto"
          on:click={() => addressChangeOpen = false}
        >
          Cancel
        </button>
        <button 
          class="px-4 py-2 bg-primary text-white rounded hover:bg-gray-800 pointer-events-auto"
          on:click={submitAddressChange}
        >
          Submit Request
        </button>
      </div>
    </div>
  </div>
{/if}