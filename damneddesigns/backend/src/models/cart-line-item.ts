import { Entity, Property } from "@mikro-orm/core"
import { Expose } from "class-transformer"

// MikroORM entity extension for Medusa CartLineItem
@Entity({ tableName: "cart_line_item" })
export class CartLineItem {
  @Property({ type: "string", nullable: true })
  @Expose()
  product_title?: string
}