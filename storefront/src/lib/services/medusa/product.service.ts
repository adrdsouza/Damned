import { createMedusaClient } from '$lib/config/medusa';
import type { Product, ProductVariation } from '$lib/types';

const medusaClient = createMedusaClient();

// Map Medusa product to application product
export function mapMedusaProduct(medusaProduct: any): Product {
  return {
    id: medusaProduct.id,
    name: medusaProduct.title,
    slug: medusaProduct.handle,
    description: medusaProduct.description || '',
    price: medusaProduct.variants[0]?.original_price / 100 || 0,
    salePrice: medusaProduct.variants[0]?.calculated_price !== medusaProduct.variants[0]?.original_price 
      ? medusaProduct.variants[0]?.calculated_price / 100 
      : undefined,
    onSale: medusaProduct.variants[0]?.calculated_price !== medusaProduct.variants[0]?.original_price,
    image: medusaProduct.thumbnail || `/images/products/${medusaProduct.handle}.jpg`,
    category: medusaProduct.collection?.title?.toLowerCase() || 'uncategorized',
    featured: medusaProduct.tags?.some((tag: any) => tag.value === 'featured') || false,
    new: medusaProduct.tags?.some((tag: any) => tag.value === 'new') || false,
    specs: {
      material: medusaProduct.metadata?.material || 'Premium steel',
      length: medusaProduct.metadata?.length || '8.5 inches (overall)',
      weight: medusaProduct.metadata?.weight || '4.2 oz',
      handle: medusaProduct.metadata?.handle || 'G10'
    },
    variations: medusaProduct.variants.map((variant: any): ProductVariation => ({
      id: variant.id,
      name: variant.title,
      price: variant.original_price / 100,
      salePrice: variant.calculated_price !== variant.original_price 
        ? variant.calculated_price / 100 
        : undefined,
      inStock: variant.inventory_quantity > 0,
      attributes: variant.options.reduce((acc: Record<string, string>, option: any) => {
        acc[option.option.title] = option.value;
        return acc;
      }, {}),
      image: variant.thumbnail || medusaProduct.thumbnail || `/images/products/${medusaProduct.handle}.jpg`
    }))
  };
}

// Fetch all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { products } = await medusaClient.products.list({
      expand: 'variants,images,collection,tags,options'
    });
    
    return products.map(mapMedusaProduct);
  } catch (error) {
    console.error('Error fetching products from Medusa:', error);
    // Fallback to local data if Medusa is unavailable
    const { products } = await import('$lib/data/products');
    return products;
  }
}

// Fetch a single product by slug/handle
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { products } = await medusaClient.products.list({
      handle: slug,
      expand: 'variants,images,collection,tags,options'
    });
    
    if (products.length === 0) return null;
    
    return mapMedusaProduct(products[0]);
  } catch (error) {
    console.error(`Error fetching product ${slug} from Medusa:`, error);
    // Fallback to local data if Medusa is unavailable
    const { products } = await import('$lib/data/products');
    return products.find(product => product.slug === slug) || null;
  }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    // First, find the collection ID for the category
    const { collections } = await medusaClient.collections.list({
      title: category
    });
    
    if (collections.length === 0) return [];
    
    const collectionId = collections[0].id;
    
    // Then get products from that collection
    const { products } = await medusaClient.products.list({
      collection_id: [collectionId],
      expand: 'variants,images,collection,tags,options'
    });
    
    return products.map(mapMedusaProduct);
  } catch (error) {
    console.error(`Error fetching products by category ${category} from Medusa:`, error);
    // Fallback to local data if Medusa is unavailable
    const { products } = await import('$lib/data/products');
    return products.filter(product => product.category === category);
  }
}

// Get featured products
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  try {
    const { products } = await medusaClient.products.list({
      tags: ['featured'],
      limit: limit,
      expand: 'variants,images,collection,tags,options'
    });
    
    return products.map(mapMedusaProduct);
  } catch (error) {
    console.error('Error fetching featured products from Medusa:', error);
    // Fallback to local data if Medusa is unavailable
    const { products } = await import('$lib/data/products');
    return products.filter(product => product.featured).slice(0, limit);
  }
}