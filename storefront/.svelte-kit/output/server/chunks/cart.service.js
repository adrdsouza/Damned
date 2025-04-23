import { c as createMedusaClient } from "./medusa.js";
import "./Toaster.svelte_svelte_type_style_lang.js";
let medusaClient;
try {
  medusaClient = createMedusaClient();
} catch (error) {
  console.error("Error initializing Medusa client in cart service:", error);
}
