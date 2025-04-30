# Payment Implementation Updates

## Current Checkout Structure Overview

The storefront checkout has:
1. A `PaymentButton` component that renders different buttons based on provider ID
2. The provider detection functions in `constants.tsx` (`isNmi`, `isSezzle`, etc.)
3. A placeholder `GenericPaymentButton` handling both NMI and Sezzle (not properly integrated)
4. An existing `nmi-payment-form.tsx` that's not connected to the checkout flow

## Critical Updates Needed for NMI Implementation

1. **Payment Flow Integration**
   - Currently both NMI and Sezzle use a generic button that doesn't properly handle tokenization
   - Need to modify `payment-button/index.tsx` to render the proper `NmiPaymentForm` component instead

2. **Script Loading**
   - Add Collect.js script loading in checkout layout or a higher-level component
   - Ensure script is loaded before payment form renders

3. **Missing Hooks Implementation**
   - Implement cart access without relying on missing hooks:
   ```tsx
   // Option 1: Cart is already passed to PaymentButton, pass it to NmiPaymentForm
   case isNmi(paymentSession?.provider_id):
     return <NmiPaymentForm cart={cart} data-testid={dataTestId} />
   
   // Option 2: Create minimal hooks using existing API functions
   // src/lib/hooks/use-cart.tsx
   export function useCart() {
     // Use existing cart state from parent components or React Query
     return { cart: /* get from context or props */ };
   }
   ```

4. **Tokenization Key**
   - Add `NEXT_PUBLIC_NMI_TOKENIZATION_KEY=checkout_public_2he6c5yTBC73u3AV2reJeHb37TpEegUa` to storefront `.env`

5. **placeOrder Function Update**
   - Modify `placeOrder` in `lib/data/cart` to handle the NMI payment token

## Critical Updates Needed for Sezzle Implementation

1. **Create Sezzle Component**
   - Implement a dedicated Sezzle payment component at `src/modules/checkout/components/payment-methods/sezzle/sezzle-payment-form.tsx`
   - Similar structure to NMI but with Sezzle's redirect flow

2. **Update PaymentButton**
   - Modify `payment-button/index.tsx` to render the Sezzle component:
   ```tsx
   case isSezzle(paymentSession?.provider_id):
     return <SezzlePaymentForm cart={cart} data-testid={dataTestId} />
   ```

3. **Session & Redirect Handling**
   - Implement backend endpoint for creating Sezzle sessions
   - Add redirect handling in storefront for the return from Sezzle

4. **Callback Route**
   - Create a return URL page/route to handle Sezzle callbacks after approval

## Implementation Priority Order

1. Fix the hooks issue or refactor to use provided cart data
2. Update `payment-button/index.tsx` to use proper payment forms
3. Ensure Collect.js script loading for NMI
4. Implement backend endpoints for Sezzle session creation and confirmation
5. Create the Sezzle form component
6. Test end-to-end flows