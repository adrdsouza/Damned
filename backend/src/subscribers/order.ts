type EventBusType = {
  subscribe: (eventName: string, handler: (data: any) => Promise<void>) => void;
};

type ContainerType = {
  resolve: (name: string) => any;
};

export default {
  registerSubscribers: async (container: ContainerType) => {
    const eventBus = container.resolve("eventBusService") as EventBusType;
    const pgConnection = container.resolve("db");
    const notificationService = container.resolve("notificationService");
    
    // Register notification service to handle order.placed events
    try {
      notificationService.subscribe("order.placed", "nodemailer");
      console.log("Successfully registered nodemailer for order.placed notifications");
    } catch (error) {
      console.error(`Error registering notification handler: ${error.message}`);
    }
    
    // Handle the order.placed event
    eventBus.subscribe("order.placed", async (data) => {
      await handleOrderPlaced(pgConnection, data);
      
      // Trigger standard order placed notifications (customer + admin BCC via config)
      try {
        await notificationService.send("order.placed", data);
        console.log(`Standard order.placed notification triggered for order ${data.id}`);
      } catch (error) {
        // Log any errors but don't block the rest of the process
        console.error(`Error triggering order.placed notification: ${error.message}`);
      }
    });
  }
};

/**
 * Handle order placed events - update line items with product titles
 */
async function handleOrderPlaced(pgConnection: any, data: any): Promise<void> {
  const { id, items } = data;
    
  if (!items || !items.length) {
    return;
  }

  try {
    for (const item of items) {
      if (!item.variant_id) continue;
      
      // Use direct SQL query to fetch product title from variant
      const productQuery = `
        SELECT p.title 
        FROM product p
        JOIN product_variant pv ON pv.product_id = p.id
        WHERE pv.id = $1
      `;
      
      const productResult = await pgConnection.query(productQuery, [item.variant_id]);
      
      if (productResult && productResult.rows && productResult.rows.length > 0) {
        const productTitle = productResult.rows[0].title;
        
        // Update line item with product title
        await pgConnection.query(
          `UPDATE line_item SET product_title = $1 WHERE id = $2`,
          [productTitle, item.id]
        );
      }
    }
    
    console.log(`Successfully added product titles to order ${id}`);
  } catch (error) {
    console.error(`Failed to add product titles to order: ${error.message}`);
  }
}