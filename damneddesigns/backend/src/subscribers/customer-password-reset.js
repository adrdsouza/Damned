/**
 * Customer Password Reset Event Subscriber
 * 
 * This subscriber handles the customer.password_reset event and triggers email notifications
 * via the notification service. Sends password reset links to customers.
 */

export default async function customerPasswordResetHandler({ event, container }) {
  const { data } = event;
  const notificationService = container.resolve("notificationService");
  const logger = container.resolve("logger");
  
  logger.info(`Processing customer.password_reset event for customer ${data.id || data.email}`);
  
  try {
    // This will trigger the email to be sent via the plugin's registered handler
    await notificationService.send("customer.password_reset", data);
    logger.info(`Successfully triggered password reset notification for customer ${data.id || data.email}`);
  } catch (error) {
    logger.error(`Failed to send customer.password_reset notification for customer ${data.id || data.email}: ${error.message}`);
  }
}

// This is required to register the subscriber with Medusa's event system
export const config = {
  event: "customer.password_reset"
}