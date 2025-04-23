import { a as set_store_value, s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, v as validate_component, g as add_attribute, e as escape } from "../../../chunks/ssr.js";
import { s as superForm } from "../../../chunks/index3.js";
import { z } from "zod";
import { t as toast } from "../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { C as Chevron_right } from "../../../chunks/chevron-right.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $form, $$unsubscribe_form;
  let $errors, $$unsubscribe_errors;
  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters"
    }),
    email: z.string().email({
      message: "Please enter a valid email address"
    }),
    subject: z.string().min(2, { message: "Subject is required" }),
    message: z.string().min(10, {
      message: "Message must be at least 10 characters"
    })
  });
  const { form, errors } = superForm(formSchema, {
    id: "contact",
    dataType: "json",
    onSubmit: () => {
      return { success: true };
    },
    onResult: ({ result }) => {
      if (result.type === "success") {
        toast.success("Message sent successfully! We'll get back to you soon.");
        set_store_value(
          form,
          $form = {
            name: "",
            email: "",
            subject: "",
            message: ""
          },
          $form
        );
      }
    }
  });
  $$unsubscribe_form = subscribe(form, (value) => $form = value);
  $$unsubscribe_errors = subscribe(errors, (value) => $errors = value);
  $$unsubscribe_form();
  $$unsubscribe_errors();
  return `${$$result.head += `<!-- HEAD_svelte-1hbyces_START -->${$$result.title = `<title>Contact Us | Damned Designs</title>`, ""}<meta name="description" content="Get in touch with Damned Designs. We'd love to hear from you about our products, answer your questions, or discuss custom orders."><!-- HEAD_svelte-1hbyces_END -->`, ""} <div class="container py-12"><div class="flex items-center text-sm mb-6"><a href="/" class="hover:underline" data-svelte-h="svelte-18kg8x7">Home</a> ${validate_component(Chevron_right, "ChevronRight").$$render($$result, { size: 16, class: "mx-2" }, {}, {})} <span data-svelte-h="svelte-1xzlcee">Contact Us</span></div> <div class="max-w-4xl mx-auto"><h1 class="text-4xl font-bold mb-8" data-svelte-h="svelte-1rf3sbe">Contact Us</h1> <div class="grid grid-cols-1 md:grid-cols-2 gap-12"><div data-svelte-h="svelte-4wff3r"><p class="mb-6">We&#39;d love to hear from you! Whether you have questions about our products, need assistance with an order, or want to discuss a custom design, our team is here to help.</p> <div class="space-y-6"><div><h3 class="text-lg font-bold mb-2">Email</h3> <p>info@damneddesigns.com</p></div> <div><h3 class="text-lg font-bold mb-2">Phone</h3> <p>+1 (555) 123-4567</p></div> <div><h3 class="text-lg font-bold mb-2">Hours</h3> <p>Monday - Friday: 9am - 5pm EST</p> <p>Saturday: 10am - 3pm EST</p> <p>Sunday: Closed</p></div> <div><h3 class="text-lg font-bold mb-2">Social Media</h3> <div class="flex space-x-4"><a href="#" class="text-primary hover:text-gray-700">Instagram</a> <a href="#" class="text-primary hover:text-gray-700">Facebook</a> <a href="#" class="text-primary hover:text-gray-700">Twitter</a></div></div></div></div> <div><h2 class="text-2xl font-bold mb-6" data-svelte-h="svelte-bt2h32">Send us a message</h2> <form method="POST"><div class="mb-4"><label for="name" class="block mb-2 font-bold" data-svelte-h="svelte-ps0smr">Name</label> <input type="text" id="name" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"${add_attribute("value", $form.name, 0)}> ${$errors.name ? `<p class="text-red-500 text-sm mt-1">${escape($errors.name)}</p>` : ``}</div> <div class="mb-4"><label for="email" class="block mb-2 font-bold" data-svelte-h="svelte-86kff7">Email</label> <input type="email" id="email" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"${add_attribute("value", $form.email, 0)}> ${$errors.email ? `<p class="text-red-500 text-sm mt-1">${escape($errors.email)}</p>` : ``}</div> <div class="mb-4"><label for="subject" class="block mb-2 font-bold" data-svelte-h="svelte-6im7ab">Subject</label> <input type="text" id="subject" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"${add_attribute("value", $form.subject, 0)}> ${$errors.subject ? `<p class="text-red-500 text-sm mt-1">${escape($errors.subject)}</p>` : ``}</div> <div class="mb-6"><label for="message" class="block mb-2 font-bold" data-svelte-h="svelte-1rxvk2n">Message</label> <textarea id="message" rows="5" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">${escape($form.message || "")}</textarea> ${$errors.message ? `<p class="text-red-500 text-sm mt-1">${escape($errors.message)}</p>` : ``}</div> <button type="submit" class="btn btn-primary w-full" data-svelte-h="svelte-lpay2f">Send Message</button></form></div></div></div></div>`;
});
export {
  Page as default
};
