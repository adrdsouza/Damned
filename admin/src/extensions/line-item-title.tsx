import React from "react"
import { Text } from "@medusajs/ui"

type LineItemTitleProps = {
  item: any
}

/**
 * Custom component to display both product title and variant title in line items
 * Format: "Product Title – Variant Title" or just "Variant Title" if product_title is not available
 */
export const LineItemTitle = ({ item }: LineItemTitleProps) => {
  if (item.product_title) {
    return (
      <Text size="small" leading="compact" weight="plus" className="text-ui-fg-base">
        {item.product_title} – {item.title}
      </Text>
    )
  }

  // Fallback to just the variant title if product_title is not available
  return (
    <Text size="small" leading="compact" weight="plus" className="text-ui-fg-base">
      {item.title}
    </Text>
  )
}