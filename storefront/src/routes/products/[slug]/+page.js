import { getProductBySlug } from '$lib/services/medusa/product.service';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const { slug } = params;
  
  try {
    const product = await getProductBySlug(slug);
    
    if (!product) {
      throw error(404, 'Product not found');
    }
    
    // Get related products
    const { getAllProducts } = await import('$lib/services/medusa/product.service');
    const allProducts = await getAllProducts();
    const relatedProducts = allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
    
    return {
      product,
      relatedProducts
    };
  } catch (err) {
    if (err.status === 404) throw err;
    
    console.error(`Error loading product ${slug}:`, err);
    
    // Fallback to local data
    const { products } = await import('$lib/data/products');
    const product = products.find(p => p.slug === slug);
    
    if (!product) {
      throw error(404, 'Product not found');
    }
    
    // Ensure variations and images are set
    if (!product.variations) {
      product.variations = [];
    }
    
    if (!product.image) {
      product.image = `/images/products/${product.slug}.jpg`;
    }
    
    product.variations = product.variations.map(variation => ({
      ...variation,
      image: variation.image || product.image
    }));
    
    const relatedProducts = products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
    
    return {
      product,
      relatedProducts
    };
  }
}