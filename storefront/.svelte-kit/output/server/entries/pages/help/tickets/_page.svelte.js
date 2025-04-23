import { s as subscribe } from "../../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, g as add_attribute } from "../../../../chunks/ssr.js";
import "../../../../chunks/client.js";
import { i as isAuthenticated } from "../../../../chunks/userStore.js";
import "../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { C as Chevron_right } from "../../../../chunks/chevron-right.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { S as Search } from "../../../../chunks/search.js";
const Filter = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "polygon",
      {
        "points": "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "filter" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
let itemsPerPage = 10;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let filteredTickets;
  let $$unsubscribe_isAuthenticated;
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  let tickets = [];
  let searchQuery = "";
  let currentPage = 1;
  filteredTickets = tickets.filter((ticket) => searchQuery === "");
  filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  Math.ceil(filteredTickets.length / itemsPerPage);
  $$unsubscribe_isAuthenticated();
  return `${$$result.head += `<!-- HEAD_svelte-vpnv56_START -->${$$result.title = `<title>My Support Tickets | Damned Designs</title>`, ""}<meta name="description" content="View and manage your support tickets with Damned Designs customer service."><!-- HEAD_svelte-vpnv56_END -->`, ""} <div class="container py-12"><div class="flex items-center text-sm mb-6"><a href="/" class="hover:underline" data-svelte-h="svelte-18kg8x7">Home</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <a href="/help" class="hover:underline" data-svelte-h="svelte-ilfw5s">Support</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <span data-svelte-h="svelte-12dy76h">My Tickets</span></div> <div class="flex justify-between items-center mb-8"><h1 class="text-3xl font-bold" data-svelte-h="svelte-1enelet">My Support Tickets</h1> <a href="/help/tickets/new" class="btn btn-primary flex items-center">${validate_component(Plus, "Plus").$$render($$result, { size: 18, class: "mr-2" }, {}, {})}
      New Ticket</a></div>  <div class="bg-white p-6 rounded-lg shadow-sm mb-8"><div class="flex flex-col md:flex-row md:items-center gap-4"><div class="flex items-center">${validate_component(Filter, "Filter").$$render($$result, { size: 18, class: "mr-2 text-gray-500" }, {}, {})} <span class="font-bold" data-svelte-h="svelte-1jf26qt">Filters:</span></div> <div class="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow"><div><label for="statusFilter" class="block text-sm font-medium text-gray-700 mb-1" data-svelte-h="svelte-qfpi0t">Status</label> <select id="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"><option value="all" data-svelte-h="svelte-gifdaw">All Statuses</option><option value="open" data-svelte-h="svelte-14z723y">Open</option><option value="in_progress" data-svelte-h="svelte-7y42mr">In Progress</option><option value="resolved" data-svelte-h="svelte-1tursri">Resolved</option><option value="closed" data-svelte-h="svelte-106rur2">Closed</option></select></div> <div><label for="categoryFilter" class="block text-sm font-medium text-gray-700 mb-1" data-svelte-h="svelte-1k8fob1">Category</label> <select id="categoryFilter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"><option value="all" data-svelte-h="svelte-16sr5ty">All Categories</option><option value="technical" data-svelte-h="svelte-klluco">Technical</option><option value="billing" data-svelte-h="svelte-8j0nno">Billing</option><option value="shipping" data-svelte-h="svelte-1b8huzi">Shipping</option><option value="product" data-svelte-h="svelte-79gbsw">Product</option><option value="other" data-svelte-h="svelte-902jce">Other</option></select></div> <div><label for="priorityFilter" class="block text-sm font-medium text-gray-700 mb-1" data-svelte-h="svelte-1hra1ux">Priority</label> <select id="priorityFilter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"><option value="all" data-svelte-h="svelte-1c1d6wy">All Priorities</option><option value="low" data-svelte-h="svelte-1f4z4ku">Low</option><option value="medium" data-svelte-h="svelte-1u6j0ru">Medium</option><option value="high" data-svelte-h="svelte-poeh2m">High</option><option value="urgent" data-svelte-h="svelte-pwtzze">Urgent</option></select></div> <div><label for="searchQuery" class="block text-sm font-medium text-gray-700 mb-1" data-svelte-h="svelte-1se0bj1">Search</label> <div class="relative"><input id="searchQuery" type="text" placeholder="Search tickets..." class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"${add_attribute("value", searchQuery, 0)}> <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">${validate_component(Search, "Search").$$render($$result, { size: 16 }, {}, {})}</div></div></div></div></div></div> ${`<div class="flex justify-center items-center py-12" data-svelte-h="svelte-2o2p7e"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>`}</div>`;
});
export {
  Page as default
};
