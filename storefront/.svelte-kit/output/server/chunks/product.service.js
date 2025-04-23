import { c as createMedusaClient } from "./medusa.js";
const medusaClient = createMedusaClient();
function mapMedusaProduct(medusaProduct) {
  return {
    id: medusaProduct.id,
    name: medusaProduct.title,
    slug: medusaProduct.handle,
    description: medusaProduct.description || "",
    price: medusaProduct.variants[0]?.original_price / 100 || 0,
    salePrice: medusaProduct.variants[0]?.calculated_price !== medusaProduct.variants[0]?.original_price ? medusaProduct.variants[0]?.calculated_price / 100 : void 0,
    onSale: medusaProduct.variants[0]?.calculated_price !== medusaProduct.variants[0]?.original_price,
    image: medusaProduct.thumbnail || `/images/products/${medusaProduct.handle}.jpg`,
    category: medusaProduct.collection?.title?.toLowerCase() || "uncategorized",
    featured: medusaProduct.tags?.some((tag) => tag.value === "featured") || false,
    new: medusaProduct.tags?.some((tag) => tag.value === "new") || false,
    specs: {
      material: medusaProduct.metadata?.material || "Premium steel",
      length: medusaProduct.metadata?.length || "8.5 inches (overall)",
      weight: medusaProduct.metadata?.weight || "4.2 oz",
      handle: medusaProduct.metadata?.handle || "G10"
    },
    variations: medusaProduct.variants.map((variant) => ({
      id: variant.id,
      name: variant.title,
      price: variant.original_price / 100,
      salePrice: variant.calculated_price !== variant.original_price ? variant.calculated_price / 100 : void 0,
      inStock: variant.inventory_quantity > 0,
      attributes: variant.options.reduce((acc, option) => {
        acc[option.option.title] = option.value;
        return acc;
      }, {}),
      image: variant.thumbnail || medusaProduct.thumbnail || `/images/products/${medusaProduct.handle}.jpg`
    }))
  };
}
async function getAllProducts() {
  try {
    const { products } = await medusaClient.products.list({
      expand: "variants,images,collection,tags,options"
    });
    return products.map(mapMedusaProduct);
  } catch (error) {
    console.error("Error fetching products from Medusa:", error);
    const { products } = await import("./products.js");
    return products;
  }
}
async function getProductBySlug(slug) {
  try {
    const { products } = await medusaClient.products.list({
      handle: slug,
      expand: "variants,images,collection,tags,options"
    });
    if (products.length === 0) return null;
    return mapMedusaProduct(products[0]);
  } catch (error) {
    console.error(`Error fetching product ${slug} from Medusa:`, error);
    const { products } = await import("./products.js");
    return products.find((product) => product.slug === slug) || null;
  }
}
async function getProductsByCategory(category) {
  try {
    const { collections } = await medusaClient.collections.list({
      title: category
    });
    if (collections.length === 0) return [];
    const collectionId = collections[0].id;
    const { products } = await medusaClient.products.list({
      collection_id: [collectionId],
      expand: "variants,images,collection,tags,options"
    });
    return products.map(mapMedusaProduct);
  } catch (error) {
    console.error(`Error fetching products by category ${category} from Medusa:`, error);
    const { products } = await import("./products.js");
    return products.filter((product) => product.category === category);
  }
}
export {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  mapMedusaProduct
};
