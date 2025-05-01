'use strict';
inv
// Simple dedicated subscriber for more detailed debugging
class OrderSubscriptionDebug {
  constructor({ eventBusService, notificationService, logger }) {
    console.log("🔍 OrderSubscriptionDebug is being constructed");
    
    this.notificationService = notificationService;
    this.logger = logger;
    
    // Log the notificationService providers
    console.log("📧 Available notification providers:", 
      notificationService.retrieveSubscribers ? 
      notificationService.retrieveSubscribers() : 
      "Method not available");
    
    // Subscribe to the event
    console.log("🔔 Subscribing to order.placed event");
    eventBusService.subscribe("order.placed", this.handleOrderPlaced.bind(this));
    
    // Also log other event handlers
    console.log("🔔 Subscribing to order.placed.debug event");
    eventBusService.subscribe("order.placed.debug", async (data) => {
      console.log("🎯 Debug order.placed event received:", data);
    });
    
    // Direct email test (uncomment to test, but this will send an email each time the server starts)
    // this.sendTestEmail();
  }
  
  async handleOrderPlaced(data) {
    console.log("🛒 ORDER PLACED EVENT RECEIVED:", data.id);
    console.log("📊 Order data:", JSON.stringify(data, null, 2));
    
    // Attempt to trigger email via notificationService
    try {
      console.log("📧 Attempting to send test email via notification service");
      const result = await this.notificationService.sendNotification(
        {
          to: "info@damneddesigns.com",
          data: {
            id: data.id,
            email: "info@damneddesigns.com"
          },
        },
        "order.placed"
      );
      console.log("📧 Notification result:", result);
    } catch (error) {
      console.error("❌ Failed to send notification:", error.message);
      console.error(error.stack);
    }
  }
  
  async sendTestEmail() {
    console.log("🧪 Sending direct test email");
    const nodemailer = require("nodemailer");
    
    try {
      // Create a test SMTP transporter
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          type: "OAuth2",
          user: process.env.SMTP_USERNAME,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
      });
      
      // Send a test email
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: "info@damneddesigns.com",
        subject: "Medusa Debug Test Email",
        text: "This is a test email from the order subscriber debug module",
        html: "<p>This is a test email from the order subscriber debug module</p>",
      });
      
      console.log("📧 Test email sent:", info.messageId);
    } catch (error) {
      console.error("❌ Error sending test email:", error.message);
      console.error(error.stack);
    }
  }
}

module.exports = function OrderSubscriptionDebug({ eventBusService, notificationService }) {
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