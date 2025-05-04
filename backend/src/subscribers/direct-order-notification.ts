import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import nodemailer from "nodemailer"
import path from "path"
import pug from "pug"
import fs from "fs"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderService = container.resolve("orderService")
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.SMTP_USERNAME,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  })
  try {
    const order = await orderService.retrieve(data.id, {
      relations: [
        "customer",
        "billing_address",
        "shipping_address",
        "discounts",
        "discounts.rule",
        "shipping_methods",
        "payments",
        "fulfillments",
        "items",
        "returns",
        "gift_cards",
      ],
    })
    const templatePath = path.join(__dirname, "../../data/emailTemplates/orderplaced")
    const htmlTemplate = path.join(templatePath, "html.pug")
    const subjectTemplate = path.join(templatePath, "subject.pug")
    if (!fs.existsSync(htmlTemplate) || !fs.existsSync(subjectTemplate)) {
      throw new Error("Email templates not found")
    }
    const html = pug.renderFile(htmlTemplate, { order })
    const subject = pug.renderFile(subjectTemplate, { order })
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: order.email,
      subject,
      html,
    })
    console.log(`Email sent for order ${data.id}`)
  } catch (error) {
    console.error(`Failed to send email for order ${data.id}:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
