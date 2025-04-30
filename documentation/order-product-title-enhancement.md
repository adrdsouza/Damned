# Enhancing Order Line Items to Store Product Title in Medusa Backend

## Objective

Ensure that each order line item in Medusa stores both the product title and the variant title at the time of order creation. This allows the admin panel and any downstream systems to display both names, regardless of future product/variant changes.

---

## Rationale

- By default, Medusa only stores the variant title in the order line item (`item.title`).
- This leads to confusion in the admin panel, where only the variant name is shown (e.g., "Small" instead of "T-shirt – Small").
- Storing the product title at order creation ensures accurate historical records and simplifies UI logic.

---

## Implementation Plan

### 1. Extend the Order Line Item Schema

- Add a new field to the order line item entity/model, e.g., `product_title`.

### 2. Update Order Creation Logic

- When an order is created, populate `product_title` on each line item using the parent product's title (from the variant's `product_id`).

### 3. Update Admin Panel Display

- Update the admin panel to display both `product_title` and `variant_title` for each order item.

### 4. Migration

- Write a migration script to backfill `product_title` for existing orders, if needed.

---

## Mermaid Diagram

```mermaid
flowchart TD
    A[Order Placed] --> B[For each item, get variant.product_id]
    B --> C[Fetch product title]
    C --> D[Store product_title in order line item]
    D --> E[Order saved with both titles]
    E --> F[Admin panel displays "Product Title – Variant Title"]
```

---

## Risks with Future Medusa Updates

- **Custom Field:** Adding a custom field (`product_title`) to the order line item is a schema extension. Medusa updates that change the order line item structure or order creation logic may require you to re-apply or adapt your changes.
- **Order Service Logic:** If Medusa changes how orders are created or how line items are handled, you may need to update your custom logic after upgrading.
- **Best Practice:** Keep your customizations well-documented and version-controlled. After each Medusa update, review the release notes and test order creation to ensure your enhancement still works.

---

## Summary Table

| Step | Action | File/Component |
|------|--------|----------------|
| 1    | Add `product_title` to order line item schema | Backend entity/model |
| 2    | Populate `product_title` at order creation    | Order service logic  |
| 3    | Update admin panel to display both titles     | Admin UI component   |
| 4    | (Optional) Backfill existing orders           | Migration script     |

---

## Recommendation

- Proceed with the backend enhancement for a robust, future-proof solution.
- Maintain clear documentation and test after Medusa upgrades.