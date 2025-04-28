# Cash on Delivery (COD) Payment Method

## Status

**NOTE: This document is outdated. The system now uses Medusa's built-in manual payment method instead of a custom COD implementation.**

The system has been updated to use Medusa's built-in manual payment method (`pp_system_default`) instead of the custom COD payment method. This change simplifies the payment flow and uses the standard Medusa functionality.

## Implementation

The manual payment method is configured in the storefront with:
- Provider ID: `pp_system_default`
- Title: "Manual Payment"

## Button Text in Checkout

The payment button in the checkout flow uses the `ManualTestPaymentButton` component for the manual payment method. This component displays "Place order" as the button text.

## Configuration

No additional configuration is needed for the manual payment method as it's built into Medusa core. The previous custom COD implementation (`medusa-payment-cod`) is no longer being used, although the package files still exist in the repository.

## Related Files

- `/storefront/src/lib/constants.tsx` - Defines the manual payment method provider
- `/storefront/src/modules/checkout/components/payment-button/index.tsx` - Implements the payment button UI

## Testing

When testing the manual payment method, orders will be created in a "pending" state and need to be manually marked as "captured" in the admin panel once payment is received.