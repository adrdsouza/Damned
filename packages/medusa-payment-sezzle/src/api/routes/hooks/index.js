import { Router } from "express";
import bodyParser from "body-parser";

const webhookRoutes = (router) => {
  router.post("/sezzle/webhooks", bodyParser.raw({ type: "application/json" }), async (req, res) => {
    // Process Sezzle webhook notification
    try {
      const event = JSON.parse(req.body.toString());
      
      // Verify webhook signature (if Sezzle provides one)
      // This is an example - adjust according to Sezzle's actual webhook signature verification
      // const signature = req.headers['sezzle-signature'];
      // if (!isValidSignature(req.body, signature, options.webhook_secret)) {
      //   return res.sendStatus(401); // Unauthorized
      // }
      
      // Get necessary services from the container
      const container = req.scope;
      const orderService = container.resolve("orderService");
      const sezzleProviderService = container.resolve("pp_sezzle_sezzle");
      
      // Get event type and order reference
      const eventType = event.event_type;
      const orderReference = event.order_reference;
      
      // Find order by Sezzle reference
      const order = await orderService.retrieveByCartId(orderReference);
      
      if (!order) {
        throw new Error(`No order found with reference: ${orderReference}`);
      }
      
      // Handle different event types
      switch (eventType) {
        case "order.completed":
          // Order has been completed in Sezzle
          // Update order status in Medusa
          await orderService.capturePayment(order.id);
          console.log(`Sezzle order ${orderReference} captured via webhook`);
          break;
          
        case "order.refunded":
          // Order has been refunded in Sezzle
          // Update order status in Medusa
          await orderService.refund(order.id);
          console.log(`Sezzle order ${orderReference} refunded via webhook`);
          break;
          
        case "order.canceled":
          // Order has been canceled in Sezzle
          // Update order status in Medusa
          await orderService.cancel(order.id);
          console.log(`Sezzle order ${orderReference} canceled via webhook`);
          break;
          
        default:
          console.log(`Unhandled Sezzle webhook event type: ${eventType}`);
      }
      
      // Return success response
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing Sezzle webhook:", error);
      res.sendStatus(500);
    }
  });
};

export default webhookRoutes;