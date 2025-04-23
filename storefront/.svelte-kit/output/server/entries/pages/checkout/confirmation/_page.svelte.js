import { s as subscribe } from "../../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import "../../../../chunks/client.js";
import { i as isAuthenticated, u as user } from "../../../../chunks/userStore.js";
import "../../../../chunks/cart.service.js";
import { H as Home } from "../../../../chunks/home.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_isAuthenticated;
  let $$unsubscribe_user;
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  $$unsubscribe_user = subscribe(user, (value) => value);
  let { data } = $$props;
  let order = {
    id: data.orderId || "123456789",
    date: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString()
  };
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  new Date(order.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_user();
  return `${$$result.head += `<!-- HEAD_svelte-1p367zj_START -->${$$result.title = `<title>Order Confirmation | Damned Designs</title>`, ""}<meta name="description" content="Thank you for your order at Damned Designs. Your premium EDC gear is on its way."><!-- HEAD_svelte-1p367zj_END -->`, ""} <div class="container py-12"><div class="flex items-center text-sm mb-6"><a href="/" class="hover:underline">${validate_component(Home, "Home").$$render($$result, { size: 14, class: "inline mb-0.5" }, {}, {})}</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 14, class: "mx-1" }, {}, {})} <a href="/checkout" class="hover:underline" data-svelte-h="svelte-12ldvck">Checkout</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 14, class: "mx-1" }, {}, {})} <span data-svelte-h="svelte-ac7oj3">Confirmation</span></div> ${`<div class="flex justify-center items-center py-20" data-svelte-h="svelte-1g3ichn"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>`}</div>`;
});
export {
  Page as default
};
