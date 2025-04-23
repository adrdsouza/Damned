import { s as subscribe } from "../../../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, g as add_attribute, e as escape, h as each } from "../../../../../chunks/ssr.js";
import { g as goto } from "../../../../../chunks/client.js";
import { u as user, i as isAuthenticated } from "../../../../../chunks/userStore.js";
import { t as toast } from "../../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { z } from "zod";
import { s as superForm } from "../../../../../chunks/index3.js";
import { C as Chevron_right } from "../../../../../chunks/chevron-right.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_user;
  let $$unsubscribe_isAuthenticated;
  let $form, $$unsubscribe_form;
  let $errors, $$unsubscribe_errors;
  $$unsubscribe_user = subscribe(user, (value) => value);
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  const ticketSchema = z.object({
    subject: z.string().min(5, {
      message: "Subject must be at least 5 characters"
    }),
    description: z.string().min(20, {
      message: "Description must be at least 20 characters"
    }),
    category: z.enum(["technical", "billing", "shipping", "product", "other"], {
      required_error: "Please select a category"
    }),
    priority: z.enum(["low", "medium", "high", "urgent"], {
      required_error: "Please select a priority"
    }),
    order_id: z.string().optional()
  });
  const { form, errors } = superForm(ticketSchema, {
    id: "new-ticket",
    dataType: "json",
    onSubmit: async ({ formData, cancel }) => {
      try {
        const response = await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: formData.get("subject"),
            description: formData.get("description"),
            category: formData.get("category"),
            priority: formData.get("priority"),
            order_id: formData.get("order_id")
          })
        });
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to create ticket");
          cancel();
          return;
        }
        return { success: true };
      } catch (error) {
        console.error("Error creating ticket:", error);
        toast.error("Failed to create ticket. Please try again.");
        cancel();
      }
    },
    onResult: ({ result }) => {
      if (result.type === "success") {
        toast.success("Ticket submitted successfully!");
        goto();
      }
    }
  });
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  let orders = [];
  $$unsubscribe_user();
  $$unsubscribe_isAuthenticated();
  $$unsubscribe_form();
  $$unsubscribe_errors();
  return `${$$result.head += `<!-- HEAD_svelte-42sapk_START -->${$$result.title = `<title>Create New Support Ticket | Damned Designs</title>`, ""}<meta name="description" content="Submit a new support ticket to get help from our customer service team."><!-- HEAD_svelte-42sapk_END -->`, ""} <div class="container py-12"><div class="flex items-center text-sm mb-6"><a href="/" class="hover:underline" data-svelte-h="svelte-18kg8x7">Home</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <a href="/help" class="hover:underline" data-svelte-h="svelte-ilfw5s">Support</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <a href="/help/tickets" class="hover:underline" data-svelte-h="svelte-sz1i1m">My Tickets</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <span data-svelte-h="svelte-1nv8pk4">New Ticket</span></div> <h1 class="text-3xl font-bold mb-8" data-svelte-h="svelte-1wdziuy">Create New Support Ticket</h1> <div class="max-w-3xl mx-auto"><div class="bg-white p-8 rounded-lg shadow-sm"><form class="space-y-6"><div><label for="subject" class="block font-bold mb-2" data-svelte-h="svelte-2dlkgw">Subject <span class="text-red-500">*</span></label> <input type="text" id="subject" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Brief summary of your issue"${add_attribute("value", $form.subject, 0)}> ${$errors.subject ? `<p class="text-red-500 text-sm mt-1">${escape($errors.subject)}</p>` : ``}</div> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label for="category" class="block font-bold mb-2" data-svelte-h="svelte-4ldsdi">Category <span class="text-red-500">*</span></label> <select id="category" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"><option value="" disabled selected data-svelte-h="svelte-1k1xi34">Select a category</option><option value="technical" data-svelte-h="svelte-klluco">Technical</option><option value="billing" data-svelte-h="svelte-8j0nno">Billing</option><option value="shipping" data-svelte-h="svelte-1b8huzi">Shipping</option><option value="product" data-svelte-h="svelte-79gbsw">Product</option><option value="other" data-svelte-h="svelte-902jce">Other</option></select> ${$errors.category ? `<p class="text-red-500 text-sm mt-1">${escape($errors.category)}</p>` : ``}</div> <div><label for="priority" class="block font-bold mb-2" data-svelte-h="svelte-65fw2a">Priority <span class="text-red-500">*</span></label> <select id="priority" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"><option value="" disabled selected data-svelte-h="svelte-8w0r7g">Select a priority</option><option value="low" data-svelte-h="svelte-1f4z4ku">Low</option><option value="medium" data-svelte-h="svelte-1u6j0ru">Medium</option><option value="high" data-svelte-h="svelte-poeh2m">High</option><option value="urgent" data-svelte-h="svelte-pwtzze">Urgent</option></select> ${$errors.priority ? `<p class="text-red-500 text-sm mt-1">${escape($errors.priority)}</p>` : ``}</div></div> ${orders.length > 0 ? `<div><label for="order_id" class="block font-bold mb-2" data-svelte-h="svelte-l7bbm1">Related Order (Optional)</label> <select id="order_id" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"><option value="" data-svelte-h="svelte-1vbnolo">None</option>${each(orders, (order) => {
    return `<option${add_attribute("value", order.id, 0)}>Order #${escape(order.id)} - ${escape(order.date)} ($${escape(order.total.toFixed(2))})</option>`;
  })}</select></div>` : ``} <div><label for="description" class="block font-bold mb-2" data-svelte-h="svelte-em6yis">Description <span class="text-red-500">*</span></label> <textarea id="description" rows="6" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Please provide as much detail as possible about your issue">${escape($form.description || "")}</textarea> ${$errors.description ? `<p class="text-red-500 text-sm mt-1">${escape($errors.description)}</p>` : ``}</div> <div class="pt-4" data-svelte-h="svelte-1v2xyqd"><button type="submit" class="btn btn-primary w-full">Submit Ticket</button></div></form></div> <div class="mt-8 bg-gray-50 p-6 rounded-lg" data-svelte-h="svelte-1lgncf"><h2 class="text-xl font-bold mb-4">Before Submitting a Ticket</h2> <p class="mb-4">To help us resolve your issue more quickly, please:</p> <ul class="list-disc pl-5 space-y-2 text-gray-700"><li>Check our <a href="/help" class="text-primary hover:underline">FAQ section</a> to see if your question has already been answered</li> <li>Include any relevant order numbers or product information</li> <li>Be as specific as possible about the issue you&#39;re experiencing</li> <li>Attach screenshots or photos if they help illustrate the problem</li></ul></div></div></div>`;
});
export {
  Page as default
};
