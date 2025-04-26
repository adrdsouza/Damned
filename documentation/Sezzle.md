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
SEZZLE_SANDBOX_MODE=true  # Set to "false" for production
SEZZLE_CAPTURE_MODE=automatic  # Can be "automatic" or "manual"
```

### Sandbox Configuration (Testing)
- **Sandbox Public Key**: `sz_pub_fV7SRB5FuCvueYl07GA5lOObLRjEY6be`
- **Sandbox Private Key**: `sz_pr_nIhPldbj7QgcZjWffh78GV6kYKgyqBog`
- **Sandbox Mode**: Set to `true`
- **API Endpoint**: `https://sandbox.gateway.sezzle.com`

### Production Configuration (Live)
- **Production Public Key**: Get from Sezzle merchant dashboard
- **Production Private Key**: Get from Sezzle merchant dashboard
- **Sandbox Mode**: Set to `false`
- **API Endpoint**: `https://gateway.sezzle.com`

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
- Check Sezzle API authentication by running `test-payment-providers.sh`
- Verify token generation and expiration handling
- Ensure proper error handling for API requests
- For virtual card issues, check both Sezzle dashboard and your payment processor logs