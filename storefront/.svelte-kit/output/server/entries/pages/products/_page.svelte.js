import { c as create_ssr_component, l as createEventDispatcher, h as each, g as add_attribute, v as validate_component, e as escape } from "../../../chunks/ssr.js";
import { P as ProductCard } from "../../../chunks/ProductCard.js";
import { S as Search } from "../../../chunks/search.js";
const ProductFilters = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let selectedCategory = "all";
  let searchQuery = "";
  const categories = [
    { id: "all", name: "All Products" },
    { id: "knives", name: "Knives" },
    { id: "tools", name: "Tools" },
    { id: "accessories", name: "Accessories" }
  ];
  return `<div class="flex flex-col md:flex-row justify-between gap-6"><div class="flex flex-wrap gap-2">${each(categories, (category) => {
    return `<button${add_attribute(
      "class",
      `px-4 py-2 rounded-full border ${selectedCategory === category.id ? "bg-primary text-white border-primary" : "bg-white text-primary border-gray-300 hover:bg-gray-100"}`,
      0
    )}${add_attribute("aria-pressed", selectedCategory === category.id, 0)}${add_attribute("aria-label", `Filter by ${category.name}`, 0)}>${escape(category.name)} </button>`;
  })}</div> <div class="relative"><input type="text" placeholder="Search products..." aria-label="Search products" class="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"${add_attribute("value", searchQuery, 0)}> <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">${validate_component(Search, "Search").$$render($$result, { size: 18 }, {}, {})}</div></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let filteredProducts = [...data.products];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `  ${$$result.head += `<!-- HEAD_svelte-1hp67ir_START -->${$$result.title = `<title>Products | Damned Designs</title>`, ""}<meta name="description" content="Browse our collection of premium knives and EDC gear. Find the perfect tool for your everyday carry needs."><!-- HEAD_svelte-1hp67ir_END -->`, ""} <section class="py-12 bg-white"><div class="container"><h1 class="text-4xl font-bold mb-8 text-center" data-svelte-h="svelte-1l6xv4j">Our Products</h1> ${validate_component(ProductFilters, "ProductFilters").$$render($$result, {}, {}, {})} ${filteredProducts.length > 0 ? `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">${each(filteredProducts, (product) => {
    return `${validate_component(ProductCard, "ProductCard").$$render($$result, { product }, {}, {})}`;
  })}</div>` : `<div class="text-center py-12"><p class="text-xl" data-svelte-h="svelte-1cig8eh">No products found matching your criteria.</p> <button class="mt-4 btn btn-primary" data-svelte-h="svelte-16mrx6u">Reset Filters</button></div>`}</div></section>`;
});
export {
  Page as default
};
