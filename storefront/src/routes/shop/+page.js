import { createMedusaClient } from '$lib/config/medusa';
import { getAllProducts } from '$lib/services/medusa/product.service';

export async function load() {
  try {
    const medusaClient = createMedusaClient();
    const { collections } = await medusaClient.collections.list();
    const products = await getAllProducts();
    
    // Calculate product counts by category (collection)
    const categoryCounts = {};
    
    // Map collection IDs to their titles
    const collectionMap = {};
    collections.forEach(collection => {
      collectionMap[collection.id] = collection.title.toLowerCase();
      categoryCounts[collection.title.toLowerCase()] = 0;
    });
    
    // Count products per category
    products.forEach(product => {
      const category = product.category || 'uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return {
      categoryCounts,
      collections
    };
  } catch (error) {
    console.error('Error loading categories:', error);
    
    // Fallback to local data
    const { products } = await import('$lib/data/products');
    
    // Calculate product counts by category
    const categoryCounts = products.reduce((acc, product) => {
      const category = product.category || 'uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      categoryCounts
    };
  }
}