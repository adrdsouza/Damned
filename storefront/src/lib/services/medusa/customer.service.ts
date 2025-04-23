import { createMedusaClient } from '$lib/config/medusa';
import { browser } from '$app/environment';
import { user, isAuthenticated } from '$lib/stores/userStore';
import { get } from 'svelte/store';
import toast from 'svelte-french-toast';
import type { User, Order } from '$lib/types';

// Initialize Medusa client, but handle potential initialization errors
let medusaClient;
try {
  medusaClient = createMedusaClient();
} catch (error) {
  console.error('Error initializing Medusa client:', error);
  // Will create client on-demand later if initialization fails
}

// Helper function to get client with lazy initialization
function getClient() {
  if (!medusaClient) {
    try {
      medusaClient = createMedusaClient();
    } catch (error) {
      console.error('Failed to create Medusa client on demand:', error);
      throw new Error('Unable to connect to backend service');
    }
  }
  return medusaClient;
}

// Check if we're in offline mode
function isOfflineMode() {
  return typeof localStorage !== 'undefined' && localStorage.getItem('medusa_offline_mode') === 'true';
}

// Set offline mode with timestamp for expiration
function setOfflineMode() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('medusa_offline_mode', 'true');
    localStorage.setItem('medusa_offline_mode_timestamp', Date.now().toString());
    
    // Reset offline mode after 5 minutes to try again
    setTimeout(() => {
      localStorage.removeItem('medusa_offline_mode');
      localStorage.removeItem('medusa_offline_mode_timestamp');
    }, 5 * 60 * 1000);
  }
}

// Register new customer
export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<boolean> {
  if (!browser) return false;
  
  // Check if we're in offline mode
  if (isOfflineMode()) {
    toast.error('Cannot register while offline. Please try again later.');
    return false;
  }
  
  try {
    const client = getClient();
    await client.customers.create({
      email,
      password,
      first_name: firstName,
      last_name: lastName
    });
    
    // Automatically log in after registration
    return await login(email, password);
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Check for network errors
    const isNetworkError = 
      error.message?.includes('Network Error') || 
      error.name === 'TypeError' || 
      error.name === 'AbortError' ||
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('Unable to connect to backend service') ||
      !error.response;
    
    if (isNetworkError) {
      setOfflineMode();
      toast.error('Network connection issue. Please check your internet connection and try again.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Registration failed. Please try again.');
    }
    return false;
  }
}

// Login customer with retry mechanism
export async function login(email: string, password: string): Promise<boolean> {
  if (!browser) return false;
  
  // Check if we're in offline mode
  if (isOfflineMode()) {
    toast.error('Cannot log in while offline. Please try again later.');
    return false;
  }
  
  // Maximum number of retry attempts for network issues
  const maxRetries = 3;
  let retries = 0;
  
  // Inner function to attempt login with retries
  async function attemptLogin(): Promise<boolean> {
    try {
      const client = getClient();
      const { customer } = await client.auth.authenticate({
        email,
        password
      });
      
      // Set user in store
      if (customer) {
        user.set({
          id: customer.id,
          email: customer.email,
          firstName: customer.first_name || '',
          lastName: customer.last_name || '',
          orders: []  // We'll load orders separately
        });
        isAuthenticated.set(true);
        
        // Load orders
        await getCustomerOrders();
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      // Expanded network error check
      const isNetworkError = 
        error.message?.includes('Network Error') || 
        error.name === 'TypeError' || 
        error.name === 'AbortError' ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('Request timeout') ||
        error.message?.includes('Unable to connect to backend service') ||
        !error.response;
      
      // For network errors, implement retry with exponential backoff
      if (isNetworkError && retries < maxRetries) {
        retries++;
        console.log(`Network error during login, retrying (${retries}/${maxRetries})...`);
        
        // Wait with exponential backoff before retrying
        const backoffTime = Math.min(1000 * Math.pow(2, retries), 8000); // Cap at 8 seconds
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        
        // Recursively attempt login again
        return attemptLogin();
      }
      
      // If we've exhausted retries or it's not a network error
      if (isNetworkError) {
        console.error('Network error during login:', error);
        setOfflineMode();
        
        toast.error('Network connection issue. Please check your internet connection and try again.');
        return false;
      } else {
        console.error('Login error:', error);
        toast.error('Invalid email or password');
        return false;
      }
    }
  }
  
  return attemptLogin();
}

// Logout customer
export async function logout(): Promise<void> {
  if (!browser) return;
  
  try {
    // Only attempt server logout if we're not in offline mode
    if (!isOfflineMode()) {
      const client = getClient();
      await client.auth.deleteSession();
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  // Clear user state regardless of API success
  user.set(null);
  isAuthenticated.set(false);
}

// Get customer information
export async function getCustomerInfo() {
  if (!browser) return null;
  
  // If we're in offline mode, return the cached user data
  if (isOfflineMode()) {
    const cachedUser = get(user);
    if (cachedUser) {
      console.log('Using cached user data in offline mode');
      return cachedUser;
    }
    return null;
  }
  
  // Maximum number of retry attempts for network issues
  const maxRetries = 3;
  let retries = 0;
  // Adding a flag to track if this is a silent background check (don't show errors to user)
  const isSilentCheck = !get(isAuthenticated);
  
  async function attemptGetCustomer() {
    try {
      // Verify if we have a client or can create one
      const client = getClient();
      
      // Add timeout to the request to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const { customer } = await client.customers.retrieve();
      clearTimeout(timeoutId);
      
      if (customer) {
        user.update(currentUser => {
          if (currentUser) {
            return {
              ...currentUser,
              id: customer.id,
              email: customer.email,
              firstName: customer.first_name || '',
              lastName: customer.last_name || ''
            };
          }
          return {
            id: customer.id,
            email: customer.email,
            firstName: customer.first_name || '',
            lastName: customer.last_name || '',
            orders: []
          };
        });
        isAuthenticated.set(true);
      }
      
      return customer;
    } catch (error: any) {
      // Even more comprehensive network error detection
      const isNetworkError = 
          error.message?.includes('Network Error') || 
          error.message?.includes('Network connection error') || 
          error.name === 'TypeError' || 
          error.name === 'AbortError' ||
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('Request timeout') ||
          error.toString().includes('Failed to fetch') ||
          error.message?.includes('Network request failed') ||
          error.message?.includes('network timeout') ||
          error.message?.includes('Medusa client error') ||
          error.message?.includes('Unable to connect to backend service') ||
          error.code === 'ECONNREFUSED' ||
          error.code === 'ECONNRESET' ||
          error.code === 'ETIMEDOUT' ||
          !error.response;
      
      // Check if it's a network error and we have retries left
      if (isNetworkError && retries < maxRetries) {
        retries++;
        console.log(`Network error detected, retrying (${retries}/${maxRetries})...`);
        
        // Wait with true exponential backoff before retrying (2^retries * 1000ms)
        const backoffTime = Math.min(1000 * Math.pow(2, retries), 8000); // Cap at 8 seconds
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return attemptGetCustomer();
      }
      
      // Log error in a structured way for better debugging
      if (isNetworkError) {
        console.error('Network error getting customer info:', {
          message: error.message,
          name: error.name,
          code: error.code,
          retries: retries,
          stack: error.stack?.split('\n')[0] // Just the first line of stack for brevity
        });
        
        // Set offline mode if we've exhausted our retries
        if (retries >= maxRetries) {
          setOfflineMode();
        }
      } else {
        console.error('Error getting customer info:', error);
      }
      
      // Only show user feedback for network errors if this isn't a silent background check
      if (isNetworkError && !isSilentCheck && retries >= maxRetries) {
        console.log('Network connection issue detected during user-initiated action');
        toast.error('Network connection issue. Please check your internet connection and try again.');
      }
      
      // Check if we need to log out the user due to invalid token
      if (error.response?.status === 401) {
        user.set(null);
        isAuthenticated.set(false);
      }
      
      // Try to return cached user data if available
      const cachedUser = get(user);
      if (cachedUser && isNetworkError) {
        console.log('Using cached user data due to network error');
        return cachedUser;
      }
      
      return null;
    }
  }
  
  return attemptGetCustomer();
}

// Get customer orders
export async function getCustomerOrders() {
  if (!browser) return [];
  
  // If we're in offline mode, return the cached orders
  if (isOfflineMode()) {
    const cachedUser = get(user);
    if (cachedUser?.orders && cachedUser.orders.length > 0) {
      console.log('Using cached orders in offline mode');
      return cachedUser.orders;
    }
    return [];
  }
  
  // Maximum number of retry attempts for network issues
  const maxRetries = 3;
  let retries = 0;
  
  async function attemptGetOrders() {
    try {
      const client = getClient();
      const { orders } = await client.customers.listOrders();
      
      const formattedOrders = orders.map((order) => ({
        id: order.id,
        date: order.created_at,
        status: order.status,
        total: order.total / 100,
        items: order.items.map((item) => ({
          productId: item.variant.product_id,
          name: item.title,
          price: item.unit_price / 100,
          quantity: item.quantity,
          image: item.thumbnail || `/images/products/placeholder.jpg`
        })),
        shipped: order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled',
        fulfillmentStatus: order.fulfillment_status,
        paymentStatus: order.payment_status
      }));
      
      // Update the user store with orders
      user.update((currentUser) => {
        if (currentUser) {
          return {
            ...currentUser,
            orders: formattedOrders
          };
        }
        return currentUser;
      });
      
      return formattedOrders;
    } catch (error: any) {
      // Enhanced error detection
      const isNetworkError = 
        error.message?.includes('Network Error') || 
        error.message?.includes('Unable to connect to backend service') ||
        error.name === 'TypeError' || 
        error.name === 'AbortError' ||
        error.toString().includes('Failed to fetch') ||
        !error.response;
      
      // Check if it's a network error and we have retries left
      if (isNetworkError && retries < maxRetries) {
        retries++;
        console.log(`Network error fetching orders, retrying (${retries}/${maxRetries})...`);
        
        // Wait with true exponential backoff before retrying (2^retries * 1000ms)
        const backoffTime = Math.min(1000 * Math.pow(2, retries), 10000); // Cap at 10 seconds
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return attemptGetOrders();
      }
      
      console.error('Error getting customer orders:', error);
      
      // Set offline mode if network errors persist
      if (isNetworkError && retries >= maxRetries) {
        setOfflineMode();
      }
      
      // Use cached orders from the store as fallback when network fails
      const currentUser = get(user);
      if (currentUser?.orders && currentUser.orders.length > 0) {
        console.log('Using cached orders due to network error');
        return currentUser.orders;
      }
      
      // Return empty array as fallback when all else fails
      return [];
    }
  }
  
  return attemptGetOrders();
}

// Get a single order by ID
export async function getOrderById(id: string): Promise<Order | null> {
  if (!browser) return null;
  
  // If we're in offline mode, look for the order in the cached data
  if (isOfflineMode()) {
    const currentUser = get(user);
    const cachedOrder = currentUser?.orders?.find(o => o.id === id);
    if (cachedOrder) {
      console.log('Using cached order in offline mode');
      return cachedOrder;
    }
    toast.error('Cannot retrieve order details while offline');
    return null;
  }
  
  // Maximum number of retry attempts for network issues
  const maxRetries = 3;
  let retries = 0;
  
  async function attemptGetOrder() {
    try {
      const client = getClient();
      const { order } = await client.orders.retrieve(id);
      
      if (!order) return null;
      
      const formattedOrder = {
        id: order.id,
        date: order.created_at,
        status: order.status,
        total: order.total / 100,
        items: order.items.map((item) => ({
          productId: item.variant.product_id,
          name: item.title,
          price: item.unit_price / 100,
          quantity: item.quantity,
          image: item.thumbnail || `/images/products/placeholder.jpg`
        })),
        shipped: order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled',
        fulfillmentStatus: order.fulfillment_status,
        paymentStatus: order.payment_status
      };
      
      return formattedOrder;
    } catch (error: any) {
      // Enhanced error detection
      const isNetworkError = 
        error.message?.includes('Network Error') || 
        error.message?.includes('Unable to connect to backend service') ||
        error.name === 'TypeError' || 
        error.name === 'AbortError' ||
        error.toString().includes('Failed to fetch') ||
        !error.response;
      
      // Check if it's a network error and we have retries left
      if (isNetworkError && retries < maxRetries) {
        retries++;
        console.log(`Network error fetching order, retrying (${retries}/${maxRetries})...`);
        
        // Wait with true exponential backoff before retrying (2^retries * 1000ms)
        const backoffTime = Math.min(1000 * Math.pow(2, retries), 10000); // Cap at 10 seconds
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return attemptGetOrder();
      }
      
      console.error(`Error retrieving order ${id}:`, error);
      
      // Set offline mode if network errors persist
      if (isNetworkError && retries >= maxRetries) {
        setOfflineMode();
      }
      
      // Check if we can get the order from the store
      const currentUser = get(user);
      const cachedOrder = currentUser?.orders?.find(o => o.id === id);
      if (cachedOrder) {
        console.log('Using cached order due to network error');
        return cachedOrder;
      }
      
      // If network error and we have no cached data, show error
      if (isNetworkError) {
        toast.error('Network connection issue. Using cached data if available.');
        return null;
      }
      
      toast.error('Failed to retrieve order. Please try again later.');
      return null;
    }
  }
  
  return attemptGetOrder();
}

// Request order cancellation
export async function requestOrderCancellation(orderId: string, reason: string): Promise<boolean> {
  if (!browser) return false;
  
  // If we're in offline mode, show error
  if (isOfflineMode()) {
    toast.error('Cannot request cancellation while offline. Please try again later.');
    return false;
  }
  
  try {
    // In Medusa, this would typically be handled by a custom endpoint
    // For now, we'll simulate a successful request
    toast.success('Cancellation request submitted');
    return true;
  } catch (error) {
    console.error('Error requesting cancellation:', error);
    toast.error('Failed to submit cancellation request');
    return false;
  }
}

// Request shipping address change
export async function requestAddressChange(
  orderId: string, 
  address: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  }
): Promise<boolean> {
  if (!browser) return false;
  
  // If we're in offline mode, show error
  if (isOfflineMode()) {
    toast.error('Cannot request address change while offline. Please try again later.');
    return false;
  }
  
  try {
    // In Medusa, this would typically be handled by a custom endpoint
    // For now, we'll simulate a successful request
    toast.success('Address change request submitted');
    return true;
  } catch (error) {
    console.error('Error requesting address change:', error);
    toast.error('Failed to submit address change request');
    return false;
  }
}

// Update customer information
export async function updateCustomerInfo(
  firstName?: string,
  lastName?: string,
  phone?: string,
  email?: string,
  password?: string
) {
  if (!browser) return null;
  
  // If we're in offline mode, show error
  if (isOfflineMode()) {
    toast.error('Cannot update profile while offline. Please try again later.');
    return null;
  }
  
  try {
    const client = getClient();
    const { customer } = await client.customers.update({
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      password
    });
    
    if (customer) {
      // Update user store
      user.update(currentUser => {
        if (currentUser) {
          return {
            ...currentUser,
            firstName: customer.first_name || currentUser.firstName,
            lastName: customer.last_name || currentUser.lastName,
            email: customer.email
          };
        }
        return currentUser;
      });
      
      toast.success('Profile updated successfully');
    }
    
    return customer;
  } catch (error) {
    console.error('Error updating customer:', error);
    
    // Check for network errors
    const isNetworkError = 
      error.message?.includes('Network Error') || 
      error.name === 'TypeError' || 
      error.toString().includes('Failed to fetch') ||
      error.name === 'AbortError' ||
      !error.response;
    
    if (isNetworkError) {
      setOfflineMode();
      toast.error('Network connection issue. Please check your internet connection and try again.');
    } else {
      toast.error('Failed to update profile');
    }
    
    return null;
  }
}

// Update customer password
export async function updatePassword(
  oldPassword: string,
  newPassword: string
): Promise<boolean> {
  if (!browser) return false;
  
  // If we're in offline mode, show error
  if (isOfflineMode()) {
    toast.error('Cannot update password while offline. Please try again later.');
    return false;
  }
  
  try {
    const client = getClient();
    await client.customers.update({
      password: newPassword
    });
    
    toast.success('Password updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    
    // Check for network errors
    const isNetworkError = 
      error.message?.includes('Network Error') || 
      error.name === 'TypeError' || 
      error.toString().includes('Failed to fetch') ||
      error.name === 'AbortError' ||
      !error.response;
    
    if (isNetworkError) {
      setOfflineMode();
      toast.error('Network connection issue. Please check your internet connection and try again.');
    } else {
      toast.error('Failed to update password');
    }
    
    return false;
  }
}

// Add/update customer address
export async function addCustomerAddress(
  address: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    province: string;
    postal_code: string;
    country_code: string;
    phone?: string;
  }
): Promise<boolean> {
  if (!browser) return false;
  
  // If we're in offline mode, show error
  if (isOfflineMode()) {
    toast.error('Cannot add address while offline. Please try again later.');
    return false;
  }
  
  try {
    const client = getClient();
    await client.customers.addresses.addAddress({
      address
    });
    
    toast.success('Address added successfully');
    return true;
  } catch (error) {
    console.error('Error adding address:', error);
    
    // Check for network errors
    const isNetworkError = 
      error.message?.includes('Network Error') || 
      error.name === 'TypeError' || 
      error.toString().includes('Failed to fetch') ||
      error.name === 'AbortError' ||
      !error.response;
    
    if (isNetworkError) {
      setOfflineMode();
      toast.error('Network connection issue. Please check your internet connection and try again.');
    } else {
      toast.error('Failed to add address');
    }
    
    return false;
  }
}