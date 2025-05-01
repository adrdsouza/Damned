const fs = require("fs");
const path = require("path");

async function main() {
  try {
    // Simple test to check if the nodemailer plugin is present
    console.log("Checking medusa-plugin-nodemailer installation...");
    const pluginPath = path.join(__dirname, "node_modules", "medusa-plugin-nodemailer");
    if (fs.existsSync(pluginPath)) {
      console.log("✓ medusa-plugin-nodemailer is installed");
      
      // Check the structure
      const files = fs.readdirSync(pluginPath);
      console.log("Plugin files:", files);
      
      // Check the subscribers
      const subscribersPath = path.join(pluginPath, "subscribers");
      if (fs.existsSync(subscribersPath)) {
        console.log("Subscribers directory exists");
        const subscriberFiles = fs.readdirSync(subscribersPath);
        console.log("Subscriber files:", subscriberFiles);
        
        // Check subscriber content
        if (subscriberFiles.includes("index.js")) {
          const subscriberContent = fs.readFileSync(path.join(subscribersPath, "index.js"), "utf8");
          console.log("Subscriber content includes order.placed:", subscriberContent.includes("order.placed"));
        }
      } else {
        console.log("Subscribers directory does not exist");
      }
      
      // Check the services
      const servicesPath = path.join(pluginPath, "services");
      if (fs.existsSync(servicesPath)) {
        console.log("Services directory exists");
        const serviceFiles = fs.readdirSync(servicesPath);
        console.log("Service files:", serviceFiles);
        
        // Check the email handler service
        const emailHandlerPath = path.join(servicesPath, "email-handler.js");
        if (fs.existsSync(emailHandlerPath)) {
          console.log("Email handler service exists");
          const content = fs.readFileSync(emailHandlerPath, "utf8");
          console.log("Email handler has order_placed_template:", content.includes("order_placed_template"));
          console.log("Email handler has enable_order_placed_emails:", content.includes("enable_order_placed_emails"));
        }
      } else {
        console.log("Services directory does not exist");
      }
    } else {
      console.log("× medusa-plugin-nodemailer is NOT installed");
    }
    
    // Check medusa-config.ts
    console.log("\nChecking medusa-config.ts...");
    const configPath = path.join(__dirname, "medusa-config.ts");
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, "utf8");
      console.log("Config includes nodemailer plugin:", configContent.includes("medusa-plugin-nodemailer"));
      console.log("Config includes enable_order_placed_emails:", configContent.includes("enable_order_placed_emails"));
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}

main();