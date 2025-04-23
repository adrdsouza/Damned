<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user, isAuthenticated, logout } from "$lib/stores/userStore";
  import { ShoppingBag, User, LogOut, Package, Settings, CreditCard, ChevronRight } from "lucide-svelte";
  
  let activeTab = "orders";
  
  onMount(() => {
    // If not authenticated, redirect to login page
    if (!$isAuthenticated) {
      goto("/login");
    } else {
      // Fetch fresh order data if possible
      import('$lib/services/medusa/customer.service')
        .then(({ getCustomerOrders }) => {
          getCustomerOrders().catch(err => console.error("Error fetching orders:", err));
        })
        .catch(err => console.error("Error importing service:", err));
    }
  });
  
  function handleLogout() {
    logout();
    goto("/");
  }
</script>

<svelte:head>
  <title>My Account | Damned Designs</title>
  <meta name="description" content="Manage your Damned Designs account, view orders, and update your profile." />
</svelte:head>

<div class="container py-12">
  {#if $user}
    <h1 class="text-3xl font-bold mb-8">My Account</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Sidebar -->
      <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
            <User size={24} />
          </div>
          <div class="ml-4">
            <p class="font-bold">{$user.firstName} {$user.lastName}</p>
            <p class="text-sm text-gray-600">{$user.email}</p>
          </div>
        </div>
        
        <nav class="space-y-2">
          <button 
            class={`w-full flex items-center p-3 rounded-md transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
            on:click={() => activeTab = 'orders'}
          >
            <ShoppingBag size={18} class="mr-3" />
            <span>My Orders</span>
          </button>
          
          <button 
            class={`w-full flex items-center p-3 rounded-md transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
            on:click={() => activeTab = 'profile'}
          >
            <User size={18} class="mr-3" />
            <span>Profile</span>
          </button>
          
          <button 
            class={`w-full flex items-center p-3 rounded-md transition-colors ${activeTab === 'addresses' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
            on:click={() => activeTab = 'addresses'}
          >
            <Package size={18} class="mr-3" />
            <span>Addresses</span>
          </button>
          
          <button 
            class={`w-full flex items-center p-3 rounded-md transition-colors ${activeTab === 'payment' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
            on:click={() => activeTab = 'payment'}
          >
            <CreditCard size={18} class="mr-3" />
            <span>Payment Methods</span>
          </button>
          
          <button 
            class={`w-full flex items-center p-3 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-gray-200'}`}
            on:click={() => activeTab = 'settings'}
          >
            <Settings size={18} class="mr-3" />
            <span>Account Settings</span>
          </button>
          
          <button 
            class="w-full flex items-center p-3 rounded-md text-red-500 hover:bg-red-50 transition-colors"
            on:click={handleLogout}
          >
            <LogOut size={18} class="mr-3" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
      
      <!-- Main Content -->
      <div class="md:col-span-3 bg-white p-6 rounded-lg shadow-sm">
        {#if activeTab === 'orders'}
          <h2 class="text-2xl font-bold mb-6">My Orders</h2>
          
          {#if $user.orders.length === 0}
            <div class="text-center py-8">
              <ShoppingBag size={48} class="mx-auto mb-4 text-gray-400" />
              <p class="text-xl font-bold mb-2">No orders yet</p>
              <p class="text-gray-600 mb-6">You haven't placed any orders yet.</p>
              <a href="/products" class="btn btn-primary">Browse Products</a>
            </div>
          {:else}
            <div class="space-y-6">
              {#each $user.orders as order}
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <div class="bg-gray-50 p-4 flex flex-wrap justify-between items-center">
                    <div>
                      <p class="font-bold">Order #{order.id}</p>
                      <p class="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div class="flex items-center">
                      <span class={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <span class="ml-4 font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div class="p-4">
                    <h3 class="font-bold mb-3">Items</h3>
                    <div class="space-y-3">
                      {#each order.items as item}
                        <div class="flex items-center">
                          <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              class="w-full h-full object-cover"
                            />
                          </div>
                          <div class="ml-4 flex-grow">
                            <p class="font-medium">{item.name}</p>
                            <p class="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div class="text-right">
                            <p class="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                            <p class="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                  
                  <div class="bg-gray-50 p-4 flex justify-end">
                    <a href={`/account/orders/${order.id}`} class="btn btn-primary">
                      View Order Details
                    </a>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        {:else if activeTab === 'profile'}
          <h2 class="text-2xl font-bold mb-6">Profile Information</h2>
          <form class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block mb-2 font-bold">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  value={$user.firstName}
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label for="lastName" class="block mb-2 font-bold">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  value={$user.lastName}
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            
            <div>
              <label for="email" class="block mb-2 font-bold">Email</label>
              <input 
                type="email" 
                id="email" 
                value={$user.email}
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label for="phone" class="block mb-2 font-bold">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                placeholder="(123) 456-7890"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div class="pt-4">
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
          
          <div class="mt-10 pt-6 border-t border-gray-200">
            <h3 class="text-xl font-bold mb-4">Change Password</h3>
            <form class="space-y-6">
              <div>
                <label for="currentPassword" class="block mb-2 font-bold">Current Password</label>
                <input 
                  type="password" 
                  id="currentPassword" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label for="newPassword" class="block mb-2 font-bold">New Password</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label for="confirmPassword" class="block mb-2 font-bold">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <button type="submit" class="btn btn-primary">Update Password</button>
              </div>
            </form>
          </div>
        {:else if activeTab === 'addresses'}
          <h2 class="text-2xl font-bold mb-6">Saved Addresses</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Primary Address Card -->
            <div class="border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-bold">Home Address</h3>
                  <p class="text-sm text-gray-600">Primary</p>
                </div>
                <div class="flex space-x-2">
                  <button class="text-primary hover:text-gray-700">Edit</button>
                  <button class="text-red-600 hover:text-red-800">Remove</button>
                </div>
              </div>
              <div class="text-gray-700">
                <p>{$user.firstName} {$user.lastName}</p>
                <p>123 Main Street</p>
                <p>Anytown, CA 12345</p>
                <p>United States</p>
              </div>
            </div>
            
            <!-- Add New Address Card -->
            <div class="border border-gray-200 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <Package size={32} class="text-gray-400 mb-2" />
              <h3 class="font-bold mb-2">Add New Address</h3>
              <p class="text-sm text-gray-600 mb-4">Save multiple addresses for faster checkout</p>
              <button class="btn btn-primary">Add Address</button>
            </div>
          </div>
        {:else if activeTab === 'payment'}
          <h2 class="text-2xl font-bold mb-6">Payment Methods</h2>
          <div class="text-center py-8">
            <CreditCard size={48} class="mx-auto mb-4 text-gray-400" />
            <p class="text-xl font-bold mb-2">No payment methods saved</p>
            <p class="text-gray-600 mb-6">You haven't saved any payment methods yet.</p>
            <button class="btn btn-primary">Add Payment Method</button>
          </div>
        {:else if activeTab === 'settings'}
          <h2 class="text-2xl font-bold mb-6">Account Settings</h2>
          <div class="space-y-6">
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-bold mb-3">Email Preferences</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="newsletter" 
                    checked
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label for="newsletter" class="ml-2 block">
                    Subscribe to newsletter
                  </label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="orderUpdates" 
                    checked
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label for="orderUpdates" class="ml-2 block">
                    Order status updates
                  </label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="promotions" 
                    checked
                    class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label for="promotions" class="ml-2 block">
                    Promotions and special offers
                  </label>
                </div>
              </div>
              <div class="mt-4">
                <button class="btn btn-primary">Save Preferences</button>
              </div>
            </div>
            
            <div class="border-t border-gray-200 pt-6">
              <h3 class="text-lg font-bold mb-3 text-red-600">Danger Zone</h3>
              <button class="btn btn-outline border-red-500 text-red-500 hover:bg-red-50">
                Delete Account
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>