import { LineItem as MedusaLineItem } from "@medusajs/medusa/dist/models/line-item"
import { Entity, Property } from "@mikro-orm/core"

// MikroORM entity extension for Medusa LineItem
@Entity({ tableName: "line_item" })
export class LineItem extends MedusaLineItem {
  @Property({ type: "string", nullable: true })
  product_title?: string
}