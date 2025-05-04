import { Entity, Property } from "@mikro-orm/core"
import { Expose } from "class-transformer"

// MikroORM entity extension for Medusa LineItem
@Entity({ tableName: "order_line_item" })
export class LineItem {
  @Property({ type: "string", nullable: true })
  @Expose()
  product_title?: string
}