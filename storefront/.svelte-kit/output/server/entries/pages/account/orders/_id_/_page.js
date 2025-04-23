import { e as error } from "../../../../../chunks/index.js";
import { D as DEV } from "../../../../../chunks/false.js";
import { g as getOrderById, a as getCustomerOrders, u as user } from "../../../../../chunks/userStore.js";
import { g as get_store_value } from "../../../../../chunks/utils.js";
const browser = DEV;
const mockOrders = {
  "1001": {
    id: "1001",
    date: "2023-11-15",
    status: "delivered",
    total: 249.98,
    items: [
      {
        productId: 1,
        name: "Djinn XL Titanium",
        price: 249.99,
        quantity: 1,
        image: "/images/products/djinn-xl.jpg"
      }
    ],
    shipped: true,
    fulfillmentStatus: "fulfilled",
    paymentStatus: "paid",
    trackingNumber: "TRK123456789",
    shippingAddress: {
      name: "John Doe",
      address_1: "123 Main St",
      address_2: "Apt 4B",
      city: "Anytown",
      province: "CA",
      postal_code: "12345",
      country_code: "US"
    }
  },
  "1002": {
    id: "1002",
    date: "2023-12-05",
    status: "shipped",
    total: 129.99,
    items: [
      {
        productId: 2,
        name: "Oni Compact",
        price: 129.99,
        quantity: 1,
        image: "/images/products/oni-compact.jpg"
      }
    ],
    shipped: true,
    fulfillmentStatus: "shipped",
    paymentStatus: "paid",
    trackingNumber: "TRK987654321",
    shippingAddress: {
      name: "John Doe",
      address_1: "123 Main St",
      address_2: "",
      city: "Anytown",
      province: "CA",
      postal_code: "12345",
      country_code: "US"
    }
  }
};
async function load({ params }) {
  const { id } = params;
  let order = null;
  try {
    if (!browser) {
      if (mockOrders[id]) {
        return { order: mockOrders[id] };
      }
      throw error(404, "Order not found");
    }
    try {
      order = await getOrderById(id);
      if (order) {
        return { order };
      }
    } catch (err) {
      console.log("Error fetching order from Medusa:", err);
    }
    if (mockOrders[id]) {
      console.log("Using mock order data");
      return { order: mockOrders[id] };
    }
    try {
      const orders = await getCustomerOrders();
      order = orders.find((order2) => order2.id === id || order2.id.toString() === id);
      if (order) {
        return { order };
      }
    } catch (err) {
      console.log("Error fetching orders list:", err);
    }
    const userData = get_store_value(user);
    const orderFromStore = userData?.orders?.find((o) => o.id === id || o.id.toString() === id);
    if (orderFromStore) {
      return { order: orderFromStore };
    }
    const demoOrder = {
      id,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      status: "processing",
      total: 279.98,
      items: [
        {
          productId: 1,
          name: "Djinn XL Titanium",
          price: 199.99,
          quantity: 1,
          image: "/images/products/djinn-xl.jpg"
        },
        {
          productId: 8,
          name: "EDC Organizer Pouch",
          price: 39.99,
          quantity: 2,
          image: "/images/products/pouch.jpg"
        }
      ],
      shipped: false,
      fulfillmentStatus: "pending",
      paymentStatus: "paid",
      trackingNumber: "",
      shippingAddress: {
        name: "John Doe",
        address_1: "123 Main St",
        address_2: "Apt 4B",
        city: "Anytown",
        province: "CA",
        postal_code: "12345",
        country_code: "US"
      }
    };
    console.log("Using demo order for display purposes");
    return { order: demoOrder };
  } catch (err) {
    console.error(`Error loading order ${id}:`, err);
    if (err.status === 404) {
      throw error(404, "Order not found");
    }
    throw error(500, "An error occurred while loading the order");
  }
}
export {
  load
};
