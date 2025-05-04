/**
 * Order Shipment Created Event Subscriber
 * 
 * This subscriber handles the order.shipment_created event and triggers email notifications
 * via the notification service. Notifies customers when their order has been shipped.
 */

export default async function orderShipmentCreatedHandler({ event, container }) {
  const { data } = event;
  const notificationService = container.resolve("notificationService");
  const logger = container.resolve("logger");
  
  logger.info(`Processing order.shipment_created event for order ${data.id}`);
  
  try {
    // This will trigger the email to be sent via the plugin's registered handler
    await notificationService.send("order.shipment_created", data);
    logger.info(`Successfully triggered shipment notification for order ${data.id}`);
  } catch (error) {
    logger.error(`Failed to send order.shipment_created notification for order ${data.id}: ${error.message}`);
  }
}

// This is required to register the subscriber with Medusa's event system
export const config = {
  event: "order.shipment_created"
}