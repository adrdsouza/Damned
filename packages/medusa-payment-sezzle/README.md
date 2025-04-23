# Medusa Sezzle Payment Plugin

This plugin adds "Buy Now, Pay Later" payment capabilities to your Medusa e-commerce store via Sezzle.

## Features

- Seamless integration with Medusa e-commerce platform
- Support for Sezzle's "Buy Now, Pay Later" functionality
- Webhook handling for automated payment updates
- Configurable capture mode (automatic or manual)
- Full sandbox mode support for testing
- Complete payment lifecycle management (authorize, capture, refund, cancel)

## Prerequisites

- A Medusa server (>=1.0.0)
- A Sezzle merchant account and API credentials
- Node.js (>=16)

## Installation

```bash
cd /path/to/your/medusa-project
npm install medusa-payment-sezzle
```

## Configuration

Add the following configurations to your `medusa-config.js` file:

```javascript
const sezzlePaymentPlugin = {
  resolve: "medusa-payment-sezzle",
  options: {
    public_key: process.env.SEZZLE_PUBLIC_KEY,
    private_key: process.env.SEZZLE_PRIVATE_KEY,
    webhook_secret: process.env.SEZZLE_WEBHOOK_SECRET,
    sandbox_mode: process.env.SEZZLE_SANDBOX_MODE,
    capture_mode: process.env.SEZZLE_CAPTURE_MODE || "manual" // Can be "automatic" or "manual"
  }
};

// Add to the plugins array
plugins: [
  // ...other plugins
  sezzlePaymentPlugin,
]
```

### Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Sezzle Payment Plugin Configuration
SEZZLE_PUBLIC_KEY=your_public_key
SEZZLE_PRIVATE_KEY=your_private_key
SEZZLE_WEBHOOK_SECRET=your_webhook_secret
SEZZLE_SANDBOX_MODE=true    # Set to false for production
SEZZLE_CAPTURE_MODE=manual  # Can be "automatic" or "manual"
FRONTEND_URL=http://localhost:8000  # Your storefront URL (used for redirect URLs)
```

## Webhooks

The plugin sets up a webhook endpoint at `/sezzle/webhooks` that handles payment status updates from Sezzle.

### Setting up Webhooks in Sezzle Dashboard

1. Log in to your Sezzle merchant dashboard
2. Navigate to Developer Settings
3. Add a new webhook URL: `https://your-backend-url/sezzle/webhooks`
4. Subscribe to the following events:
   - order.completed
   - order.refunded
   - order.canceled

## Payment Flow

1. Customer selects Sezzle at checkout
2. The plugin initiates a Sezzle checkout session
3. Customer is redirected to Sezzle to complete the payment
4. After successful payment, customer is redirected back to your store
5. Depending on your capture mode, payment is either captured automatically or must be captured manually in the admin panel

## Testing

Test the integration using Sezzle's sandbox environment:

1. Set `SEZZLE_SANDBOX_MODE=true` in your `.env` file
2. Use test API credentials provided by Sezzle
3. Process test orders through your storefront

## Troubleshooting

Common issues and solutions:

- **Payment not showing in checkout**: Make sure the Sezzle payment provider is properly associated with your region in the Medusa admin panel.
- **Webhook errors**: Check that your webhook URL is accessible from the internet and properly set up in the Sezzle dashboard.
- **Authorization failures**: Verify that your API keys are correctly set in the `.env` file.

## API Reference

The plugin implements all standard Medusa payment provider methods:

- `initiatePayment`: Creates a Sezzle checkout session
- `authorizePayment`: Verifies payment authorization
- `capturePayment`: Captures an authorized payment
- `cancelPayment`: Cancels a payment
- `refundPayment`: Processes refunds
- `retrievePayment`: Retrieves payment details from Sezzle

## License

MIT