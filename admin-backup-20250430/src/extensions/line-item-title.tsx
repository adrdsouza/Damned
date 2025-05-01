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
  // Log the item prop for debugging
  // eslint-disable-next-line no-console
  console.log("LineItemTitle item prop:", item);

  // Prefer product_title on item, then on item.detail, then fallback to variant title
  const productTitle = item.product_title || item.detail?.product_title

  if (productTitle) {
    return (
      <Text size="small" leading="compact" weight="plus" className="text-ui-fg-base">
        {productTitle} – {item.title}
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