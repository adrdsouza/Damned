import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, e as escape, g as add_attribute, h as each } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/client.js";
import { i as isAuthenticated, u as user } from "../../../../../chunks/userStore.js";
import "../../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { H as Home } from "../../../../../chunks/home.js";
import { C as Chevron_right } from "../../../../../chunks/chevron-right.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { T as Truck } from "../../../../../chunks/truck.js";
import { P as Package } from "../../../../../chunks/package.js";
const Alert_triangle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
      }
    ],
    ["path", { "d": "M12 9v4" }],
    ["path", { "d": "M12 17h.01" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "alert-triangle" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Arrow_left = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "m12 19-7-7 7-7" }], ["path", { "d": "M19 12H5" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "arrow-left" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const File_edit = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5"
      }
    ],
    ["polyline", { "points": "14 2 14 8 20 8" }],
    [
      "path",
      {
        "d": "M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "file-edit" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let canCancel;
  let canUpdateAddress;
  let formattedDate;
  let statusTimeline;
  let $$unsubscribe_isAuthenticated;
  let $user, $$unsubscribe_user;
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  $$unsubscribe_user = subscribe(user, (value) => $user = value);
  let { data } = $$props;
  let order = data.order;
  function getStatusTimeline() {
    const allStatuses = [
      {
        key: "pending",
        label: "Order Placed",
        description: "We received your order"
      },
      {
        key: "processing",
        label: "Processing",
        description: "Your order is being processed"
      },
      {
        key: "shipped",
        label: "Shipped",
        description: "Your order is on the way"
      },
      {
        key: "delivered",
        label: "Delivered",
        description: "Your order has been delivered"
      }
    ];
    const currentIndex = allStatuses.findIndex((status) => status.key === order.status);
    return allStatuses.map((status, index) => ({
      ...status,
      complete: index <= currentIndex,
      current: status.key === order.status
    }));
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  canCancel = ["pending", "processing"].includes(order.status);
  canUpdateAddress = ["pending", "processing"].includes(order.status) && !order.shipped;
  formattedDate = new Date(order.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  statusTimeline = getStatusTimeline();
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_user();
  return `${$$result.head += `<!-- HEAD_svelte-12n71zm_START -->${$$result.title = `<title>Order #${escape(order.id)} | Damned Designs</title>`, ""}<meta name="description" content="View your order details and status"><!-- HEAD_svelte-12n71zm_END -->`, ""} <div class="container py-12"><div class="flex items-center text-sm mb-6"><a href="/" class="hover:underline">${validate_component(Home, "Home").$$render($$result, { size: 14, class: "inline mb-0.5" }, {}, {})}</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 14, class: "mx-1" }, {}, {})} <a href="/account" class="hover:underline" data-svelte-h="svelte-jrfepy">My Account</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 14, class: "mx-1" }, {}, {})} <span>Order #${escape(order.id)}</span></div> <div class="flex items-center mb-8"><button class="flex items-center text-gray-600 hover:text-gray-900">${validate_component(Arrow_left, "ArrowLeft").$$render($$result, { size: 16, class: "mr-1" }, {}, {})} <span data-svelte-h="svelte-1hjsk7z">Back to Orders</span></button></div> <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <div class="lg:col-span-2 space-y-6"> <div class="bg-white p-6 rounded-lg shadow-sm"><div class="flex flex-wrap justify-between items-start mb-4"><div><h1 class="text-2xl font-bold">Order #${escape(order.id)}</h1> <p class="text-gray-600">Placed on ${escape(formattedDate)}</p></div> <div><span${add_attribute(
    "class",
    `px-3 py-1 rounded-full text-sm font-medium ${order.status === "delivered" ? "bg-green-100 text-green-800" : order.status === "shipped" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`,
    0
  )}>${escape(order.status.charAt(0).toUpperCase() + order.status.slice(1))}</span></div></div>  <div class="mb-8"><div class="flex items-center justify-between relative text-sm"> <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div> <div class="absolute top-1/2 left-0 h-0.5 bg-green-500 -z-10"${add_attribute("style", `width: ${statusTimeline.filter((s) => s.complete).length / statusTimeline.length * 100}%`, 0)}></div> ${each(statusTimeline, (status, i) => {
    return `<div class="flex flex-col items-center"><div${add_attribute(
      "class",
      `w-8 h-8 rounded-full flex items-center justify-center mb-2 ${status.complete ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"}`,
      0
    )}>${status.complete ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>` : `${escape(i + 1)}`}</div> <div${add_attribute("class", `font-medium ${status.current ? "text-green-600" : ""}`, 0)}>${escape(status.label)}</div> </div>`;
  })}</div></div>  <div class="flex flex-wrap gap-4 mt-6">${canCancel ? `<button class="btn btn-outline border-red-500 text-red-500 hover:bg-red-50 flex-1 pointer-events-auto">${validate_component(Alert_triangle, "AlertTriangle").$$render($$result, { size: 16, class: "mr-2" }, {}, {})} 
              Request Cancellation</button>` : `<button class="btn btn-outline border-gray-300 text-gray-400 flex-1 pointer-events-auto" disabled title="Order cannot be cancelled at this time">${validate_component(Alert_triangle, "AlertTriangle").$$render($$result, { size: 16, class: "mr-2" }, {}, {})} 
              Request Cancellation</button>`} ${canUpdateAddress ? `<button class="btn btn-outline border-primary text-primary hover:bg-gray-50 flex-1 pointer-events-auto">${validate_component(File_edit, "Edit").$$render($$result, { size: 16, class: "mr-2" }, {}, {})} 
              Update Address</button>` : `<button class="btn btn-outline border-gray-300 text-gray-400 flex-1 pointer-events-auto" disabled title="Address cannot be changed at this time">${validate_component(File_edit, "Edit").$$render($$result, { size: 16, class: "mr-2" }, {}, {})} 
              Update Address</button>`}</div></div>  <div class="bg-white p-6 rounded-lg shadow-sm"><h2 class="text-xl font-bold mb-6" data-svelte-h="svelte-1g1u8mw">Order Items</h2> <div class="space-y-6">${each(order.items, (item) => {
    return `<div class="flex border-b border-gray-100 pb-6 last:border-0 last:pb-0 first:mt-0 mt-6"><div class="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0"><img${add_attribute("src", item.image, 0)}${add_attribute("alt", item.name, 0)} class="w-full h-full object-cover"></div> <div class="ml-6 flex-grow"><div class="flex justify-between"><div><h3 class="font-bold text-lg">${escape(item.name)}</h3> <p class="text-gray-600">Quantity: ${escape(item.quantity)}</p></div> <div class="text-right"><p class="font-bold">$${escape((item.price * item.quantity).toFixed(2))}</p> <p class="text-sm text-gray-500">$${escape(item.price.toFixed(2))} each</p></div> </div></div> </div>`;
  })}</div></div>  <div class="bg-white p-6 rounded-lg shadow-sm"><h2 class="text-xl font-bold mb-6" data-svelte-h="svelte-tybnxk">Shipping Information</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div><h3 class="font-bold mb-3 text-lg flex items-center">${validate_component(Truck, "Truck").$$render($$result, { size: 18, class: "mr-2" }, {}, {})}
              Shipping Address</h3> <div class="bg-gray-50 p-4 rounded-lg"><p>${escape(order.shippingAddress?.name || ($user ? `${$user.firstName} ${$user.lastName}` : "John Doe"))}</p> <p>${escape(order.shippingAddress?.address_1 || "123 Main Street")}</p> ${order.shippingAddress?.address_2 ? `<p>${escape(order.shippingAddress.address_2)}</p>` : ``} <p>${escape(order.shippingAddress?.city || "Anytown")}, ${escape(order.shippingAddress?.province || "CA")} ${escape(order.shippingAddress?.postal_code || "12345")}</p> <p>${escape(order.shippingAddress?.country_code === "US" ? "United States" : order.shippingAddress?.country_code === "CA" ? "Canada" : order.shippingAddress?.country_code === "GB" ? "United Kingdom" : order.shippingAddress?.country_code === "AU" ? "Australia" : "United States")}</p></div></div> <div><h3 class="font-bold mb-3 text-lg flex items-center">${validate_component(Package, "Package").$$render($$result, { size: 18, class: "mr-2" }, {}, {})}
              Shipping Method</h3> <div class="bg-gray-50 p-4 rounded-lg"><p class="font-medium" data-svelte-h="svelte-u2t8ex">Standard Shipping</p> <p class="text-gray-600" data-svelte-h="svelte-grks8p">Estimated delivery: 3-5 business days</p> ${order.status === "shipped" || order.status === "delivered" ? `<div class="mt-4 pt-4 border-t border-gray-200"><p class="font-medium" data-svelte-h="svelte-1pr0hae">Tracking Number</p> <p class="text-primary hover:underline"><a href="${"https://track.carrier.com/" + escape(order.trackingNumber || "123456789", true)}" target="_blank" rel="noopener noreferrer">${escape(order.trackingNumber || "123456789")}</a></p></div>` : ``}</div></div></div></div></div>  <div class="lg:col-span-1"><div class="bg-white p-6 rounded-lg shadow-sm sticky top-24"><h2 class="text-xl font-bold mb-4" data-svelte-h="svelte-15tekmy">Order Summary</h2> <div class="space-y-3"><div class="flex justify-between"><span class="text-gray-600" data-svelte-h="svelte-7e8d7b">Subtotal</span> <span>$${escape((order.total * 0.9).toFixed(2))}</span></div> <div class="flex justify-between"><span class="text-gray-600" data-svelte-h="svelte-13tv6k5">Shipping</span> <span>$${escape((order.total * 0.1).toFixed(2))}</span></div> <div class="flex justify-between" data-svelte-h="svelte-r8rb4f"><span class="text-gray-600">Tax</span> <span>$0.00</span></div> <div class="pt-3 border-t border-gray-200 mt-3 flex justify-between font-bold"><span data-svelte-h="svelte-2fqrek">Total</span> <span>$${escape(order.total.toFixed(2))}</span></div></div> <div class="mt-8" data-svelte-h="svelte-18809xj"><h3 class="font-bold mb-2">Need Help?</h3> <p class="text-sm text-gray-600 mb-4">If you have any questions about your order, please contact our customer service team.</p> <a href="/contact" class="btn btn-primary w-full pointer-events-auto">Contact Us</a></div></div></div></div></div>  ${``}  ${``}`;
});
export {
  Page as default
};
