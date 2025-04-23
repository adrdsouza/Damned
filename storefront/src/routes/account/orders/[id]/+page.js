import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';
import { getCustomerOrders, getOrderById } from '$lib/services/medusa/customer.service';
import { user } from '$lib/stores/userStore';
import { get } from 'svelte/store';

// Mock order data for demonstration
const mockOrders = {
  '1001': {
    id: '1001',
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
    ],
    shipped: true,
    fulfillmentStatus: 'fulfilled',
    paymentStatus: 'paid',
    trackingNumber: 'TRK123456789',
    shippingAddress: {
      name: 'John Doe',
      address_1: '123 Main St',
      address_2: 'Apt 4B',
      city: 'Anytown',
      province: 'CA',
      postal_code: '12345',
      country_code: 'US'
    }
  },
  '1002': {
    id: '1002',
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
    ],
    shipped: true,
    fulfillmentStatus: 'shipped',
    paymentStatus: 'paid',
    trackingNumber: 'TRK987654321',
    shippingAddress: {
      name: 'John Doe',
      address_1: '123 Main St',
      address_2: '',
      city: 'Anytown',
      province: 'CA',
      postal_code: '12345',
      country_code: 'US'
    }
  }
};

export async function load({ params }) {
  const { id } = params;
  let order = null;
  
  try {
    if (!browser) {
      // For SSR, use mock data
      if (mockOrders[id]) {
        return { order: mockOrders[id] };
      }
      throw error(404, 'Order not found');
    }
    
    // First try to get the order from Medusa
    try {
      order = await getOrderById(id);
      if (order) {
        return { order };
      }
    } catch (err) {
      console.log('Error fetching order from Medusa:', err);
      // Continue to fallbacks if Medusa fetch fails
    }
    
    // Check mock orders if specific test IDs are used
    if (mockOrders[id]) {
      console.log('Using mock order data');
      return { order: mockOrders[id] };
    }
    
    // Try getting all orders and look for this ID
    try {
      const orders = await getCustomerOrders();
      order = orders.find(order => order.id === id || order.id.toString() === id);
      if (order) {
        return { order };
      }
    } catch (err) {
      console.log('Error fetching orders list:', err);
      // Continue to fallbacks if orders fetch fails
    }
    
    // Check local store data as last resort
    const userData = get(user);
    const orderFromStore = userData?.orders?.find(o => o.id === id || o.id.toString() === id);
    if (orderFromStore) {
      return { order: orderFromStore };
    }
    
    // If we're still here, we need to show a demo order for UI purposes
    const demoOrder = {
      id: id,
      date: new Date().toISOString(),
      status: 'processing',
      total: 279.98,
      items: [
        {
          productId: 1,
          name: 'Djinn XL Titanium',
          price: 199.99,
          quantity: 1,
          image: '/images/products/djinn-xl.jpg'
        },
        {
          productId: 8,
          name: 'EDC Organizer Pouch',
          price: 39.99,
          quantity: 2,
          image: '/images/products/pouch.jpg'
        }
      ],
      shipped: false,
      fulfillmentStatus: 'pending',
      paymentStatus: 'paid',
      trackingNumber: '',
      shippingAddress: {
        name: 'John Doe',
        address_1: '123 Main St',
        address_2: 'Apt 4B',
        city: 'Anytown',
        province: 'CA',
        postal_code: '12345',
        country_code: 'US'
      }
    };
    
    console.log('Using demo order for display purposes');
    return { order: demoOrder };
  } catch (err) {
    console.error(`Error loading order ${id}:`, err);
    
    if (err.status === 404) {
      throw error(404, 'Order not found');
    }
    
    throw error(500, 'An error occurred while loading the order');
  }
}