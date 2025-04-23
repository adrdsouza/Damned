import { c as create_ssr_component, v as validate_component, e as escape, g as add_attribute, h as each } from "../../../../chunks/ssr.js";
import "../../../../chunks/client.js";
import { P as ProductCard } from "../../../../chunks/ProductCard.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const categoryInfo = {
    "knives": {
      name: "Knives",
      description: "Our premium collection of folding and fixed blade knives, designed with precision and crafted from the finest materials for exceptional performance and durability.",
      image: "/images/categories/knives-banner.jpg"
    },
    "tools": {
      name: "Tools",
      description: "Versatile everyday carry tools designed to tackle a variety of tasks with ease and reliability, from pry bars to multi-tools.",
      image: "/images/categories/tools-banner.jpg"
    },
    "accessories": {
      name: "Accessories",
      description: "Essential add-ons to complement your EDC gear, including pouches, beads, and maintenance kits to keep your equipment in peak condition.",
      image: "/images/categories/accessories-banner.jpg"
    }
  };
  const currentCategory = data.category;
  const currentInfo = categoryInfo[currentCategory] || {
    name: "Products",
    description: "Browse our collection of premium EDC gear.",
    image: "/images/categories/default-banner.jpg"
  };
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  return `  ${$$result.head += `<!-- HEAD_svelte-1yejgs4_START -->${$$result.title = `<title>${escape(currentInfo.name)} | Damned Designs</title>`, ""}<meta name="description"${add_attribute("content", currentInfo.description, 0)}><!-- HEAD_svelte-1yejgs4_END -->`, ""} <div class="container py-12"><div class="flex items-center text-sm mb-6"><a href="/" class="hover:underline" data-svelte-h="svelte-18kg8x7">Home</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <a href="/shop" class="hover:underline" data-svelte-h="svelte-1m3nyg4">Shop</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <span>${escape(currentInfo.name)}</span></div> <div class="relative rounded-lg overflow-hidden mb-10 h-64"><img${add_attribute("src", currentInfo.image, 0)}${add_attribute("alt", currentInfo.name, 0)} class="w-full h-full object-cover"> <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"><div class="text-center text-white p-6"><h1 class="text-4xl font-bold mb-2">${escape(currentInfo.name)}</h1> <p class="max-w-2xl">${escape(currentInfo.description)}</p></div></div></div> ${data.products.length > 0 ? `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">${each(data.products, (product) => {
    return `${validate_component(ProductCard, "ProductCard").$$render($$result, { product }, {}, {})}`;
  })}</div>` : `<div class="text-center py-12" data-svelte-h="svelte-4ry65f"><p class="text-xl mb-4">No products found in this category.</p> <a href="/products" class="btn btn-primary">View All Products</a></div>`}</div>`;
});
export {
  Page as default
};
