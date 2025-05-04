/**
 * Order Placed Event Subscriber
 * 
 * This subscriber handles the order.placed event and triggers email notifications
 * via the notification service.
 */

export default async function orderPlacedHandler({ event, container }) {
  const { data } = event;
  const notificationService = container.resolve("notificationService");
  const logger = container.resolve("logger");
  
  logger.info(`Processing order.placed event for order ${data.id}`);
  
  try {
    // This will trigger the email to be sent via the plugin's registered handler
    await notificationService.send("order.placed", data);
    logger.info(`Successfully triggered notification for order ${data.id}`);
  } catch (error) {
    logger.error(`Failed to send order.placed notification for order ${data.id}: ${error.message}`);
  }
}

// This is required to register the subscriber with Medusa's event system
export const config = {
  event: "order.placed"
}