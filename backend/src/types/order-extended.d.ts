import { Order as MedusaOrder } from "@medusajs/medusa"

// Extend the Medusa Order type to include display_id and refunds
declare module "@medusajs/medusa" {
  interface Order extends MedusaOrder {
    display_id?: string;
    refunds?: any[];
  }
}
