import { s as subscribe } from "../../../chunks/utils.js";
import { c as create_ssr_component, g as add_attribute, e as escape } from "../../../chunks/ssr.js";
import { i as isAuthenticated } from "../../../chunks/userStore.js";
import "../../../chunks/client.js";
import "../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_isAuthenticated;
  $$unsubscribe_isAuthenticated = subscribe(isAuthenticated, (value) => value);
  let email = "user@example.com";
  let password = "password";
  let rememberMe = false;
  $$unsubscribe_isAuthenticated();
  return `${$$result.head += `<!-- HEAD_svelte-tqo2f0_START -->${$$result.title = `<title>Login | Damned Designs</title>`, ""}<meta name="description" content="Log in to your Damned Designs account to view orders, manage your profile, and more."><!-- HEAD_svelte-tqo2f0_END -->`, ""} <div class="container py-12"><div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"><h1 class="text-3xl font-bold mb-6 text-center" data-svelte-h="svelte-wxscdp">Login</h1> <form class="space-y-6"><div><label for="email" class="block mb-2 font-bold" data-svelte-h="svelte-86kff7">Email</label> <input type="email" id="email" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto" placeholder="your@email.com" ${""}${add_attribute("value", email, 0)}></div> <div><label for="password" class="block mb-2 font-bold" data-svelte-h="svelte-11ixk5b">Password</label> <input type="password" id="password" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto" placeholder="••••••••" ${""}${add_attribute("value", password, 0)}></div> <div class="flex items-center justify-between"><div class="flex items-center"><input type="checkbox" id="remember" class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded pointer-events-auto"${add_attribute("checked", rememberMe, 1)}> <label for="remember" class="ml-2 block text-sm text-gray-700" data-svelte-h="svelte-124evir">Remember me</label></div> <a href="/forgot-password" class="text-sm text-primary hover:underline" data-svelte-h="svelte-12en3n2">Forgot password?</a></div> ${``} <div><button type="submit" class="w-full btn btn-primary pointer-events-auto" ${""}>${escape("Login")}</button></div> <div class="text-center mt-4" data-svelte-h="svelte-122tvca"><p class="text-sm text-gray-600">Don&#39;t have an account? 
          <a href="/register" class="text-primary hover:underline">Register</a></p></div></form></div></div>`;
});
export {
  Page as default
};
