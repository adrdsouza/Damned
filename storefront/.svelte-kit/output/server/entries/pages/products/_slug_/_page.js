import { getProductBySlug } from "../../../../chunks/product.service.js";
import { e as error } from "../../../../chunks/index.js";
async function load({ params }) {
  const { slug } = params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) {
      throw error(404, "Product not found");
    }
    const { getAllProducts } = await import("../../../../chunks/product.service.js");
    const allProducts = await getAllProducts();
    const relatedProducts = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
    return {
      product,
      relatedProducts
    };
  } catch (err) {
    if (err.status === 404) throw err;
    console.error(`Error loading product ${slug}:`, err);
    const { products } = await import("../../../../chunks/products.js");
    const product = products.find((p) => p.slug === slug);
    if (!product) {
      throw error(404, "Product not found");
    }
    if (!product.variations) {
      product.variations = [];
    }
    if (!product.image) {
      product.image = `/images/products/${product.slug}.jpg`;
    }
    product.variations = product.variations.map((variation) => ({
      ...variation,
      image: variation.image || product.image
    }));
    const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
    return {
      product,
      relatedProducts
    };
  }
}
export {
  load
};
