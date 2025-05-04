import { Router } from "express";
import bodyParser from "body-parser";

const webhookRoutes = (router) => {
  router.post("/nmi", bodyParser.raw({ type: "application/json" }), async (req, res) => {
    // Process NMI webhook notification
    // This is a placeholder - implement actual webhook logic
    console.log("Received NMI webhook:", req.body);

    try {
      // Verify webhook signature (if NMI provides one)
      // const signature = req.headers['nmi-signature'];
      // if (!isValidSignature(req.body, signature, this.options_.webhook_secret)) {
      //   return res.sendStatus(401); // Unauthorized
      // }

      // Extract relevant data from the webhook payload
      const event = req.body; // Assuming JSON payload

      // Handle different event types (e.g., transaction settled, refund processed)
      switch (event.type) {
        case "transaction.settled":
          // Update order/payment status in Medusa
          // Example: Find order by transaction ID and update payment status to captured
          // const orderService = req.scope.resolve("orderService");
          // const order = await orderService.retrieveByCartId(event.data.cart_id);
          // await orderService.updatePaymentStatus(order.id, "captured");
          console.log("Transaction settled webhook received.");
          break;
        case "refund.processed":
          // Update order/payment status in Medusa
          // Example: Find order by transaction ID and update payment status to refunded
          console.log("Refund processed webhook received.");
          break;
        // Add other event types as needed
        default:
          console.log(`Unhandled NMI webhook event type: ${event.type}`);
      }

      res.sendStatus(200); // Acknowledge successful receipt
    } catch (error) {
      console.error("Error processing NMI webhook:", error);
      res.sendStatus(500); // Internal Server Error
    }
  });
};

export default webhookRoutes;