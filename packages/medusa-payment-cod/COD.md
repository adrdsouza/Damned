# Cash on Delivery (COD) Payment Integration for Damned Designs

## Overview

This document provides complete documentation for the Cash on Delivery (COD) payment integration with the Medusa e-commerce platform for Damned Designs. The integration allows customers to place orders without paying online, instead paying when the order is delivered.

## Integration Details

- **Plugin Location**: `/packages/medusa-payment-cod/`
- **Payment Provider ID**: `pp_cod_cod`
- **Associated Region**: USA (id: `reg_01JRHVWY8KXADW4FW7QHXATGFD`)
- **Configuration**: No API keys or external services required

## Implementation Architecture

The COD payment integration follows Medusa's payment provider architecture and consists of the following components:

### 1. Service Implementation

The core implementation in `src/services/cod-provider.js` extends Medusa's `PaymentService` and implements all required methods:

- `initiatePayment`: Creates a payment session with "pending" status
- `authorizePayment`: Automatically authorizes the payment
- `capturePayment`: Marks the payment as captured (when delivery is complete)
- `cancelPayment`: Cancels the payment
- `refundPayment`: Processes refunds
- `retrievePayment`: Retrieves payment details

### 2. Plugin Registration

The `src/index.js` file registers the COD provider with Medusa.

### 3. Database Registration

The payment provider is registered in the database with ID `pp_cod_cod` and associated with the USA region.

## Configuration

The COD integration is configured in the `medusa-config.ts` file:

```javascript
const codPaymentPlugin = {
  resolve: "medusa-payment-cod",
  options: {}
};
```

Unlike other payment methods, COD doesn't require any API keys or external service configuration.

## Payment Flow

1. **Checkout Initiation**:
   - Customer selects Cash on Delivery at checkout
   - The plugin creates a payment session with status "pending"
   - Order is placed without requiring any upfront payment

2. **Authorization**:
   - The payment is automatically authorized
   - Order is ready for fulfillment

3. **Capture**:
   - The payment should be manually captured in the admin panel after delivery and payment collection
   - This marks the order as paid

4. **Refund**:
   - If necessary, refunds can be processed manually in the admin panel

## Maintenance Tasks

### Updating Region Association

If you need to add COD to additional regions:

```sql
INSERT INTO region_payment_provider (region_id, payment_provider_id, id) 
VALUES ('your_region_id', 'pp_cod_cod', 'unique_id_here');
```

### Troubleshooting

Common issues and solutions:

1. **Payment not showing in checkout**:
   - Verify the payment provider is properly registered in the database
   - Check region association in the `region_payment_provider` table
   - Ensure the plugin is properly loaded by Medusa

2. **Orders not moving to the correct status**:
   - Check the COD provider implementation for correct status handling
   - Verify order workflow settings in Medusa

## Developer Information

### Building the Plugin

```bash
cd /packages/medusa-payment-cod
npm run build
```

### Customizing the COD Experience

You may want to customize the COD payment flow based on business requirements:

1. **Delivery Confirmation**: Add additional checks before capture
2. **Limited Availability**: Restrict COD to certain products or order values
3. **Custom Messaging**: Update customer-facing text for COD option

To implement these customizations, modify the `cod-provider.js` file and rebuild the plugin.

### Future Improvements

Potential enhancements to consider:

1. Add delivery confirmation step before capture
2. Implement COD fees or surcharges
3. Add order value limits for COD
4. Create admin panel customizations for better COD management

## Support Resources

- [Medusa Payment Plugin Documentation](https://docs.medusajs.com/advanced/backend/payment/overview)
- [Medusa API Documentation](https://docs.medusajs.com/api/admin)