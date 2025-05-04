#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const { Client } = require('pg');

// Get database connection string from environment
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL environment variable is not set.');
  process.exit(1);
}

async function main() {
  console.log('Starting product_title migration and backfill...');
  
  // Step 1: Apply SQL migration to add the column
  console.log('Applying SQL migration...');
  const sqlPath = path.join(__dirname, '../migrations/add-product-title-to-line-item.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  
  try {
    await client.query(sql);
    console.log('Column product_title added successfully to line_item table.');
    
    // Step 2: Backfill existing line items with product titles
    console.log('Backfilling existing line items with product titles...');
    
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
    
    console.log('Migration and backfill completed successfully!');
  } catch (error) {
    console.error('Error executing migration:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});