# NMI Payment Gateway Integration

## Overview
This document outlines the NMI (Network Merchants Inc) payment gateway integration with Medusa e-commerce platform for damneddesigns.com. The integration enables secure credit card processing through NMI's payment services.

## Configuration Details

### Environment Variables
These variables should be set in your backend `.env` file:

```
# NMI Configuration
NMI_SECURITY_KEY=h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp
# NMI_TEST_MODE is no longer used in the latest implementation
```

### Production Configuration (Currently in use)
- **Production Security Key**: `h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp`
- **Production Checkout Public Key**: `checkout_public_2he6c5yTBC73u3AV2reJeHb37TpEegUa`
- **API Endpoint**: `https://secure.nmi.com/api/transact.php`

### Test Configuration (Not currently in use)
- **Test Security Key**: `6457Thfj624V5r7WUwc5v6a68Zsd6YEm`
- **API Endpoint**: `https://secure.nmi.com/api/transact.php`

### System Details
- **Plugin Location**: `/root/damneddesigns/packages/medusa-payment-nmi`
- **Plugin ID in Database**: `pp_nmi_nmi`

## Features

### Currently Implemented
- ✅ Basic payment processing (authorization & capture)
- ✅ Payment status tracking
- ✅ Integration with Medusa checkout flow
- ✅ Admin panel visibility
- ✅ Single region association

### Partially Implemented
- ⚠️ Refunding (API calls defined but need testing)
- ⚠️ Webhook handling (routes set up but need verification)
- ⚠️ Voiding transactions (methods defined but need verification)

### Not Implemented
- ❌ Customer payment method storage
- ❌ Subscription billing
- ❌ Advanced fraud detection

## Technical Implementation

### Plugin Structure
```
medusa-payment-nmi/
  ├── dist/               # Compiled JavaScript files
  ├── src/
  │   ├── api/
  │   │   └── routes/
  │   │       └── hooks/  # Webhook handling
  │   │           └── index.js
  │   ├── services/
  │   │   └── nmi-provider.js  # Main payment service logic
  │   └── index.js        # Plugin registration
  ├── .babelrc
  ├── package.json
  └── README.md
```

### Key Methods
- `initiatePayment`: Handles initial payment authorization
- `capturePayment`: Captures previously authorized payments
- `refundPayment`: Processes refunds (needs testing)
- `cancelPayment`: Voids transactions (needs testing)
- `getPaymentStatus`: Retrieves current payment status

### Database Integration
The plugin is registered in the database with:
- Payment provider entry: `pp_nmi_nmi`
- Region association: Connected to USA region (`reg_01JRHVWY8KXADW4FW7QHXATGFD`)

## Webhook Support
Webhook routes are defined in `/src/api/routes/hooks/index.js` and handle the following events:
- Transaction settlement notifications
- Refund processing notifications

**Implementation Status**: Basic webhook structure is set up but requires complete testing and potentially updating with NMI-specific signature verification.

## Maintenance Notes

### Adding to New Regions
To add the NMI payment provider to a new region, run:
```sql
INSERT INTO region_payment_provider (region_id, payment_provider_id, id) 
VALUES ('[new_region_id]', 'pp_nmi_nmi', '[new_unique_id]');
```

### Debugging
If payment issues occur, check the following:
1. Verify region associations in database
2. Check NMI API responses in server logs
3. Verify webhook payloads and processing

### Security Considerations
- All credentials are stored in `.env` files
- API calls use HTTPS
- No customer payment data is stored in the Medusa database

## Testing and Verification
To test the payment integration:
1. Create a test order in the storefront
2. Process a payment through the checkout flow
3. Verify the transaction in the NMI merchant portal

### Connectivity Test Result (Manual Test)
A manual connectivity test to the API endpoint `https://secure.nmi.com/api/transact.php` was performed. The API is reachable and responded with an authentication error (response code 300), confirming connectivity.

### Automated Connection Test Script
The script `/root/damneddesigns/scripts/utility/test-payment-providers.sh` can be used to test the NMI API connection using test credentials.

**Result of latest execution (April 30, 2025):**
Using NMI Security Key: `6457T*****d6YEm` (Test Key)
Using NMI Test Mode: enabled
API URL: `https://secure.nmi.com/api/transact.php`

NMI API Response:
`response=1&responsetext=SUCCESS&authcode=&transactionid=10660872751&avsresponse=Y&cvvresponse=M&orderid=&type=validate&response_code=100`

**Conclusion:** The connection to the NMI API is successful using the provided test credentials, returning a `SUCCESS` response (code 100).

## Known Limitations
1. The implementation primarily handles one-time payments
2. Advanced NMI features are not fully integrated
3. Webhook handling needs verification with real NMI webhooks

## Future Enhancements
1. Complete refund handling testing
2. Improve webhook security with signature verification
3. Implement customer payment method storage (if needed)
4. Add detailed error handling and reporting

---

## Storefront NMI Implementation Plan (2025-04-30)

### 1. Summary of Current State and Blockers

- **Storefront**: Next.js 15, React 19, TypeScript, Tailwind, React Query, Medusa JS SDK.
- **NMI Backend**: Set up and working in test mode. The environment is currently configured to use test credentials, and the test API is working correctly.
- **Frontend**: 
  - NMI payment form exists (`nmi-payment-form.tsx`) and is structured for Collect.js.
  - **Blocker**: `useCart` and `useCheckout` hooks are missing, so cart and checkout state are not accessible in the payment form.
  - Collect.js script loading is not handled.
  - Tokenization key is expected from an env variable.
  - The `placeOrder` function may not be set up to handle the NMI payment token.

### 2. Key Requirements from NMI Docs

- **Collect.js** must be loaded on the page (via script tag or dynamic import).
- **Tokenization key** (public key) is required for Collect.js configuration.
- **Card fields** are rendered as iframes by Collect.js.
- On successful tokenization, a payment token is returned and must be sent to the backend for processing.
- **Security**: Never send raw card data to your backend; only the token.

### 3. Step-by-Step Implementation Plan

#### A. Fix Cart and Checkout State Access

1. Implement or Refactor Cart/Checkout Hooks

   - **Option 1:** Implement `useCart` and `useCheckout` hooks in `src/lib/hooks/` that use React Query and Medusa JS SDK to provide cart and checkout state.
   - **Option 2:** If cart/checkout state is already available via context or props in the checkout flow, refactor the NMI payment form to consume that data directly (remove the broken imports).

   ```mermaid
   flowchart LR
     A[Checkout Page] --> B[NMI Payment Form]
     B -->|Needs| C[Cart State]
     B -->|Needs| D[Checkout State]
     C & D -->|From| E[React Query/Medusa SDK/Context]
   ```

   Example: Minimal `useCart` Hook

   ```ts
   // src/lib/hooks/use-cart.tsx
   import { useQuery } from "@tanstack/react-query";
   import { medusaClient } from "../config";

   export function useCart() {
     const { data, ...rest } = useQuery(["cart"], () => medusaClient.carts.retrieve());
     return { cart: data?.cart, ...rest };
   }
   ```
   (Adjust as needed for your actual cart state management.)

#### B. Ensure Collect.js is Loaded

- Add a `<script src="https://secure.nmi.com/token/Collect.js"></script>` tag to the checkout page, or dynamically load it in the payment form component.
- Add error handling if the script fails to load.

#### C. Pass the Tokenization Key Securely

- Add `NEXT_PUBLIC_NMI_TOKENIZATION_KEY` to your `.env` file and expose it to the frontend.
- In the payment form, use `process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY` for Collect.js configuration.

#### D. Update the Payment Form Logic

- On form submit, Collect.js tokenizes the card data and returns a token.
- Send the token to your backend (via the existing `placeOrder` or a new API endpoint).
- Backend uses the token to process the payment with NMI.

   ```mermaid
   sequenceDiagram
     participant User
     participant Storefront
     participant CollectJS
     participant Backend
     participant NMI

     User->>Storefront: Enter card details
     Storefront->>CollectJS: Tokenize card data
     CollectJS-->>Storefront: Return payment token
     Storefront->>Backend: Send payment token + order info
     Backend->>NMI: Process payment with token
     NMI-->>Backend: Payment result
     Backend-->>Storefront: Order confirmation
     Storefront-->>User: Show success/failure
   ```

#### E. Backend: Accept and Process Payment Token

- Ensure the backend order placement endpoint accepts the NMI payment token and uses it to process the payment via the NMI plugin.
- Update the backend if necessary to handle the tokenized flow.

#### F. UI/UX and Error Handling

- Show loading states and error messages in the payment form.
- Disable the submit button while processing.
- Display success/failure feedback to the user.

#### G. Testing and Validation

- Test the full flow in sandbox/test mode:
  - Card tokenization
  - Order placement
  - Payment processing
  - Error handling (invalid card, network issues, etc.)
- Test in production with real credentials (after backend issues are resolved).

#### H. Documentation and Maintenance

- Document the integration steps and any custom logic in your project’s documentation.
- Add troubleshooting steps for common issues (script loading, tokenization errors, backend failures).

### 4. Clarification on Current Environment

- As of April 30, 2025, the NMI integration is running in **test mode** with test credentials, and the test API is working correctly. The environment was switched from production to test, so any previous references to production errors in `payment_issues_analysis.md` are now outdated. Please refer to this document for the latest status.

---
---

*Last updated: April 22, 2025*