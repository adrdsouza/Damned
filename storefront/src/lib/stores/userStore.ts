import { writable } from 'svelte/store';
import type { User, Order, OrderItem } from '$lib/types';
import { browser } from '$app/environment';
import { login as medusaLogin, logout as medusaLogout, getCustomerOrders } from '$lib/services/medusa/customer.service';

// Create stores
export const user = writable<User | null>(null);
export const isAuthenticated = writable<boolean>(false);

// Mock user data for fallback (kept for backwards compatibility)
const mockUser: User = {
  id: 1,
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  orders: [
    {
      id: 1001,
      date: '2023-11-15',
      status: 'delivered',
      total: 249.98,
      items: [
        {
          productId: 1,
          name: 'Djinn XL Titanium',
          price: 249.99,
          quantity: 1,
          image: '/images/products/djinn-xl.jpg'
        }
      ]
    },
    {
      id: 1002,
      date: '2023-12-05',
      status: 'shipped',
      total: 129.99,
      items: [
        {
          productId: 2,
          name: 'Oni Compact',
          price: 129.99,
          quantity: 1,
          image: '/images/products/oni-compact.jpg'
        }
      ]
    }
  ]
};

// Login function with improved error handling
export async function login(email: string, password: string): Promise<boolean> {
  if (!browser) return false;
  
  // For demo purposes, allow login from anywhere including the cart popup
  if (email === 'user@example.com' && password === 'password') {
    user.set(mockUser);
    isAuthenticated.set(true);
    localStorage.setItem('isAuthenticated', 'true');
    return true;
  }
  
  // Check if we're in offline mode
  if (isOfflineMode()) {
    toast.error('Cannot log in while offline. Please try again later.');
    return false;
  }
  
  async function attemptLogin(): Promise<boolean> {
    try {
      const client = getClient();
      const response = await client.auth.authenticate({
        email,
        password
      });
      
      const { customer } = response || {};
      
      // Set user in store
      if (customer) {
        user.set({
          id: customer.id,
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          orders: []
        });
        isAuthenticated.set(true);
        localStorage.setItem('isAuthenticated', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  return await attemptLogin();
}

// Logout function
export function logout(): void {
  if (browser) {
    // Try to use Medusa logout
    medusaLogout().catch((error) => {
      console.error('Medusa logout error:', error);
    });
    
    // Always update local state
    user.set(null);
    isAuthenticated.set(false);
    localStorage.removeItem('isAuthenticated');
  }
}

// Check if user is already logged in
export function checkAuth(): void {
  if (browser) {
    const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isLoggedIn) {
      // Try to get customer from Medusa
      import('$lib/services/medusa/customer.service')
        .then(({ getCustomerInfo }) => {
          getCustomerInfo().catch(() => {
            // If Medusa fails, fallback to mock user for demo
            user.set(mockUser);
            isAuthenticated.set(true);
          });
        })
        .catch((error) => {
          console.error('Failed to import customer service:', error);
          // Fallback to mock user
          user.set(mockUser);
          isAuthenticated.set(true);
        });
    }
  }
}

// Initialize auth checking
if (browser) {
  checkAuth();
}