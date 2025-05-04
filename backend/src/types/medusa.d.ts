// Type definitions for Medusa
import { Order as MedusaOrder } from "@medusajs/medusa"

declare module "@medusajs/medusa" {
  interface Order extends MedusaOrder {
    display_id?: string;
    refunds?: any[];
  }
}
