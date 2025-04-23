import { c as create_ssr_component, v as validate_component, g as add_attribute, e as escape, h as each } from "../../../../chunks/ssr.js";
import "../../../../chunks/client.js";
import "../../../../chunks/cart.service.js";
import "../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { C as Chevron_down, S as Shopping_cart } from "../../../../chunks/shopping-cart.js";
import { P as Plus } from "../../../../chunks/plus.js";
const Bell_ring = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
      }
    ],
    ["path", { "d": "M10.3 21a1.94 1.94 0 0 0 3.4 0" }],
    ["path", { "d": "M4 2C2.8 3.7 2 5.7 2 8" }],
    ["path", { "d": "M22 8c0-2.3-.8-4.3-2-6" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "bell-ring" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Minus = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M5 12h14" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "minus" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentPrice;
  let currentSalePrice;
  let currentImage;
  let isOnSale;
  let discount;
  let hasPriceRange;
  let minPrice;
  let maxPrice;
  let { data } = $$props;
  const product = data.product;
  let quantity = 1;
  let selectedVariation = product.variations && product.variations.length > 0 ? product.variations.find((v) => v.inStock) || null : null;
  let showSpecs = false;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  currentPrice = selectedVariation ? selectedVariation.price : product?.price;
  currentSalePrice = selectedVariation ? selectedVariation.salePrice : product?.salePrice;
  currentImage = selectedVariation ? selectedVariation.image : product?.image;
  isOnSale = currentSalePrice !== void 0;
  discount = isOnSale && currentPrice && currentSalePrice ? Math.round((1 - currentSalePrice / currentPrice) * 100) : 0;
  hasPriceRange = product.variations && product.variations.length > 0 && new Set(product.variations.map((v) => v.price)).size > 1;
  minPrice = hasPriceRange && product.variations && product.variations.length > 0 ? Math.min(...product.variations.map((v) => v.price), product.price) : currentPrice || 0;
  maxPrice = hasPriceRange && product.variations && product.variations.length > 0 ? Math.max(...product.variations.map((v) => v.price)) : currentPrice || 0;
  return `  <div class="container py-12"><div class="grid grid-cols-1 md:grid-cols-2 gap-12"> <div class="md:sticky md:top-24 self-start"><div class="aspect-square bg-gray-100 rounded-lg overflow-hidden relative"><img${add_attribute("src", currentImage, 0)}${add_attribute("alt", product.name, 0)} class="w-full h-full object-cover"> ${isOnSale && discount > 0 ? `<div class="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-lg font-bold">SAVE ${escape(discount)}%</div>` : ``}</div></div>  <div class="space-y-8 pt-3 md:pt-3"><div><h1 class="text-3xl font-bold mb-4">${escape(product.name)}</h1> ${isOnSale && currentSalePrice !== void 0 ? `<div class="flex items-center gap-3 mb-1"><p class="text-2xl font-bold text-green-600">$${escape(currentSalePrice.toFixed(2))}</p> <p class="text-xl text-gray-500 line-through">$${escape(currentPrice.toFixed(2))}</p></div> <p class="text-gray-600 text-sm font-medium mb-4">or 4 interest-free payments of $${escape(((currentSalePrice || 0) / 4).toFixed(2))}</p>` : `${hasPriceRange ? `<p class="text-2xl font-bold mb-1">$${escape(minPrice.toFixed(2))} - $${escape(maxPrice.toFixed(2))}</p> <p class="text-gray-600 text-sm font-medium mb-4">or 4 interest-free payments of $${escape((minPrice / 4).toFixed(2))} - $${escape((maxPrice / 4).toFixed(2))}</p>` : `${currentPrice !== void 0 ? `<p class="text-2xl font-bold mb-1">$${escape(currentPrice.toFixed(2))}</p> <p class="text-gray-600 text-sm font-medium mb-4">or 4 interest-free payments of $${escape((currentPrice / 4).toFixed(2))}</p>` : ``}`}`}</div> <div class="prose max-w-none"><p class="mb-6">${escape(product.description)}</p> ${product.variations && product.variations.length > 0 ? `<div class="mb-6"><h2 class="text-xl font-bold mb-4" data-svelte-h="svelte-13gook4">Options</h2> <div class="space-y-3">${each(product.variations, (variation) => {
    return `<label class="flex items-center group cursor-pointer"><div class="w-4 h-4 relative flex items-center justify-center">${variation.inStock ? `<input type="radio" name="variation"${add_attribute("value", variation, 0)} class="w-4 h-4 text-accent focus:ring-accent border-gray-300"${add_attribute("aria-label", `Select ${variation.name} variation`, 0)}${variation === selectedVariation ? add_attribute("checked", true, 1) : ""}>` : `<button class="w-4 flex items-center justify-center"${add_attribute("aria-label", `Get notified when ${variation.name} is back in stock`, 0)}>${validate_component(Bell_ring, "BellRing").$$render($$result, { size: 16, class: "text-black" }, {}, {})} </button>`}</div> <span class="ml-2 flex-grow flex items-center"><span class="${["font-medium text-black", !variation.inStock ? "line-through" : ""].join(" ").trim()}">${escape(variation.name)}</span> ${variation.salePrice !== void 0 ? `<span class="${[
      "ml-2 text-green-600 font-medium",
      !variation.inStock ? "line-through" : ""
    ].join(" ").trim()}">$${escape(variation.salePrice.toFixed(2))}</span> <span class="${[
      "ml-2 text-gray-500 line-through text-sm",
      !variation.inStock ? "line-through" : ""
    ].join(" ").trim()}">$${escape(variation.price.toFixed(2))} </span>` : `${variation.price !== product.price ? `<span class="${["ml-2 text-black", !variation.inStock ? "line-through" : ""].join(" ").trim()}">$${escape(variation.price.toFixed(2))} </span>` : ``}`}</span> </label>`;
  })}</div></div>` : ``} <div class="border-t border-gray-200 pt-6 mb-8"><button class="w-full flex items-center justify-between py-3"${add_attribute("aria-expanded", showSpecs, 0)} aria-controls="specifications-panel"><span class="font-bold" data-svelte-h="svelte-1jas574">Specifications</span> ${`${validate_component(Chevron_down, "ChevronDown").$$render($$result, { size: 20 }, {}, {})}`}</button> ${``}</div> <div class="flex items-center"><div class="flex items-center border border-gray-300 rounded-md"><button class="px-3 py-2 border-r border-gray-300" aria-label="Decrease quantity">${validate_component(Minus, "Minus").$$render($$result, { size: 18 }, {}, {})}</button> <span class="px-4 py-2">${escape(quantity)}</span> <button class="px-3 py-2 border-l border-gray-300" aria-label="Increase quantity">${validate_component(Plus, "Plus").$$render($$result, { size: 18 }, {}, {})}</button></div> <button class="btn btn-primary ml-4 flex-grow" ${product.variations && product.variations.length > 0 && !selectedVariation ? "disabled" : ""}>${validate_component(Shopping_cart, "ShoppingCart").$$render($$result, { size: 20, class: "mr-2" }, {}, {})}
            Add to Cart</button></div></div></div></div></div>  ${``}`;
});
export {
  Page as default
};
