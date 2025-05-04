-- Add product_title column to line_item table
ALTER TABLE line_item 
ADD COLUMN IF NOT EXISTS product_title VARCHAR(255);

-- Comment on column to describe its purpose
COMMENT ON COLUMN line_item.product_title IS 'Stores the product title at time of order creation for display purposes';