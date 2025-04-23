# Sezzle Payment Integration for Damned Designs

## Overview

This document provides complete documentation for the Sezzle "Buy Now, Pay Later" payment integration with the Medusa e-commerce platform for Damned Designs. The integration allows customers to split payments into installments while the merchant receives the full amount upfront.

## Integration Details

- **Plugin Location**: `/packages/medusa-payment-sezzle/`
- **Payment Provider ID**: `pp_sezzle_sezzle`
- **Associated Region**: USA (id: `reg_01JRHVWY8KXADW4FW7QHXATGFD`)
- **API Keys**:
  - Public Key: `sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT`
  - Private Key: `sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR`
- **Mode**: Sandbox mode (configurable via environment variable)
- **Capture Mode**: Automatic (configurable via environment variable)

## Implementation Architecture

The Sezzle payment integration follows Medusa's payment provider architecture and consists of the following components:

### 1. Service Implementation

The core implementation in `src/services/sezzle-provider.js` extends Medusa's `PaymentService` and implements all required methods:

- `initiatePayment`: Creates a Sezzle checkout session
- `authorizePayment`: Verifies payment authorization with Sezzle
- `capturePayment`: Captures funds for an authorized payment
- `cancelPayment`: Cancels a payment
- `refundPayment`: Processes refunds
- `retrievePayment`: Retrieves payment details from Sezzle

### 2. Plugin Registration

The `src/index.js` file registers the Sezzle provider with Medusa and sets up webhook routes.

### 3. Webhook Handler

The `src/api/routes/hooks/index.js` file handles incoming webhooks from Sezzle for payment status updates.

### 4. Database Registration

The payment provider is registered in the database with ID `pp_sezzle_sezzle` and associated with the USA region.

## Configuration

The Sezzle integration is configured through environment variables in the backend `.env` file:

```
# Sezzle Payment Plugin Configuration
SEZZLE_PUBLIC_KEY=sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT
SEZZLE_PRIVATE_KEY=sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR
SEZZLE_WEBHOOK_SECRET=webhook_secret
SEZZLE_SANDBOX_MODE=true
SEZZLE_CAPTURE_MODE=automatic
```

And in the `medusa-config.ts` file:

```javascript
const sezzlePaymentPlugin = {
  resolve: "medusa-payment-sezzle",
  options: {
    public_key: process.env.SEZZLE_PUBLIC_KEY,
    private_key: process.env.SEZZLE_PRIVATE_KEY,
    webhook_secret: process.env.SEZZLE_WEBHOOK_SECRET,
    sandbox_mode: process.env.SEZZLE_SANDBOX_MODE,
    capture_mode: process.env.SEZZLE_CAPTURE_MODE || "manual"
  }
};
```

## Payment Flow

1. **Checkout Initiation**:
   - Customer selects Sezzle at checkout
   - The plugin creates a checkout session with Sezzle API
   - Customer is redirected to Sezzle to complete payment

2. **Authorization**:
   - When the customer completes payment on Sezzle, they are redirected back to the store
   - The payment is then authorized through Sezzle API

3. **Capture**:
   - If capture_mode is set to "automatic", the payment is captured automatically
   - If capture_mode is set to "manual", the payment must be captured manually in the admin panel

4. **Webhooks**:
   - Sezzle sends webhook notifications for payment events
   - The webhook handler updates order status in Medusa

## API Endpoints

Sezzle API endpoints used:

- **Create Session**: `POST https://[sandbox.]gateway.sezzle.com/v2/session`
- **Get Order**: `GET https://[sandbox.]gateway.sezzle.com/v2/order/{order_id}`
- **Capture Payment**: `POST https://[sandbox.]gateway.sezzle.com/v2/order/{order_id}/capture`
- **Refund Payment**: `POST https://[sandbox.]gateway.sezzle.com/v2/order/{order_id}/refund`
- **Cancel Payment**: `POST https://[sandbox.]gateway.sezzle.com/v2/order/{order_id}/cancel`

## Webhook Configuration

The plugin sets up a webhook endpoint at `/sezzle/webhooks` to handle the following events:

- `order.completed`: Payment completed in Sezzle
- `order.refunded`: Payment refunded in Sezzle
- `order.canceled`: Payment canceled in Sezzle

## Maintenance Tasks

### Updating API Keys

If you need to update the Sezzle API keys:

1. Update the environment variables in the backend `.env` file
2. Restart the Medusa backend with: `pm2 restart damned-designs-backend`

### Switching to Production Mode

To switch from sandbox to production mode:

1. Update the `SEZZLE_SANDBOX_MODE` environment variable to `false`
2. Update API keys if necessary (sandbox and production use different keys)
3. Restart the Medusa backend

### Changing Capture Mode

To change between automatic and manual capture:

1. Update the `SEZZLE_CAPTURE_MODE` environment variable to either `"automatic"` or `"manual"`
2. Restart the Medusa backend

### Troubleshooting

Common issues and solutions:

1. **Payment not showing in checkout**:
   - Verify the payment provider is properly registered in the database
   - Check region association in the `region_payment_provider` table
   - Ensure the plugin is properly loaded by Medusa

2. **Authorization failures**:
   - Check API keys are correct
   - Verify the Sezzle API status
   - Check network connectivity to Sezzle

### Connectivity and Endpoint Verification
An investigation was conducted to address "404 page not found" errors encountered during initial testing. The correct base URL for the Sezzle live API was identified as `https://gateway.sezzle.com/v2`.

A connectivity test to the `/v2/authentication` endpoint using `curl` was successful, confirming the API is reachable at the correct base URL.

An authentication test using the provided live public and private keys was performed. The API successfully validated the keys and returned a bearer token, confirming the validity of the keys and basic API authentication functionality. The previous 404 errors were due to incorrect or incomplete endpoint paths.

3. **Webhook issues**:
   - Verify webhook URL is accessible from the internet
   - Check webhook_secret is correctly configured
   - Look for webhook errors in the backend logs

## Developer Information

### Building the Plugin

```bash
cd /packages/medusa-payment-sezzle
npm run build
```

### Testing

While in sandbox mode, you can use the following test credentials on the Sezzle checkout page:

- **Phone**: Any valid phone number format
- **Email**: Any valid email format
- **OTP**: Any 6-digit number

### Future Improvements

Potential enhancements to consider:

1. Implement better error handling and logging
2. Add support for additional Sezzle API features
3. Improve webhook signature verification
4. Add admin panel customizations for better Sezzle management

## Support Resources

- [Sezzle Merchant Documentation](https://docs.sezzle.com/)
- [Sezzle API Reference](https://docs.gateway.sezzle.com/api/v2/)
- [Medusa Payment Plugin Documentation](https://docs.medusajs.com/advanced/backend/payment/overview)