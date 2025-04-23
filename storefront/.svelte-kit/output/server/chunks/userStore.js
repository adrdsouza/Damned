import { w as writable } from "./index2.js";
import { c as createMedusaClient } from "./medusa.js";
import "./Toaster.svelte_svelte_type_style_lang.js";
let medusaClient;
try {
  medusaClient = createMedusaClient();
} catch (error) {
  console.error("Error initializing Medusa client:", error);
}
async function getCustomerOrders() {
  return [];
}
async function getOrderById(id) {
  return null;
}
const user = writable(null);
const isAuthenticated = writable(false);
export {
  getCustomerOrders as a,
  getOrderById as g,
  isAuthenticated as i,
  user as u
};
