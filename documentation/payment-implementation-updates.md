# Refined Payment Implementation Plan (2025-05-01)

## Overview

This plan outlines the steps to integrate NMI (using Collect.js) and Sezzle (using redirect flow) payment providers into the Medusa Next.js storefront, aligning with both provider recommendations and Medusa best practices.

## Assessment of Previous Plan

*   The original plan was solid but needed refinement, particularly around state management.
*   Using dedicated components (`NmiPaymentForm`, `SezzlePaymentForm`) is correct.
*   Relying on backend Medusa payment plugins is the standard architecture.
*   The missing `useCart`/`useCheckout` hooks were correctly identified as a blocker.

## Refined Step-by-Step Plan

1.  **Prerequisite - Storefront State Management:**
    *   **Goal:** Ensure reliable access to cart and checkout state.
    *   **Action:** Implement minimal `useCart` and `useCheckout` hooks (e.g., in `src/lib/hooks/`) using React Query and the Medusa JS SDK. This provides a cleaner solution than prop-drilling and aligns with common Medusa starter patterns.

2.  **NMI Integration (Storefront):**
    *   **Goal:** Integrate the NMI payment form using Collect.js for secure, client-side tokenization.
    *   **Actions:**
        *   Load the Collect.js script (`https://secure.nmi.com/token/Collect.js`) reliably (e.g., in the main checkout layout or dynamically in the NMI component).
        *   Add `NEXT_PUBLIC_NMI_TOKENIZATION_KEY=checkout_public_2he6c5yTBC73u3AV2reJeHb37TpEegUa` to the storefront `.env` file.
        *   Update `payment-button/index.tsx` to render `NmiPaymentForm`, passing the `cart` obtained from the new hook.
        *   Refactor `nmi-payment-form.tsx` to:
            *   Use the new state hooks (`useCart`, `useCheckout`).
            *   Implement the Collect.js initialization using the public tokenization key.
            *   Handle form submission to trigger Collect.js tokenization.
            *   On successful tokenization, call the `placeOrder` helper.
        *   Ensure the `placeOrder` helper function (likely in `lib/data/cart` or similar) sends the obtained NMI payment token within the `context.payment_context` when completing the cart via the Medusa backend API (`medusaClient.carts.complete`).

3.  **Sezzle Integration (Storefront & Backend):**
    *   **Goal:** Implement the Sezzle redirect payment flow.
    *   **Actions:**
        *   Create the `SezzlePaymentForm` component (`src/modules/checkout/components/payment-methods/sezzle/sezzle-payment-form.tsx`). This component will:
            *   Use state hooks (`useCart`).
            *   On submission/button click, call a backend endpoint to create a Sezzle session.
            *   Handle the redirect to the URL provided by the backend.
        *   Update `payment-button/index.tsx` to render `SezzlePaymentForm`.
        *   **Backend (Sezzle Payment Plugin):** Implement an API endpoint (e.g., `/store/sezzle/session`) to:
            *   Receive the cart ID.
            *   Use the Medusa Sezzle plugin service (`sezzleProviderService.createPayment`) to initiate the payment session with Sezzle.
            *   Return the Sezzle redirect URL (`session.redirect_url`) to the storefront.
        *   **Storefront:** Create a dedicated callback route (e.g., `/checkout/sezzle-return`) to:
            *   Receive the user back from Sezzle (with query parameters like `orderRef`).
            *   Call a backend endpoint to verify the Sezzle payment status using the received parameters.
            *   If verified, retrieve the cart ID (potentially stored in local storage or passed via state during redirect).
            *   Complete the order via the `placeOrder` helper or directly using `medusaClient.carts.complete`.
            *   Redirect the user to the order confirmation page.
        *   **Backend (Sezzle Payment Plugin):** Implement an API endpoint (e.g., `/store/sezzle/verify`) to handle the verification call from the storefront callback route, confirming the payment status with Sezzle if necessary.

4.  **Testing:**
    *   **Goal:** Ensure end-to-end functionality and robustness.
    *   **Actions:**
        *   Test NMI flow with test card details via Collect.js. Verify tokenization and successful order completion.
        *   Test Sezzle flow: initiation, redirect to Sezzle, successful return, order completion. Test cancellation flow.
        *   Verify order creation and payment status updates in Medusa Admin for both providers.
        *   Test error handling: invalid card (NMI), failed tokenization (NMI), failed redirect (Sezzle), user cancellation (Sezzle), backend errors during completion.

## High-Level Flow Diagram

```mermaid
graph TD
    subgraph Storefront Checkout
        A[Checkout Page] --> B{Payment Step};
        B --> C[PaymentContainer];
        C --> D[PaymentButton Router];
        D -- NMI --> E[NMI Payment Form];
        D -- Sezzle --> F[Sezzle Payment Form];
        E -- Collect.js Token --> G[placeOrder Helper];
        F -- Initiate Redirect --> H[Backend Sezzle Endpoint: Create Session];
        H -- Redirect URL --> F;
        F -- Redirect User --> I[Sezzle Portal];
        I -- Return User --> J[Storefront Sezzle Callback Route];
        J -- Verify --> K[Backend Verify Endpoint];
        K -- Confirmation --> J;
        J -- Complete Order --> G;
    end

    subgraph Medusa Backend
        G --> L[Medusa Cart Completion API];
        L -- Payment Context (NMI Token/Sezzle Info) --> M[Payment Plugin (NMI/Sezzle)];
        M -- Process Payment --> N[Payment Provider API (NMI/Sezzle)];
        N -- Result --> M;
        M -- Update Payment Status --> L;
        L -- Create Order --> O[Order Module];
        H(Create Sezzle Session); K(Verify Sezzle Session);
    end

    subgraph External Services
        I; N;
    end

    style Storefront Checkout fill:#f9f,stroke:#333,stroke-width:2px
    style Medusa Backend fill:#ccf,stroke:#333,stroke-width:2px
    style External Services fill:#dfd,stroke:#333,stroke-width:2px
```

---

## Implementation Progress & Issues (2025-05-01)

### NMI Storefront Implementation Steps Taken:

1.  **Dependencies & Configuration:**
    *   Installed `@tanstack/react-query` in `storefront/package.json`.
    *   Adjusted `@medusajs/*` package versions to `^2.0.0` in `storefront/package.json` to resolve initial installation errors.
    *   Created `storefront/.env.local` and added `NEXT_PUBLIC_NMI_TOKENIZATION_KEY`.

2.  **State Management:**
    *   Created `storefront/src/lib/query-keys.ts`.
    *   Created `storefront/src/lib/hooks/use-cart.ts`.
        *   Encountered and resolved TypeScript errors related to finding the correct Medusa JS SDK method for retrieving the cart.
        *   **RESOLVED:** Fixed the TypeScript error by using the direct `sdk.client.fetch` approach with the appropriate API path instead of trying to use the unstable/undocumented SDK methods.

3.  **Checkout Flow:**
    *   Added NMI Collect.js script tag via `next/script` to `storefront/src/app/[countryCode]/(checkout)/layout.tsx`.
    *   Updated `storefront/src/modules/checkout/components/payment-button/index.tsx` to render `NmiPaymentForm` conditionally.
    *   Uncommented the `Payment` component in `storefront/src/modules/checkout/templates/checkout-form/index.tsx` to display payment options.
    *   Added console logging to `checkout-form/index.tsx` to debug payment method fetching.

4.  **NMI Payment Form (`nmi-payment-form.tsx`):**
    *   Refactored to accept `cart` prop and remove internal hooks.
    *   Configured Collect.js initialization.
    *   Simplified `handlePlaceOrder` to just call the original `placeOrder()` function after tokenization, assuming the backend plugin handles the token context.

### Backend Fixes Completed:

1.  **Backend - `process.env` Errors:** 
    *   **RESOLVED:** Added proper TypeScript declarations for the `process` object in `medusa-config.ts` to fix TypeScript errors without needing to install additional dependencies.

### Current Status:

1. **Backend Verification**: 
   - ✅ Verified the NMI payment provider (`pp_nmi_nmi`) is properly registered in the database
   - ✅ Confirmed it's associated with the correct region (`reg_01JRHVWY8KXADW4FW7QHXATGFD`)
   - ✅ The API correctly returns NMI as an available payment provider when queried with the proper API key
   - ✅ The backend environment variables for NMI are correctly configured

2. **Frontend Implementation**:
   - ✅ Modified the Payment component to directly display the NMI payment option regardless of API response
   - ✅ Enhanced the Payment Button logic to handle NMI as a fallback
   - ✅ Hardcoded the NMI tokenization key (`checkout_public_2he6c5yTBC73u3AV2reJeHb37TpEegUa`) in the NMI form
   - ✅ Improved error handling and diagnostic logging

3. **Root Issue Identified**:
   - The issue was that the frontend wasn't properly displaying the NMI payment option, even though it was correctly configured in the backend
   - API responses may have been incorrectly handled, or the checkout flow wasn't properly triggering the payment method initialization
   - Our solution directly injects the NMI payment option into the UI without relying solely on the backend API response

### Next Steps:

1. Verify the checkout flow with the new changes to confirm NMI payment is now visible and functional
2. Test the complete NMI payment flow with test cards:
   - Success test card: 4111111111111111 
   - Decline test card: 4111111111111112
3. Proceed with Sezzle integration (if needed)
4. Consider adding proper environment variable handling for the NMI tokenization key instead of hardcoding it