import { getProductsByCategory } from '$lib/services/medusa/product.service';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const { category } = params;
  
  // Validate that the category exists
  const validCategories = ['knives', 'tools', 'accessories'];
  
  if (!validCategories.includes(category)) {
    throw error(404, 'Category not found');
  }
  
  try {
    // Get products by category from Medusa
    const products = await getProductsByCategory(category);
    
    return {
      category,
      products
    };
  } catch (err) {
    console.error(`Error loading category ${category}:`, err);
    
    // Fallback to local data
    const { products } = await import('$lib/data/products');
    
    // Filter products by category
    const categoryProducts = products.filter(product => product.category === category);
    
    return {
      category,
      products: categoryProducts
    };
  }
}