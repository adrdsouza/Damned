# Damned Designs Admin Panel Customizations

This document tracks the custom modifications made to the Medusa Admin Dashboard that deviate from the standard installation. These modifications should be reviewed whenever updating Medusa to ensure they continue working properly.

## Current Customizations

### 1. Order Line Item Product Title Display

**Description:**
Modified the order summary section to display only the product title instead of combining it with the variant title.

**Implementation Details:**
- **Modified File:** `/admin/src/routes/orders/order-detail/components/order-summary-section/order-summary-section.tsx`
- **Change:** Updated the line item title display to use only `item.product_title` instead of combining it with `item.title`
- **Original Code:**
  ```jsx
  {item.product_title 
    ? `${item.product_title} - ${item.title}` 
    : item.title}
  ```
- **Modified Code:**
  ```jsx
  {item.product_title || item.title}
  ```

**Backend Components:**
- **Database:** Added `product_title` column to the `line_item` table
- **Model:** Extended line item model in `/backend/src/models/line-item.ts`
- **Migration:** SQL migration in `/backend/migrations/add-product-title-to-line-item.sql`
- **Event Handler:** Order subscriber in `/backend/src/subscribers/order.ts` populates the field on order placement
- **Backfill Script:** `/backend/scripts/backfill-product-title.js` for existing orders

**Last Updated:** May 1, 2025

### 2. [Future Customization Name]

**Description:**
[To be added when implementing additional customizations]

**Implementation Details:**
- **Modified File:** [file path]
- **Change:** [description of change]
- **Original Code:**
  ```
  [code snippet]
  ```
- **Modified Code:**
  ```
  [code snippet]
  ```

**Backend Components:**
- [Any related backend changes]

**Last Updated:** [date]

## Update Procedure

When updating the Medusa Admin Dashboard, follow these steps to ensure customizations are maintained:

1. Document the current version before updating
2. Compare customized files with the new version to identify conflicts
3. Apply customizations to the new version files
4. Rebuild the admin panel with `npm run build:preview`
5. Restart Caddy with `systemctl restart caddy`
6. Test the functionality to ensure it works as expected

## Testing Checklist

After applying updates or making changes to customizations, verify these functions:

- [ ] Order details page displays product titles correctly
- [ ] Order creation workflow correctly saves product titles
- [ ] Order management features (returns, exchanges, claims) work properly
- [ ] [Add other test items for future customizations]