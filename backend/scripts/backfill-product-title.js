#!/usr/bin/env node

const { Client } = require('pg');

async function backfillProductTitles() {
  console.log('Starting product title backfill...');
  
  // Database connection with hardcoded credentials for simplicity
  const connectionString = 'postgres://myuser:adrdsouza@localhost/medusa-medusaapp';
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Backfill existing line items with product titles
    const backfillQuery = `
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
      WHERE li.id = liv.line_item_id
    `;
    
    const result = await client.query(backfillQuery);
    console.log(`Updated ${result.rowCount} line items with product titles.`);
    console.log('Backfill completed successfully!');
  } catch (error) {
    console.error('Error executing backfill:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

backfillProductTitles().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});