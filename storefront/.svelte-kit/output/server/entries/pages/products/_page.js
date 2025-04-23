import { getAllProducts } from "../../../chunks/product.service.js";
async function load() {
  try {
    const products = await getAllProducts();
    return {
      products
    };
  } catch (error) {
    console.error("Error loading products:", error);
    const { products } = await import("../../../chunks/products.js");
    return {
      products: products.map((product) => ({
        ...product,
        image: product.image || `/images/products/${product.slug}.jpg`,
        variations: (product.variations || []).map((variation) => ({
          ...variation,
          image: variation.image || `/images/products/${product.slug}.jpg`
        }))
      }))
    };
  }
}
export {
  load
};
