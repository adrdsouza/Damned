import { getProductsByCategory } from "../../../../chunks/product.service.js";
import { e as error } from "../../../../chunks/index.js";
async function load({ params }) {
  const { category } = params;
  const validCategories = ["knives", "tools", "accessories"];
  if (!validCategories.includes(category)) {
    throw error(404, "Category not found");
  }
  try {
    const products = await getProductsByCategory(category);
    return {
      category,
      products
    };
  } catch (err) {
    console.error(`Error loading category ${category}:`, err);
    const { products } = await import("../../../../chunks/products.js");
    const categoryProducts = products.filter((product) => product.category === category);
    return {
      category,
      products: categoryProducts
    };
  }
}
export {
  load
};
