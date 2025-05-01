module.exports = function ({ eventBusService, notificationService }) {
  console.log('OrderSubscriptionDebug initialized');
  eventBusService.subscribe('order.placed', async (data) => {
    console.log('Order placed event received:', data);
    try {
      await notificationService.sendNotification(
        {
          to: process.env.SMTP_FROM,
          data: { id: data.id },
        },
        'order.placed'
      );
      console.log('Notification sent for order:', data.id);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  });
};