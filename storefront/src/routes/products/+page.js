import { getAllProducts } from '$lib/services/medusa/product.service';

export async function load() {
  try {
    const products = await getAllProducts();
    
    return {
      products
    };
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback to local data
    const { products } = await import('$lib/data/products');
    
    return {
      products: products.map(product => ({
        ...product,
        image: product.image || `/images/products/${product.slug}.jpg`,
        variations: (product.variations || []).map(variation => ({
          ...variation,
          image: variation.image || `/images/products/${product.slug}.jpg`
        }))
      }))
    };
  }
}