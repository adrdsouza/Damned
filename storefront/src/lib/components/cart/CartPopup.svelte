<script lang="ts">
  import { X, ShoppingBag, Minus, Plus, Trash2, ChevronLeft, CreditCard } from "lucide-svelte";
  import { cart, removeFromCart, updateCartItemQuantity, clearCart } from "$lib/stores/cartStore";
  import { user, isAuthenticated } from "$lib/stores/userStore";
  import { products } from "$lib/data/products";
  import { goto } from "$app/navigation";
  import toast from "svelte-french-toast";
  import { getCartTotals, applyDiscountCode } from "$lib/services/medusa/cart.service";
  import { login } from "$lib/stores/userStore";
  
  export let onClose: () => void;
  
  let cartItems = $cart;
  let subtotal = 0;
  let shipping = 0;
  let total = 0;
  let couponCode = "";
  
  let isProcessing = false;
  
  // Checkout form data
  let email = $user?.email || "";
  let firstName = $user?.firstName || "";
  let lastName = $user?.lastName || "";
  let address = "";
  let city = "";
  let state = "";
  let zipCode = "";
  let country = "United States";
  let paymentMethod = "credit";
  let cardNumber = "";
  let cardExpiry = "";
  let cardCvc = "";

  // Login form state
  let showLoginForm = false;
  let loginEmail = "";
  let loginPassword = "";
  let isLoggingIn = false;
  let loginError = "";
  
  // Get featured products for empty cart state
  $: featuredProducts = products.filter(p => p.featured).slice(0, 3);
  
  async function updateTotals() {
    try {
      const totals = await getCartTotals();
      subtotal = totals.subtotal;
      shipping = totals.shipping;
      total = totals.total;
    } catch (error) {
      console.error('Error getting cart totals:', error);
      
      // Fallback calculation
      subtotal = cartItems.reduce((sum, item) => {
        const price = item.variation?.salePrice ?? item.variation?.price ?? item.product.salePrice ?? item.product.price;
        return sum + (price * item.quantity);
      }, 0);
      
      shipping = cartItems.length > 0 ? 10 : 0;
      total = subtotal + shipping;
    }
  }
  
  function handleRemoveItem(productId: number | string, variationId?: string) {
    removeFromCart(productId, variationId);
    updateTotals();
  }
  
  function handleQuantityChange(productId: number | string, newQuantity: number, variationId?: string) {
    if (newQuantity > 0) {
      updateCartItemQuantity(productId, newQuantity, variationId);
      updateTotals();
    }
  }
  
  async function handleCouponApply() {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    
    try {
      await applyDiscountCode(couponCode);
      updateTotals();
    } catch (error) {
      toast.error("Invalid coupon code");
    }
  }
  
  async function handleCheckout() {
    if (!validateForm()) {
      return;
    }
    
    isProcessing = true;
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart and show success message
      clearCart();
      toast.success("Order placed successfully!");
      onClose();
      goto("/");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error processing your order. Please try again.");
    } finally {
      isProcessing = false;
    }
  }
  
  function validateForm() {
    // Basic validation
    if (!email || !firstName || !lastName || !address || !city || !state || !zipCode) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    if (paymentMethod === "credit" && (!cardNumber || !cardExpiry || !cardCvc)) {
      toast.error("Please enter valid payment information");
      return false;
    }
    
    return true;
  }
  
  async function handleLogin() {
    if (!loginEmail || !loginPassword) {
      loginError = "Please enter both email and password";
      return;
    }
    
    isLoggingIn = true;
    loginError = "";
    
    try {
      const success = await login(loginEmail, loginPassword);
      
      if (success) {
        toast.success("Login successful!");
        showLoginForm = false;
        
        // Pre-fill form with user data
        email = $user.email || "";
        firstName = $user.firstName || "";
        lastName = $user.lastName || "";
      } else {
        loginError = "Invalid email or password";
      }
    } catch (error) {
      console.error("Login error:", error);
      loginError = "An error occurred during login";
    } finally {
      isLoggingIn = false;
    }
  }
  
  // Update cart whenever store changes
  $: {
    cartItems = $cart;
    updateTotals();
  }
  
  // Initial totals update
  updateTotals();
</script>

<div class="flex flex-col h-full bg-white">
  {#if cartItems.length === 0}
    <div class="text-center py-8 px-6 flex-grow overflow-y-auto">
      <ShoppingBag size={64} class="mx-auto mb-4 text-gray-400" />
      <h3 class="text-xl font-bold mb-2">Your cart is empty</h3>
      <p class="text-gray-600 mb-8">Start shopping with our featured products below.</p>
      
      <div>
        <div class="grid grid-cols-1 gap-6">
          {#each featuredProducts as product}
            <div class="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow pointer-events-auto">
              <div class="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="ml-4 flex-grow">
                <h4 class="font-bold">{product.name}</h4>
                {#if product.salePrice !== undefined}
                  <p class="text-gray-600 text-sm mb-2">
                    <span class="text-green-600">${product.salePrice.toFixed(2)}</span>
                    <span class="line-through ml-1">${product.price.toFixed(2)}</span>
                  </p>
                {:else}
                  <p class="text-gray-600 text-sm mb-2">${product.price.toFixed(2)}</p>
                {/if}
                <button 
                  class="btn btn-primary text-sm py-2 pointer-events-auto"
                  on:click={() => {
                    onClose();
                    goto(`/products/${product.slug}`);
                  }}
                  on:keydown={(e) => {
                    if (e.key === 'Enter') {
                      onClose();
                      goto(`/products/${product.slug}`);
                    }
                  }}
                >
                  View Product
                </button>
              </div>
            </div>
          {/each}
        </div>
        
        <div class="mt-6 text-center">
          <button 
            class="btn btn-secondary w-full pointer-events-auto"
            on:click={() => {
              onClose();
              goto("/products");
            }}
            on:keydown={(e) => {
              if (e.key === 'Enter') {
                onClose();
                goto("/products");
              }
            }}
          >
            Browse All Products
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Integrated Cart and Checkout -->
    <div class="flex flex-col md:flex-row h-full">
      <!-- Cart Items - Left Side -->
      <div class="w-full md:w-2/5 bg-gray-50 p-4 overflow-y-auto flex flex-col h-full">
        <h3 class="font-bold mb-4 text-lg">Your Items</h3>
        
        <div class="space-y-4 divide-y divide-gray-200 flex-grow overflow-y-auto">
          {#each cartItems as item}
            <div class="pt-4 first:pt-0">
              <div class="flex">
                <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="ml-3 flex-grow">
                  <div class="flex justify-between">
                    <h4 class="font-bold text-sm">{item.product.name}</h4>
                    {#if item.variation?.salePrice !== undefined || item.product.salePrice !== undefined}
                      <p class="font-bold text-green-600 text-sm">
                        ${((item.variation?.salePrice ?? item.product.salePrice) * item.quantity).toFixed(2)}
                      </p>
                    {:else}
                      <p class="font-bold text-sm">
                        ${((item.variation?.price ?? item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    {/if}
                  </div>
                  {#if item.variation}
                    <p class="text-xs text-gray-600">{item.variation.name}</p>
                  {/if}
                  
                  <div class="flex justify-between items-center mt-2">
                    <div class="flex items-center border border-gray-300 rounded-md">
                      <button 
                        class="px-2 py-1 border-r border-gray-300 pointer-events-auto"
                        on:click={() => handleQuantityChange(item.product.id, item.quantity - 1, item.variation?.id)}
                        on:keydown={(e) => e.key === 'Enter' && handleQuantityChange(item.product.id, item.quantity - 1, item.variation?.id)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span class="px-3 py-1">{item.quantity}</span>
                      <button 
                        class="px-2 py-1 border-l border-gray-300 pointer-events-auto"
                        on:click={() => handleQuantityChange(item.product.id, item.quantity + 1, item.variation?.id)}
                        on:keydown={(e) => e.key === 'Enter' && handleQuantityChange(item.product.id, item.quantity + 1, item.variation?.id)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      class="text-red-500 hover:text-red-700 transition-colors pointer-events-auto"
                      on:click={() => handleRemoveItem(item.product.id, item.variation?.id)}
                      on:keydown={(e) => e.key === 'Enter' && handleRemoveItem(item.product.id, item.variation?.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
        
        <!-- Coupon Code and Totals - Now Sticky -->
        <div class="mt-4 pt-4 border-t border-gray-200 bg-gray-50">
          <div class="flex gap-2 mb-4">
            <input 
              type="text" 
              bind:value={couponCode}
              placeholder="Coupon code"
              class="flex-grow px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button 
              class="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700 pointer-events-auto"
              on:click={handleCouponApply}
              on:keydown={(e) => e.key === 'Enter' && handleCouponApply()}
            >
              Apply
            </button>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div class="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div class="border-t border-gray-200 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Checkout Form - Right Side -->
      {#if showLoginForm}
        <div class="w-full md:w-3/5 p-4 overflow-y-auto h-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-lg">Sign In</h3>
            <button 
              class="text-gray-500 hover:text-gray-700"
              on:click={() => showLoginForm = false}
            >
              <X size={20} />
            </button>
          </div>
          
          <form on:submit|preventDefault={handleLogin} class="space-y-4">
            {#if loginError}
              <div class="bg-red-50 border-l-4 border-red-500 p-4">
                <p class="text-red-700">{loginError}</p>
              </div>
            {/if}
            
            <div>
              <label for="loginEmail" class="block mb-2 font-bold text-sm">Email Address</label>
              <input 
                type="email" 
                id="loginEmail" 
                bind:value={loginEmail}
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="your@email.com"
                disabled={isLoggingIn}
              />
            </div>
            
            <div>
              <label for="loginPassword" class="block mb-2 font-bold text-sm">Password</label>
              <input 
                type="password" 
                id="loginPassword" 
                bind:value={loginPassword}
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
                disabled={isLoggingIn}
              />
            </div>
            
            <button type="submit" class="btn btn-primary w-full" disabled={isLoggingIn}>{isLoggingIn ? 'Signing in...' : 'Sign In'}</button>
          </form>
        </div>
      {:else}
      <div class="w-full md:w-3/5 p-4 overflow-y-auto h-full">
        <div class="flex justify-between items-center mb-4">
          <div class="flex justify-between items-center w-full">
            {#if !$isAuthenticated}
              <button 
                class="text-primary hover:underline text-sm"
                on:click={() => showLoginForm = true}
              >
                Existing customer? Sign in
              </button>
            {:else}
              <div class="text-sm text-gray-600">
                Signed in as {$user.email}
              </div>
            {/if}
          </div>
          <button 
            class="text-gray-500 hover:text-gray-700"
            tabindex="0"
            on:click={onClose}
            on:keydown={(e) => e.key === 'Enter' && onClose()}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>
        <form class="space-y-4">
          <!-- Contact Information -->
          <div>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <input 
                  type="email" 
                  id="email" 
                  bind:value={email}
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Email Address *"
                />
              </div>
              <div>
                <input 
                  type="tel" 
                  id="phone" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Phone Number *"
                />
              </div>
            </div>
          </div>
          
          <!-- Shipping Information -->
          <div>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <input 
                  type="text" 
                  id="firstName" 
                  bind:value={firstName}
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="First Name *"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  id="lastName" 
                  bind:value={lastName}
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Last Name *"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <input 
                  type="text" 
                  id="address1" 
                  bind:value={address}
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Address Line 1 *"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  id="address2" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Address Line 2 (Optional)"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <input 
                  type="text" 
                  id="city" 
                  bind:value={city}
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="City *"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  id="state" 
                  bind:value={state}
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="State *"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <input 
                  type="text" 
                  id="zipCode" 
                  bind:value={zipCode}
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="ZIP Code *"
                />
              </div>
              <div class="w-full">
                <select 
                  id="country" 
                  bind:value={country}
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Payment Information -->
          <div class="mt-3">
            <div class="space-y-3">
              <label class="flex items-center">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="credit" 
                  bind:group={paymentMethod}
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span class="ml-2 text-sm">Credit Card</span>
              </label>
              
              <label class="flex items-center">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="paypal" 
                  bind:group={paymentMethod}
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
                <span class="ml-2 text-sm">PayPal</span>
              </label>
            </div>
            
            {#if paymentMethod === 'credit'}
              <div class="mt-3 space-y-3">
                <div>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    bind:value={cardNumber}
                    placeholder="Card Number *"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <input 
                      type="text" 
                      id="cardExpiry" 
                      bind:value={cardExpiry}
                      placeholder="Expiration (MM/YY) *"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <input 
                      type="text" 
                      id="cardCvc" 
                      bind:value={cardCvc}
                      placeholder="CVC *"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            {:else if paymentMethod === 'paypal'}
              <div class="mt-3 bg-gray-50 p-3 rounded-md text-center">
                <p class="mb-2 text-sm">You'll be redirected to PayPal to complete your payment.</p>
                <img src="/images/paypal-logo.png" alt="PayPal" class="h-8 mx-auto"/>
              </div>
            {/if}
          </div>
        </form>
        
        <!-- Place Order Button -->
        <div class="mt-6 sticky bottom-0 bg-white pt-4 border-t border-gray-200 mb-2">
          <button 
            class="btn btn-primary w-full pointer-events-auto"
            on:click={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Place Order • $${total.toFixed(2)}`}
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2 text-center">
          By completing your purchase, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
      {/if}
    </div>
  {/if}
</div>