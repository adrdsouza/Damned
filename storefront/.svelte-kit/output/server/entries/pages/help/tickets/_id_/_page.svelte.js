import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, e as escape } from "../../../../../chunks/ssr.js";
import { p as page } from "../../../../../chunks/stores.js";
import "../../../../../chunks/client.js";
import { i as isAuthenticated } from "../../../../../chunks/userStore.js";
import "../../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { C as Chevron_right } from "../../../../../chunks/chevron-right.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_isAuthenticated;
  let $page, $$unsubscribe_page;
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const ticketId = $page.params.id;
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-zezef6_START -->${$$result.title = `<title>Support Ticket #${escape(ticketId)} | Damned Designs</title>`, ""}<meta name="description" content="View and manage your support ticket with Damned Designs customer service."><!-- HEAD_svelte-zezef6_END -->`, ""} <div class="container py-12"><div class="flex items-center text-sm mb-6"><a href="/" class="hover:underline" data-svelte-h="svelte-18kg8x7">Home</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <a href="/help" class="hover:underline" data-svelte-h="svelte-ilfw5s">Support</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <a href="/help/tickets" class="hover:underline" data-svelte-h="svelte-sz1i1m">My Tickets</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <span>Ticket #${escape(ticketId)}</span></div> ${`<div class="flex justify-center items-center py-12" data-svelte-h="svelte-2o2p7e"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>`}</div>`;
});
export {
  Page as default
};
