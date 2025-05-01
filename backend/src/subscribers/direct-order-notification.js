const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = {
  registerSubscribers: async (container) => {
    const eventBus = container.resolve("eventBusService");
    const orderService = container.resolve("orderService");
    const pgConnection = container.resolve("db");

    const {
      SMTP_FROM = "info@damneddesigns.com",
      SMTP_USERNAME = "info@damneddesigns.com",
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REFRESH_TOKEN
    } = process.env;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: SMTP_USERNAME,
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        refreshToken: GOOGLE_REFRESH_TOKEN,
      }
    });

    async function handleOrderPlaced(pgConnection, data) {
      const { id, items } = data;
      if (!items || !items.length) return;
      try {
        for (const item of items) {
          if (!item.variant_id) continue;
          const productQuery = `
            SELECT p.title 
            FROM product p
            JOIN product_variant pv ON pv.product_id = p.id
            WHERE pv.id = $1
          `;
          const productResult = await pgConnection.query(productQuery, [item.variant_id]);
          if (productResult.rows.length) {
            await pgConnection.query(
              `UPDATE line_item SET product_title = $1 WHERE id = $2`,
              [productResult.rows[0].title, item.id]
            );
          }
        }
        console.log(`Successfully added product titles to order ${id}`);
      } catch (error) {
        console.error(`Failed to add product titles to order: ${error.message}`);
      }
    }

    async function sendOrderConfirmationEmail(orderId) {
      try {
        console.log(`Preparing to send direct order notification for order ${orderId}`);
        const order = await orderService.retrieve(orderId, {
          relations: ["customer","billing_address","shipping_address","discounts","discounts.rule","shipping_methods","payments","fulfillments","items","returns","gift_cards"]
        });
        const templateDir = path.join("/root/damneddesigns/backend/data/emailTemplates/orderplaced");
        const htmlTemplate = path.join(templateDir, "html.pug");
        const subjectTemplate = path.join(templateDir, "subject.pug");
        if (!fs.existsSync(htmlTemplate) || !fs.existsSync(subjectTemplate)) {
          throw new Error("Email templates not found");
        }
        const compiledHtml = pug.compileFile(htmlTemplate);
        const compiledSubject = pug.compileFile(subjectTemplate);
        const html = compiledHtml({ data: order });
        const subject = compiledSubject({ data: order }).trim();
        if (order.email) {
          const info = await transporter.sendMail({
            from: SMTP_FROM,
            to: order.email,
            bcc: SMTP_USERNAME,
            subject: subject,
            html: html
          });
          console.log(`✓ Order confirmation email sent successfully to ${order.email}`);
          console.log(`  Message ID: ${info.messageId}`);
        } else {
          console.log("⚠ No customer email found on order");
        }
      } catch (error) {
        console.error(`❌ Failed to send order notification: ${error.message}`);
        console.error(error);
      }
    }

    eventBus.subscribe("order.placed", async (data) => {
      try {
        console.log(`🛒 Order placed event received for ${data.id}`);
        await handleOrderPlaced(pgConnection, data);
        await sendOrderConfirmationEmail(data.id);
      } catch (error) {
        console.error(`Error processing order.placed event: ${error.message}`);
      }
    });

    console.log("🚀 Custom direct order notification subscriber registered successfully");
    return {};
  }
};