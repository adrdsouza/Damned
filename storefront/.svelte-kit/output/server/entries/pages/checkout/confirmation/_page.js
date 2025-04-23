import { r as redirect, e as error } from "../../../../chunks/index.js";
function load({ url }) {
  const orderId = url.searchParams.get("order_id");
  const success = url.searchParams.get("success") === "true";
  if (!orderId) {
    throw redirect(302, "/checkout");
  }
  if (!success) {
    throw error(400, {
      message: "There was a problem with your checkout. Please try again."
    });
  }
  return {
    orderId,
    success: true
  };
}
export {
  load
};
