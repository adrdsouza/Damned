import Medusa from "@medusajs/medusa-js";
const PUBLIC_MEDUSA_BACKEND_URL = "https://api.damneddesigns.com";
const PUBLIC_MEDUSA_STORE_ID = "";
const createMedusaClient = () => {
  try {
    const offlineMode = typeof localStorage !== "undefined" && (localStorage.getItem("medusa_offline_mode") === "true" || !PUBLIC_MEDUSA_BACKEND_URL);
    if (offlineMode) {
      console.log("Medusa client initialized in offline mode");
      return createFallbackClient();
    }
    const baseUrl = PUBLIC_MEDUSA_BACKEND_URL;
    if (!baseUrl) ;
    try {
      new URL(baseUrl);
    } catch (e) {
      console.error("Invalid Medusa backend URL format:", baseUrl);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("medusa_offline_mode", "true");
      }
      return createFallbackClient();
    }
    const medusaClient = new Medusa({
      baseUrl,
      maxRetries: 3,
      headers: {
        "Accept-Version": "2022-01-01",
        "Content-Type": "application/json"
      },
      // Type assertion for custom headers
      publishableApiKey: PUBLIC_MEDUSA_STORE_ID
    });
    const pingPromise = fetch(`${baseUrl}/health`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(3e3)
      // 3s timeout for health check
    }).catch((err) => {
      console.warn("Medusa health check failed:", err.message);
      throw new Error("Medusa backend unreachable");
    });
    pingPromise.catch((err) => {
      console.log("Setting offline mode due to failed health check");
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("medusa_offline_mode", "true");
        setTimeout(() => {
          localStorage.removeItem("medusa_offline_mode");
        }, 5 * 60 * 1e3);
      }
    });
    return {
      products: {
        list: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const options = args[0] || {};
            const enhancedArgs = [{
              ...options,
              signal: controller.signal
            }];
            const result = await medusaClient.products.list(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            console.error("Error fetching products:", error);
            return { products: [] };
          }
        },
        retrieve: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const options = { ...args[1] || {} };
            const enhancedArgs = [args[0], { ...options, signal: controller.signal }];
            const result = await medusaClient.products.retrieve(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            console.error("Error fetching product:", error);
            return { product: null };
          }
        }
      },
      carts: {
        create: async (...args) => {
          try {
            if (typeof localStorage !== "undefined" && localStorage.getItem("medusa_offline_mode") === "true") {
              console.log("Skipping cart creation - offline mode active");
              return { cart: null };
            }
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const options = args[0] || {};
            const enhancedArgs = [{
              ...options,
              signal: controller.signal
            }];
            const result = await medusaClient.carts.create(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            if (error.name === "AbortError" || error.message === "Request timeout") {
              console.error("Cart creation request timed out");
              return { cart: null };
            } else if (error.message?.includes("Network Error") || error.code === "ECONNREFUSED" || error.name === "TypeError" || error.message?.includes("Failed to fetch") || !error.response) {
              console.error("Network error creating cart - Medusa backend unreachable");
              if (typeof localStorage !== "undefined") {
                localStorage.setItem("medusa_offline_mode", "true");
                setTimeout(() => {
                  localStorage.removeItem("medusa_offline_mode");
                }, 5 * 60 * 1e3);
              }
              return { cart: null };
            } else {
              console.error("Error creating cart:", error);
              return { cart: null };
            }
          }
        },
        retrieve: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const cartId = args[0];
            const options = args[1] || {};
            const enhancedArgs = [cartId, { ...options, signal: controller.signal }];
            const result = await medusaClient.carts.retrieve(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            console.error("Error retrieving cart:", error);
            return { cart: null };
          }
        },
        update: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const cartId = args[0];
            const updateData = args[1] || {};
            const options = args[2] || {};
            const enhancedArgs = [cartId, updateData, { ...options, signal: controller.signal }];
            const result = await medusaClient.carts.update(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            console.error("Error updating cart:", error);
            return { cart: null };
          }
        },
        lineItems: {
          create: async (...args) => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8e3);
              const cartId = args[0];
              const item = args[1] || {};
              const options = args[2] || {};
              const enhancedArgs = [cartId, item, { ...options, signal: controller.signal }];
              const result = await medusaClient.carts.lineItems.create(...enhancedArgs);
              clearTimeout(timeoutId);
              return result;
            } catch (error) {
              console.error("Error adding item to cart:", error);
              return { cart: null };
            }
          },
          delete: async (...args) => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8e3);
              const cartId = args[0];
              const lineId = args[1];
              const options = args[2] || {};
              const enhancedArgs = [cartId, lineId, { ...options, signal: controller.signal }];
              const result = await medusaClient.carts.lineItems.delete(...enhancedArgs);
              clearTimeout(timeoutId);
              return result;
            } catch (error) {
              console.error("Error removing item from cart:", error);
              return { cart: null };
            }
          },
          update: async (...args) => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8e3);
              const cartId = args[0];
              const lineId = args[1];
              const item = args[2] || {};
              const options = args[3] || {};
              const enhancedArgs = [cartId, lineId, item, { ...options, signal: controller.signal }];
              const result = await medusaClient.carts.lineItems.update(...enhancedArgs);
              clearTimeout(timeoutId);
              return result;
            } catch (error) {
              console.error("Error updating item in cart:", error);
              return { cart: null };
            }
          }
        }
      },
      customers: {
        create: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const customerData = args[0] || {};
            const options = args[1] || {};
            const enhancedArgs = [customerData, { ...options, signal: controller.signal }];
            const result = await medusaClient.customers.create(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            console.error("Error creating customer:", error);
            return { customer: null };
          }
        },
        retrieve: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const options = args[0] || {};
            const enhancedArgs = [{ ...options, signal: controller.signal }];
            const result = await medusaClient.customers.retrieve(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            if (error.name === "AbortError" || error.message === "Request timeout" || error.message?.includes("Network Error") || error.code === "ECONNREFUSED" || error.name === "TypeError" || error.message?.includes("Failed to fetch") || !error.response) {
              console.error("Network error retrieving customer - Medusa backend unreachable");
              if (typeof localStorage !== "undefined") {
                localStorage.setItem("medusa_offline_mode", "true");
                setTimeout(() => {
                  localStorage.removeItem("medusa_offline_mode");
                }, 5 * 60 * 1e3);
              }
            } else {
              console.error("Error retrieving customer:", error);
            }
            return { customer: null };
          }
        },
        update: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const customerData = args[0] || {};
            const options = args[1] || {};
            const enhancedArgs = [customerData, { ...options, signal: controller.signal }];
            const result = await medusaClient.customers.update(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            console.error("Error updating customer:", error);
            return { customer: null };
          }
        },
        addresses: {
          addAddress: async (...args) => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8e3);
              const address = args[0] || {};
              const options = args[1] || {};
              const enhancedArgs = [address, { ...options, signal: controller.signal }];
              const result = await medusaClient.customers.addresses.addAddress(...enhancedArgs);
              clearTimeout(timeoutId);
              return result;
            } catch (error) {
              console.error("Error adding address:", error);
              return { customer: null };
            }
          }
        },
        listOrders: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const options = args[0] || {};
            const enhancedArgs = [{ ...options, signal: controller.signal }];
            const result = await medusaClient.customers.listOrders(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            console.error("Error listing orders:", error);
            return { orders: [] };
          }
        }
      },
      auth: {
        authenticate: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const credentials = args[0] || {};
            const options = args[1] || {};
            const enhancedArgs = [credentials, { ...options, signal: controller.signal }];
            const result = await medusaClient.auth.authenticate(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            if (error.name === "AbortError" || error.message === "Request timeout" || error.message?.includes("Network Error") || error.code === "ECONNREFUSED" || error.name === "TypeError" || error.message?.includes("Failed to fetch") || !error.response) {
              console.error("Network error during authentication - Medusa backend unreachable");
              if (typeof localStorage !== "undefined") {
                localStorage.setItem("medusa_offline_mode", "true");
                setTimeout(() => {
                  localStorage.removeItem("medusa_offline_mode");
                }, 5 * 60 * 1e3);
              }
            }
            console.error("Error authenticating:", error);
            throw error;
          }
        },
        deleteSession: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const options = args[0] || {};
            const enhancedArgs = [{ ...options, signal: controller.signal }];
            const result = await medusaClient.auth.deleteSession(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            console.error("Error deleting session:", error);
            return {};
          }
        }
      },
      orders: {
        retrieve: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const orderId = args[0];
            const options = args[1] || {};
            const enhancedArgs = [orderId, { ...options, signal: controller.signal }];
            const result = await medusaClient.orders.retrieve(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            console.error("Error retrieving order:", error);
            return { order: null };
          }
        }
      },
      collections: {
        list: async (...args) => {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8e3);
            const options = args[0] || {};
            const enhancedArgs = [{ ...options, signal: controller.signal }];
            const result = await medusaClient.collections.list(...enhancedArgs);
            clearTimeout(timeoutId);
            return result;
          } catch (error) {
            console.error("Error fetching collections:", error);
            return { collections: [] };
          }
        }
      }
    };
  } catch (error) {
    console.error("Failed to initialize Medusa client:", error);
    return createFallbackClient();
  }
};
function createFallbackClient() {
  console.log("Using fallback Medusa client with offline capabilities");
  return {
    products: {
      list: () => Promise.resolve({ products: [] }),
      retrieve: () => Promise.resolve({ product: null })
    },
    carts: {
      create: () => Promise.resolve({ cart: null }),
      retrieve: () => Promise.resolve({ cart: null }),
      update: () => Promise.resolve({ cart: null }),
      lineItems: {
        create: () => Promise.resolve({ cart: null }),
        delete: () => Promise.resolve({ cart: null }),
        update: () => Promise.resolve({ cart: null })
      }
    },
    customers: {
      create: () => Promise.resolve({ customer: null }),
      retrieve: () => Promise.resolve({ customer: null }),
      update: () => Promise.resolve({ customer: null }),
      addresses: {
        addAddress: () => Promise.resolve({ customer: null })
      },
      listOrders: () => Promise.resolve({ orders: [] })
    },
    auth: {
      authenticate: () => Promise.reject(new Error("Authentication unavailable in offline mode")),
      deleteSession: () => Promise.resolve({})
    },
    orders: {
      retrieve: () => Promise.resolve({ order: null })
    },
    collections: {
      list: () => Promise.resolve({ collections: [] })
    }
  };
}
export {
  createMedusaClient as c
};
