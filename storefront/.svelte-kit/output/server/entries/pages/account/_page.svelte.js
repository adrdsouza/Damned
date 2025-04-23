import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, e as escape, g as add_attribute, h as each } from "../../../chunks/ssr.js";
import "../../../chunks/client.js";
import { i as isAuthenticated, u as user } from "../../../chunks/userStore.js";
import { U as User } from "../../../chunks/user.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { P as Package } from "../../../chunks/package.js";
import { C as Credit_card } from "../../../chunks/credit-card.js";
const Log_out = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      }
    ],
    ["polyline", { "points": "16 17 21 12 16 7" }],
    [
      "line",
      {
        "x1": "21",
        "x2": "9",
        "y1": "12",
        "y2": "12"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "log-out" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "settings" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Shopping_bag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"
      }
    ],
    ["path", { "d": "M3 6h18" }],
    ["path", { "d": "M16 10a4 4 0 0 1-8 0" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "shopping-bag" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_isAuthenticated;
  let $user, $$unsubscribe_user;
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_user();
  return `${$$result.head += `<!-- HEAD_svelte-18hyblv_START -->${$$result.title = `<title>My Account | Damned Designs</title>`, ""}<meta name="description" content="Manage your Damned Designs account, view orders, and update your profile."><!-- HEAD_svelte-18hyblv_END -->`, ""} <div class="container py-12">${$user ? `<h1 class="text-3xl font-bold mb-8" data-svelte-h="svelte-bolj7o">My Account</h1> <div class="grid grid-cols-1 md:grid-cols-4 gap-8"> <div class="bg-gray-50 p-6 rounded-lg shadow-sm"><div class="flex items-center mb-6"><div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">${validate_component(User, "User").$$render($$result, { size: 24 }, {}, {})}</div> <div class="ml-4"><p class="font-bold">${escape($user.firstName)} ${escape($user.lastName)}</p> <p class="text-sm text-gray-600">${escape($user.email)}</p></div></div> <nav class="space-y-2"><button${add_attribute(
    "class",
    `w-full flex items-center p-3 rounded-md transition-colors ${"bg-primary text-white"}`,
    0
  )}>${validate_component(Shopping_bag, "ShoppingBag").$$render($$result, { size: 18, class: "mr-3" }, {}, {})} <span data-svelte-h="svelte-1d7fyiv">My Orders</span></button> <button${add_attribute(
    "class",
    `w-full flex items-center p-3 rounded-md transition-colors ${"hover:bg-gray-200"}`,
    0
  )}>${validate_component(User, "User").$$render($$result, { size: 18, class: "mr-3" }, {}, {})} <span data-svelte-h="svelte-pjez1p">Profile</span></button> <button${add_attribute(
    "class",
    `w-full flex items-center p-3 rounded-md transition-colors ${"hover:bg-gray-200"}`,
    0
  )}>${validate_component(Package, "Package").$$render($$result, { size: 18, class: "mr-3" }, {}, {})} <span data-svelte-h="svelte-id0bvy">Addresses</span></button> <button${add_attribute(
    "class",
    `w-full flex items-center p-3 rounded-md transition-colors ${"hover:bg-gray-200"}`,
    0
  )}>${validate_component(Credit_card, "CreditCard").$$render($$result, { size: 18, class: "mr-3" }, {}, {})} <span data-svelte-h="svelte-stplkq">Payment Methods</span></button> <button${add_attribute(
    "class",
    `w-full flex items-center p-3 rounded-md transition-colors ${"hover:bg-gray-200"}`,
    0
  )}>${validate_component(Settings, "Settings").$$render($$result, { size: 18, class: "mr-3" }, {}, {})} <span data-svelte-h="svelte-2ly3re">Account Settings</span></button> <button class="w-full flex items-center p-3 rounded-md text-red-500 hover:bg-red-50 transition-colors">${validate_component(Log_out, "LogOut").$$render($$result, { size: 18, class: "mr-3" }, {}, {})} <span data-svelte-h="svelte-1rheak">Logout</span></button></nav></div>  <div class="md:col-span-3 bg-white p-6 rounded-lg shadow-sm">${`<h2 class="text-2xl font-bold mb-6" data-svelte-h="svelte-eelrbp">My Orders</h2> ${$user.orders.length === 0 ? `<div class="text-center py-8">${validate_component(Shopping_bag, "ShoppingBag").$$render(
    $$result,
    {
      size: 48,
      class: "mx-auto mb-4 text-gray-400"
    },
    {},
    {}
  )} <p class="text-xl font-bold mb-2" data-svelte-h="svelte-1fowc14">No orders yet</p> <p class="text-gray-600 mb-6" data-svelte-h="svelte-czza4n">You haven&#39;t placed any orders yet.</p> <a href="/products" class="btn btn-primary" data-svelte-h="svelte-gm14on">Browse Products</a></div>` : `<div class="space-y-6">${each($user.orders, (order) => {
    return `<div class="border border-gray-200 rounded-lg overflow-hidden"><div class="bg-gray-50 p-4 flex flex-wrap justify-between items-center"><div><p class="font-bold">Order #${escape(order.id)}</p> <p class="text-sm text-gray-600">Placed on ${escape(new Date(order.date).toLocaleDateString())}</p></div> <div class="flex items-center"><span${add_attribute(
      "class",
      `px-3 py-1 rounded-full text-xs font-medium ${order.status === "delivered" ? "bg-green-100 text-green-800" : order.status === "shipped" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`,
      0
    )}>${escape(order.status.charAt(0).toUpperCase() + order.status.slice(1))}</span> <span class="ml-4 font-bold">$${escape(order.total.toFixed(2))}</span> </div></div> <div class="p-4"><h3 class="font-bold mb-3" data-svelte-h="svelte-spqksp">Items</h3> <div class="space-y-3">${each(order.items, (item) => {
      return `<div class="flex items-center"><div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0"><img${add_attribute("src", item.image, 0)}${add_attribute("alt", item.name, 0)} class="w-full h-full object-cover"></div> <div class="ml-4 flex-grow"><p class="font-medium">${escape(item.name)}</p> <p class="text-sm text-gray-600">Quantity: ${escape(item.quantity)}</p></div> <div class="text-right"><p class="font-bold">$${escape((item.price * item.quantity).toFixed(2))}</p> <p class="text-sm text-gray-600">$${escape(item.price.toFixed(2))} each</p></div> </div>`;
    })} </div></div> <div class="bg-gray-50 p-4 flex justify-end"><a${add_attribute("href", `/account/orders/${order.id}`, 0)} class="btn btn-primary">View Order Details
                    </a></div> </div>`;
  })}</div>`}`}</div></div>` : ``}</div>`;
});
export {
  Page as default
};
