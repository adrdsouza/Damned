# Sezzle Payment Provider Documentation

## Overview
Sezzle is a "Buy Now, Pay Later" payment solution integrated as a virtual card provider. When a customer selects Sezzle as their payment method, they are redirected to a Sezzle interface where they can sign up or log in, then receive a virtual card to complete their purchase.

## Configuration

### Environment Variables
These variables should be set in your backend `.env` file:

```
# Sezzle Configuration
SEZZLE_PUBLIC_KEY=your_key_here
SEZZLE_PRIVATE_KEY=your_key_here
SEZZLE_SANDBOX_MODE=false  # Set to "true" for sandbox testing
SEZZLE_CAPTURE_MODE=automatic  # Can be "automatic" or "manual"
```

### Production Configuration (Currently in use)
- **Production Public Key**: `sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT`
- **Production Private Key**: `sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR`
- **Sandbox Mode**: Set to `false`
- **API Endpoint**: `https://gateway.sezzle.com`
- **Capture Mode**: `automatic`

### Sandbox Configuration (Not currently in use)
- **Sandbox Public Key**: `sz_pub_fV7SRB5FuCvueYl07GA5lOObLRjEY6be`
- **Sandbox Private Key**: `sz_pr_nIhPldbj7QgcZjWffh78GV6kYKgyqBog`
- **Sandbox Mode**: Set to `true`
- **API Endpoint**: `https://sandbox.gateway.sezzle.com`

## Integration Details
This integration uses Sezzle's virtual card API which:
1. Authenticates with Sezzle to obtain an access token
2. Creates a virtual card session when a customer chooses Sezzle
3. Directs the customer to complete their information in Sezzle's dashboard
4. Processes the payment through the virtual card in your regular payment system

## Test Credit Cards
For testing in sandbox mode, you can use these cards:

| Brand | Number | CVC | Expiration |
|-------|--------|-----|------------|
| Visa | 4242424242424242 | Any 3 digits | Any future date |
| Mastercard | 5555555555554444 | Any 3 digits | Any future date |
| Amex | 371449635398431 | Any 4 digits | Any future date |
| Amex | 378282246310005 | Any 4 digits | Any future date |
| Discover | 6011111111111117 | Any 3 digits | Any future date |

## Checkout Testing Notes
- For sandbox testing, the expected OTP is `123123`
- Any valid US or CA phone number can be used
- Personal information does not need to be real
- The Sezzle dashboard URL will contain `sandbox` when testing

## Switching to Production
When ready to go live:
1. Update `.env` with production keys from Sezzle merchant dashboard
2. Set `SEZZLE_SANDBOX_MODE` to `false`
3. Test a complete transaction flow in production
4. Monitor transaction status in your production Sezzle dashboard

## Troubleshooting

### Automated Connection Test Script
The script `/root/damneddesigns/scripts/utility/test-payment-providers.sh` can be used to test the Sezzle API connection using sandbox credentials.

**Result of latest execution (April 30, 2025):**
Using Sezzle Public Key: `sz_pub_f*****LRjEY6be` (Sandbox Key)
Using Sezzle Private Key: `sz_pr_nI*****YKgyqBog` (Sandbox Key)
Using Sezzle Sandbox Mode: true
API URL: `https://sandbox.gateway.sezzle.com`

The script successfully obtained an authentication token and created a checkout session using the sandbox credentials.

**Conclusion:** The basic API connectivity and authentication for Sezzle are functioning correctly with the provided sandbox credentials.

### Production Issues
As noted in the `payment_issues_analysis.md` file, the Sezzle integration in the production environment is currently failing with `401 Unauthorized` errors. To troubleshoot this:
* Check Sezzle API authentication by running `test-payment-providers.sh` (ensure production mode and keys are used for this specific test).
* Verify token generation and expiration handling.
* Ensure proper error handling for API requests.
* For virtual card issues, check both Sezzle dashboard and your payment processor logs.
* Ensure the `SEZZLE_API_MODE` in the backend's `.env` file matches the type of keys being used (sandbox keys with sandbox mode, production keys with production mode).
* Verify that the Sezzle webhook configuration is correctly set up to receive callbacks from Sezzle.
---

## Storefront Sezzle Implementation Plan (2025-04-30)

### 1. Summary of Current State and Blockers

- **Storefront**: Next.js 15, React 19, TypeScript, Tailwind, React Query, Medusa JS SDK.
- **Sezzle Backend**: Sandbox mode is working; production previously had 401 errors, but sandbox API connectivity and authentication are confirmed working as of April 30, 2025.
- **Frontend**: No dedicated Sezzle payment form/component is present; integration is not complete on the storefront.

### 2. Key Requirements from Sezzle Direct API Docs

- **Sezzle Direct API**: Used for direct integration (not just redirect/hosted checkout).
- **Authentication**: Requires public/private keys and access token.
- **Session Creation**: Create a checkout session via API, receive a session UUID.
- **Customer Redirection**: Redirect customer to Sezzle for authentication/approval.
- **Order Completion**: After approval, Sezzle redirects back to your site with session info.
- **Payment Processing**: Use the session UUID to process payment via backend.
- **Webhooks**: Handle asynchronous updates (e.g., payment completion, cancellation).

### 3. Step-by-Step Implementation Plan

#### A. Storefront: Initiate Sezzle Checkout

1. **Add Sezzle as a Payment Option**
   - Update payment method selection UI to include Sezzle.
   - Use the provider ID `pp_sezzle_sezzle` for Medusa compatibility.

2. **Create a Sezzle Checkout Session**
   - On Sezzle selection, call a backend endpoint to create a Sezzle session (do not expose private keys on frontend).
   - Backend should use Sezzle API to create a session and return the session UUID and redirect URL.

3. **Redirect Customer to Sezzle**
   - Storefront receives the redirect URL from backend and navigates the customer to Sezzle for authentication/approval.

4. **Handle Sezzle Redirect Back**
   - After customer completes Sezzle flow, they are redirected back to your site (use a dedicated return/callback route).
   - Extract session UUID and any relevant info from the redirect parameters.

#### B. Storefront: Complete Order After Sezzle Approval

1. **Confirm Session and Place Order**
   - On the return/callback page, call the backend to confirm the Sezzle session and complete the order.
   - Backend should verify the session status with Sezzle and process the payment.

2. **Show Confirmation or Error**
   - Display order confirmation or error message to the customer based on backend response.

#### C. Backend: Sezzle Session and Payment Handling

1. **Session Creation Endpoint**
   - Implement an endpoint to create a Sezzle session using the Direct API.
   - Store the session UUID and associate it with the cart/order.

2. **Session Confirmation Endpoint**
   - Implement an endpoint to confirm the Sezzle session after redirect.
   - Use the session UUID to verify payment status and complete the order.

3. **Webhook Handling**
   - Implement webhook endpoints to receive asynchronous updates from Sezzle (e.g., payment completed, cancelled).
   - Update order/payment status accordingly.

#### D. UI/UX and Error Handling

- Show loading states and error messages during Sezzle session creation, redirection, and order completion.
- Handle cases where the customer cancels or fails the Sezzle flow.

#### E. Testing and Validation

- Test the full flow in sandbox mode:
  - Session creation
  - Customer redirection and approval
  - Return/callback handling
  - Payment processing
  - Webhook updates
- Test in production with real credentials after sandbox validation.

#### F. Documentation and Maintenance

- Document the integration steps and any custom logic in your project’s documentation.
- Add troubleshooting steps for common issues (authentication, session errors, webhook failures).

### 4. Clarification on Current Environment

- As of April 30, 2025, the Sezzle integration is running in **sandbox mode** with sandbox credentials, and the API is working correctly. Any previous references to production errors in `payment_issues_analysis.md` are now outdated. Please refer to this document for the latest status.

---