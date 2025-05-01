const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = function ({ eventBusService, orderService }) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.SMTP_USERNAME,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  eventBusService.subscribe('order.placed', async (data) => {
    try {
      const order = await orderService.retrieve(data.id, {
        relations: ['customer', 'items'],
      });
      const templatePath = path.join(__dirname, '../../data/emailTemplates/orderplaced');
      const html = pug.renderFile(`${templatePath}/html.pug`, { order });
      const subject = pug.renderFile(`${templatePath}/subject.pug`, { order });
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: order.email,
        subject,
        html,
      });
      console.log(`Email sent for order ${data.id}`);
    } catch (error) {
      console.error(`Failed to send email for order ${data.id}:`, error);
    }
  });
};