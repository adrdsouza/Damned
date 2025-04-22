# Medusa Payment NMI

A payment provider plugin for Medusa e-commerce that integrates with Network Merchants Inc (NMI) payment gateway.

## Features

- Process one-time payments through NMI
- Authorize, capture, void, and refund payments
- Webhook support for payment status updates

## Installation

```bash
npm install medusa-payment-nmi
```

## Configuration

Add the plugin to your `medusa-config.js`:

```javascript
const plugins = [
  // ... other plugins
  {
    resolve: "medusa-payment-nmi",
    options: {
      security_key: process.env.NMI_SECURITY_KEY,
      capture_on_completion: true
    }
  }
]
```

## Environment Variables

- `NMI_SECURITY_KEY`: Your NMI security key (required)
- `FRONTEND_URL`: URL of your frontend store (used for payment redirect URLs)

## Usage

This plugin automatically registers the NMI payment provider with Medusa.