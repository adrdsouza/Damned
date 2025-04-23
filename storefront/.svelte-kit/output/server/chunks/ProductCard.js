import { c as create_ssr_component, g as add_attribute, e as escape } from "./ssr.js";
import "clsx";
import "./cart.service.js";
import "./Toaster.svelte_svelte_type_style_lang.js";
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23ccc'%3E%3Crect width='400' height='300'/%3E%3Cpath d='M159.52 154.91h80.96v-9.84h-80.96v9.84zm0-19.68h80.96v-9.84h-80.96v9.84zm-19.68 39.36h120.32v-68.88h-120.32v68.88zm-9.84-78.72h140v88.56h-140v-88.56z' fill='%23999'/%3E%3C/svg%3E";
function getImageWithFallback(src) {
  return src || PLACEHOLDER_IMAGE;
}
const ProductCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let hasPriceRange;
  let minPrice;
  let maxPrice;
  let saleVariations;
  let hasSaleVariations;
  let minSalePrice;
  let maxSalePrice;
  let isOnSale;
  let discount;
  let { product } = $$props;
  if ($$props.product === void 0 && $$bindings.product && product !== void 0) $$bindings.product(product);
  hasPriceRange = product.variations && product.variations.length > 0 && new Set(product.variations.map((v) => v.price)).size > 1;
  minPrice = hasPriceRange && product.variations && product.variations.length > 0 ? Math.min(...product.variations.map((v) => v.price), product.price) : product.price;
  maxPrice = hasPriceRange && product.variations && product.variations.length > 0 ? Math.max(...product.variations.map((v) => v.price)) : product.price;
  saleVariations = (product.variations || []).filter((v) => v.salePrice !== void 0);
  hasSaleVariations = saleVariations.length > 0;
  minSalePrice = hasSaleVariations && saleVariations.length > 0 ? Math.min(...saleVariations.map((v) => v.salePrice || 0), product.salePrice !== void 0 ? product.salePrice : Infinity) : product.salePrice;
  maxSalePrice = hasSaleVariations && saleVariations.length > 0 ? Math.max(...saleVariations.map((v) => v.salePrice || 0)) : product.salePrice;
  isOnSale = product.onSale || product.salePrice !== void 0 || hasSaleVariations;
  discount = isOnSale && minPrice && minSalePrice !== void 0 && minSalePrice > 0 ? Math.round((1 - minSalePrice / minPrice) * 100) : 0;
  return `<div class="group"><a${add_attribute("href", `/products/${product.slug}`, 0)} class="block"${add_attribute("aria-label", `View ${product.name} details`, 0)}><div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative"><img${add_attribute("src", getImageWithFallback(product.image), 0)}${add_attribute("alt", product.name, 0)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"> <div class="absolute top-2 left-2 flex flex-col gap-2">${isOnSale && discount > 0 ? `<div class="bg-green-600 text-white text-xs px-2 py-1 rounded"${add_attribute("aria-label", `Save ${discount}%`, 0)}>SAVE ${escape(discount)}%</div>` : ``}</div> <div class="absolute top-2 right-2 flex flex-col gap-2">${product.new ? `<div class="bg-accent text-white text-xs px-2 py-1 rounded" aria-label="New product" data-svelte-h="svelte-1rca7bc">NEW</div>` : ``}</div></div> <h3 class="text-lg font-bold mb-1">${escape(product.name)}</h3> ${isOnSale && minSalePrice !== void 0 ? `<div class="flex items-center gap-2">${hasPriceRange && minSalePrice !== void 0 && maxSalePrice !== void 0 ? `<p class="font-bold">$${escape(minSalePrice.toFixed(2))} - $${escape(maxSalePrice.toFixed(2))}</p> <p class="text-gray-500 line-through text-sm">$${escape(minPrice.toFixed(2))} - $${escape(maxPrice.toFixed(2))}</p>` : `${product.salePrice !== void 0 ? `<p class="font-bold">$${escape(product.salePrice.toFixed(2))}</p> <p class="text-gray-500 line-through text-sm">$${escape(product.price.toFixed(2))}</p>` : `<p class="font-bold">$${escape(product.price.toFixed(2))}</p>`}`}</div>` : `<div>${hasPriceRange ? `<p class="font-bold">$${escape(minPrice.toFixed(2))} - $${escape(maxPrice.toFixed(2))}</p>` : `<p class="font-bold">$${escape(product.price.toFixed(2))}</p>`}</div>`} <p class="text-gray-600 text-sm" data-svelte-h="svelte-1xmqlbw">or 4 interest-free payments</p></a></div>`;
});
export {
  ProductCard as P
};
