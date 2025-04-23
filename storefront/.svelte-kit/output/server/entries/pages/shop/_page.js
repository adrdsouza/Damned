import { c as createMedusaClient } from "../../../chunks/medusa.js";
import { getAllProducts } from "../../../chunks/product.service.js";
async function load() {
  try {
    const medusaClient = createMedusaClient();
    const { collections } = await medusaClient.collections.list();
    const products = await getAllProducts();
    const categoryCounts = {};
    const collectionMap = {};
    collections.forEach((collection) => {
      collectionMap[collection.id] = collection.title.toLowerCase();
      categoryCounts[collection.title.toLowerCase()] = 0;
    });
    products.forEach((product) => {
      const category = product.category || "uncategorized";
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    return {
      categoryCounts,
      collections
    };
  } catch (error) {
    console.error("Error loading categories:", error);
    const { products } = await import("../../../chunks/products.js");
    const categoryCounts = products.reduce((acc, product) => {
      const category = product.category || "uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    return {
      categoryCounts
    };
  }
}
export {
  load
};
