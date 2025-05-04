/**
 * Order Refund Created Event Subscriber
 * 
 * This subscriber handles the order.refund_created event and triggers email notifications
 * via the notification service. Notifies customers when a refund has been processed.
 */

export default async function orderRefundCreatedHandler({ event, container }) {
  const { data } = event;
  const notificationService = container.resolve("notificationService");
  const logger = container.resolve("logger");
  
  logger.info(`Processing order.refund_created event for order ${data.id}`);
  
  try {
    // This will trigger the email to be sent via the plugin's registered handler
    await notificationService.send("order.refund_created", data);
    logger.info(`Successfully triggered refund notification for order ${data.id}`);
  } catch (error) {
    logger.error(`Failed to send order.refund_created notification for order ${data.id}: ${error.message}`);
  }
}

// This is required to register the subscriber with Medusa's event system
export const config = {
  event: "order.refund_created"
}