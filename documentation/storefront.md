# Damned Designs Storefront Documentation

## Overview

The Damned Designs storefront is a Next.js-based e-commerce frontend that serves as the customer-facing website. This document provides detailed technical information about the storefront architecture, configuration, development workflow, and troubleshooting.

## Architecture & Components

### Core Components

- **Framework**: Next.js 15.0.3
- **React Version**: React 19 (RC)
- **Directory**: `/root/damneddesigns/storefront`
- **Styling**: Tailwind CSS
- **State Management**: React Query via Medusa's JS SDK (latest version)
- **Routing**: Next.js App Router
- **Port**: 8000

### Key Directory Structure

```
/storefront
├── .eslintrc.js           # ESLint configuration
├── next-sitemap.js        # Sitemap generation config
├── public/                # Static assets
└── src/
    ├── app/               # Next.js app router pages and layouts
    │   ├── [countryCode]/ # Country/region-specific routes
    │   │   ├── (main)/    # Main layout group
    │   │   ├── account/   # User account pages
    │   │   ├── cart/      # Shopping cart
    │   │   ├── checkout/  # Checkout flow
    │   │   └── products/  # Product listings and details
    │   └── layout.tsx     # Root layout
    ├── lib/               # Utility functions and shared code
    │   ├── context/       # React context providers
    │   └── hooks/         # Custom React hooks
    ├── modules/           # Feature modules
    │   ├── cart/          # Cart functionality
    │   ├── checkout/      # Checkout functionality
    │   ├── common/        # Shared components
    │   ├── layout/        # Layout components
    │   ├── products/      # Product components
    │   └── store/         # Store-related functionality
    └── styles/            # Global styles
```

## Server/Client Component Architecture

The storefront follows Next.js App Router best practices for server and client components:

### Server Components

- Used for:
  - Data fetching from Medusa API
  - Initial page rendering
  - SEO optimization
  - Layout structures

### Client Components

- Used for:
  - Interactive UI elements
  - Cart management
  - Form handling
  - Client-side navigation
  - Payment processing

### Boundary Management

The server/client component boundary is carefully managed:

1. Server components fetch data and pass serializable data to client components
2. Client components are marked with `"use client"` directive
3. Server actions are marked with `"use server"` directive
4. No client components import server-only functions

## Configuration Details

### Environment Variables

<<<<<<< HEAD
See `documentation/env-variables.md` for all required environment variables for the storefront.
=======
The storefront configuration relies on environment variables defined in `/root/damneddesigns/storefront/.env`:

```
# Backend communication
MEDUSA_BACKEND_URL=https://api.damneddesigns.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_4a68e1bd85e72212ebbe8364d329891e7bdabcc921912541f37078fcfe197bfe

# Storefront configuration
NEXT_PUBLIC_BASE_URL=https://damneddesigns.com
NEXT_PUBLIC_DEFAULT_REGION=us

# Revalidation
REVALIDATE_SECRET=supersecret
```
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1

### Medusa Client Configuration

The Medusa client is configured to communicate with the backend API:

```typescript
import Medusa from '@medusajs/medusa-js'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'https://api.damneddesigns.com'
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
  publishableApiKey: PUBLISHABLE_API_KEY
})
```

### Region & Country Handling

The storefront implements sophisticated region handling:

1. **URL Structure**: Uses `/[countryCode]/path` pattern for region-specific URLs
2. **Region Selection**: Automatically detects user's region or fallback to default
3. **Currency Display**: Shows prices in region's currency
4. **Middleware**: Handles redirects based on region selection

## Key Features

### Product Browsing

- Product listings with filtering and sorting
- Product detail pages with variants
- Product image galleries
- Related products recommendations

### Cart Functionality

- Add to cart with variant selection
- Cart preview/drawer
- Quantity adjustments
- Cart total calculations

### Checkout Process

1. **Cart Review**: Verify items and quantities
2. **Shipping Information**: Address collection
3. **Shipping Method**: Select from available options
4. **Payment**: Multiple payment options:
   - Credit/debit card via NMI
   - Sezzle "Buy Now, Pay Later"
   - Manual Payment (Medusa's built-in system default provider)
5. **Order Confirmation**: Confirmation page with order details

### User Account

- User registration and login
- Order history
- Address management
- Profile information

## Payment Integration

### Available Payment Methods

The storefront is configured with the following payment providers:

1. **Manual Payment**: Medusa's built-in payment provider (`pp_system_default`)
   - Implemented using a simple button to place order
   - No external payment provider integration
   - Used for offline or alternative payment methods
   - Defined in `/src/lib/constants.tsx` using the `isManual()` function

2. **NMI Payment Gateway**: For credit card processing
   - Provider ID: `pp_nmi_nmi`
   - Processed through backend NMI integration
   - Configured for production use

3. **Sezzle Payment Gateway**: For buy now, pay later
   - Provider ID: `pp_sezzle_sezzle`
   - Processed through backend Sezzle integration
   - Configured for production use

### Payment Flow Implementation

Payment processing is implemented in `/src/modules/checkout/components/payment-button/index.tsx` with the following logic:

```typescript
// Determine which payment UI to show based on provider
switch (true) {
  case isStripe(paymentSession?.provider_id):
    return <StripePaymentButton />
  case isManual(paymentSession?.provider_id):
    return <ManualTestPaymentButton />
  default:
    return <Button disabled>Select a payment method</Button>
}

// Helper function in constants.tsx
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}
```

## Development Workflow

### Local Development

For local development:

1. Start the storefront in development mode:
   ```bash
   cd /root/damneddesigns/storefront
   npm run dev
   ```

2. This launches Next.js development server with:
   - Hot Module Replacement
   - Fast Refresh
   - Development error overlay

### Building for Production

The production build process:

1. Build the production assets:
   ```bash
   cd /root/damneddesigns/storefront
   npm run build
   ```
   
2. Start the production server:
   ```bash
   npm run start
   ```

3. The production server runs on port 8000

### Using the Development Script

For convenience, a development script is available:
```bash
/root/damneddesigns/storefront-dev.sh
```

This script:
1. Stops any running storefront process
2. Sets up the environment
3. Starts the development server

## Rendering Strategies

The storefront uses Next.js rendering strategies:

### Server-Side Rendering (SSR)

Used for:
- Dynamic catalog pages
- Search results
- User-specific pages (cart, account)
- Checkout flow

### Dynamic Rendering

Used for:
- Product pages with `dynamic = 'force-dynamic'` directive
- This ensures product data is always fresh
- Important for pages that need real-time data

### Static Generation

Used for:
- Homepage
- Static pages (about, terms)
- Product category listings that change infrequently

## API Integration

### Medusa API Communication

The storefront communicates with the Medusa backend via:

1. **Base URL**: `https://api.damneddesigns.com`
2. **API Key**: Uses publishable API key for authentication
3. **Client Library**: Uses `@medusajs/medusa-js` for standardized requests
4. **Data Fetching**: Server components fetch data directly from the API
5. **Client Updates**: Client components use React Query for mutations

### Data Fetching Pattern

```typescript
// In server component
async function ProductPage({ params }: Props) {
  // Fetch product data from Medusa
  const product = await getProduct(params.handle)
  
  // Pass serializable data to client components
  return (
    <div>
      <ProductInfo product={product} />
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```

## Common Issues & Troubleshooting

### Product Page 500 Errors

- **Problem**: Static generation issues with dynamic product data
- **Solution**: Force dynamic rendering by adding to product page file:
  ```javascript
  // In /storefront/src/app/[countryCode]/(main)/products/[handle]/page.tsx
  export const dynamic = 'force-dynamic'
  ```
- This ensures the page is always rendered with fresh data

### Database Schema Mismatches

- **Problem**: "column i1.is_giftcard does not exist" error when adding products to cart
- **Solution**:
  1. Connect to the PostgreSQL database: `psql -U myuser -d medusa-medusaapp`
  2. Add the missing column: `ALTER TABLE cart_line_item ADD COLUMN is_giftcard BOOLEAN NOT NULL DEFAULT FALSE;`
<<<<<<< HEAD
  3. Restart services: `pm2 restart backend storefront`
=======
  3. Restart services: `pm2 restart damned-designs-backend damned-designs-storefront`
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1

### Payment Provider Issues

If payment methods aren't displaying correctly:

1. **Check Provider IDs**: Verify payment provider identifiers match between backend and frontend
   - Backend provider IDs should be properly set in `medusa-config.ts`
   - Frontend constants should reference these IDs correctly in `constants.tsx`
   - Format: `pp_provider_provider` (e.g., `pp_system_default`, `pp_nmi_nmi`)

2. **Verify Client Components**: 
   - Ensure all payment components use `"use client"` directive
   - Add proper error handling and Suspense boundaries

3. **Check Backend Configuration**:
   - Verify payment plugins are registered in `/backend/medusa-config.ts`
   - Ensure environment variables for payment providers are set correctly

### Storefront to Backend Connection Issues

If the storefront cannot connect to the backend:

1. Verify the `MEDUSA_BACKEND_URL` is set to `https://api.damneddesigns.com`
2. Check the Caddy configuration for proper proxy settings
3. Ensure the publishable API key is correct and being sent with requests
4. Check browser console for CORS or network errors
<<<<<<< HEAD
5. Verify the backend is running: `pm2 status backend`
=======
5. Verify the backend is running: `pm2 status damned-designs-backend`
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1

## Performance Optimization

The storefront is optimized for production with:

1. **Code Splitting**: Automatic by Next.js for routes and components
2. **Image Optimization**: Via Next.js Image component
3. **Caching Strategy**: Mixed caching strategies including:
   - `force-cache` for static content
   - `no-store` for dynamic content
4. **Bundle Optimization**: Minimized JavaScript bundles
5. **Tree Shaking**: Removes unused code in production builds

## Security Considerations

The storefront implements several security measures:

1. **HTTPS Only**: All traffic is encrypted via HTTPS
2. **API Key Security**: Publishable API key only used for intended requests
3. **Input Validation**: Form inputs validated on both client and server
4. **XSS Protection**: React's built-in XSS protection
5. **CORS Compliance**: Proper CORS headers for API requests

## Deployment Process

The standard deployment process:

1. Build the production assets:
   ```bash
   cd /root/damneddesigns/storefront
   npm run build
   ```

2. Start or restart the service with PM2:
   ```bash
<<<<<<< HEAD
   pm2 restart storefront
=======
   pm2 restart damned-designs-storefront
>>>>>>> d4d4b96a18440c787d584830841abd610f1a05d1
   ```

3. Verify the deployment:
   - Check the site is accessible at `https://damneddesigns.com`
   - Test critical flows (browse products, add to cart, checkout)
   - Verify all regions and currencies are working

---

*Last updated: April 30, 2025 (Next.js 15.0.3, Medusa JS SDK latest version, Manual payment method active)*