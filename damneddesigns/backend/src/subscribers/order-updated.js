/**
 * Order Updated Event Subscriber
 * 
 * This subscriber handles the order.updated event and triggers email notifications
 * via the notification service. Notifies customers when their order has been updated.
 */

export default async function orderUpdatedHandler({ event, container }) {
  const { data } = event;
  const notificationService = container.resolve("notificationService");
  const logger = container.resolve("logger");
  
  logger.info(`Processing order.updated event for order ${data.id}`);
  
  try {
    // This will trigger the email to be sent via the plugin's registered handler
    await notificationService.send("order.updated", data);
    logger.info(`Successfully triggered update notification for order ${data.id}`);
  } catch (error) {
    logger.error(`Failed to send order.updated notification for order ${data.id}: ${error.message}`);
  }
}

// This is required to register the subscriber with Medusa's event system
export const config = {
  event: "order.updated"
}