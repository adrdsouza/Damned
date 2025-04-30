-- Backfill existing line items with product titles
WITH line_items_with_variants AS (
  SELECT 
    li.id AS line_item_id,
    p.title AS product_title
  FROM 
    line_item li
  JOIN 
    product_variant pv ON li.variant_id = pv.id
  JOIN 
    product p ON pv.product_id = p.id
  WHERE 
    li.product_title IS NULL
)
UPDATE line_item li
SET product_title = liv.product_title
FROM line_items_with_variants liv
WHERE li.id = liv.line_item_id;