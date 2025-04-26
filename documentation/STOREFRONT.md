# Damned Designs Storefront Documentation

## Overview

The Damned Designs storefront is a Next.js-based e-commerce frontend that serves as the customer-facing website. This document provides detailed technical information about the storefront architecture, configuration, development workflow, and troubleshooting.

## Architecture & Components

### Core Components

- **Framework**: Next.js 15.3.1
- **React Version**: React 19 (RC)
- **Directory**: `/root/damneddesigns/storefront`
- **Styling**: Tailwind CSS
- **State Management**: React Query via Medusa's SDK v2.7.1
- **Routing**: Next.js App Router

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

The storefront follows Next.js 15 best practices for server and client components:

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

### Boundary Management

The server/client component boundary is carefully managed:

1. Server components fetch data and pass serializable data to client components
2. Client components are marked with `"use client"` directive
3. Server actions are marked with `"use server"` directive
4. No client components import server-only functions

## Configuration Details

### Environment Variables

The storefront configuration relies on environment variables defined in `/root/damneddesigns/storefront/.env`:

```
# Backend communication
MEDUSA_BACKEND_URL=https://api.damneddesigns.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_37d4b273553c24414059314072f8423064879e3233e4022a85081d7703a5dfbf

# Storefront configuration
NEXT_PUBLIC_BASE_URL=https://damneddesigns.com
NEXT_PUBLIC_DEFAULT_REGION=us

# Legacy placeholder (not used)
NEXT_PUBLIC_STRIPE_KEY=pk_test_placeholder

# Revalidation
REVALIDATE_SECRET=supersecret
```

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
   - Cash on Delivery
5. **Order Confirmation**: Confirmation page with order details

### User Account

- User registration and login
- Order history
- Address management
- Profile information

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

## Server-Side Rendering & Static Generation

The storefront uses Next.js rendering strategies:

### Server-Side Rendering (SSR)

Used for:
- Dynamic catalog pages
- Search results
- User-specific pages (cart, account)
- Checkout flow

### Static Generation

Used for:
- Homepage
- Static pages (about, terms)
- Product category listings
- Common product detail pages

### Incremental Static Regeneration (ISR)

Used for:
- Product pages with `revalidate` set to appropriate intervals
- Category pages to keep content fresh while maintaining performance

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

### Server Components Render Error

If you encounter "Server Components render error" when processing payments:

1. **Root Cause**: This typically occurs due to a mismatch between payment provider identifiers or attempting to use client-side functionality in server components.

2. **Recent Fixes (April 2025)**:
   - Updated payment provider identifiers to the correct Medusa 2.7.1 format:
     - Changed `cod_cod` → `pp_cod_cod`
     - Changed `nmi_nmi` → `pp_nmi_nmi`
     - Changed `sezzle_sezzle` → `pp_sezzle_sezzle`
   - Enhanced error handling in payment components
   - Added React.Suspense and error boundaries in payment flow
   - Added proper client directives to all payment components
   - Used `dynamic = 'force-dynamic'` on checkout pages for fresh data

3. **Preventative Measures**:
   - Ensure all payment-related components have the `"use client"` directive
   - Payment provider identifiers must match the expected format (`pp_provider_provider`)
   - Implement error boundaries around payment components
   - Avoid accessing browser APIs in server components

### Storefront to Backend Connection Issues

If the storefront cannot connect to the backend:

1. Verify the `MEDUSA_BACKEND_URL` is set to `https://api.damneddesigns.com`
2. Check the Caddy configuration for proper proxy settings
3. Ensure the publishable API key is correct and being sent with requests
4. Check browser console for CORS or network errors
5. Verify the backend is running: `pm2 status damned-designs-backend`

### Add to Cart Issues

If add to cart functionality fails:

1. Check the browser console for errors
2. Verify the cart API endpoint is accessible
3. Ensure proper error handling is implemented in the cart module
4. Check if the cart cookie is being set correctly
5. If seeing "column i1.is_giftcard does not exist" errors, verify the database schema:
   ```sql
   -- Check if the column exists
   SELECT column_name FROM information_schema.columns 
   WHERE table_name='cart_line_item' AND column_name='is_giftcard';
   
   -- Add the column if it doesn't exist
   ALTER TABLE cart_line_item ADD COLUMN is_giftcard BOOLEAN NOT NULL DEFAULT FALSE;
   ```
6. After database schema changes, restart services:
   ```bash
   pm2 restart damned-designs-backend damned-designs-storefront
   pm2 save
   ```

### Checkout Flow Problems

If checkout process encounters issues:

1. **Payment Provider Integration**:
   - Verify all payment plugins are properly registered in the backend (`medusa-config.ts`)
   - Check payment provider identifiers match between backend and frontend:
     ```
     Backend identifier (services/*.js): static identifier = "pp_provider_provider";
     Frontend reference (constants.tsx): pp_provider_provider
     ```
   - Ensure all payment components use `"use client"` directive
   - Check for proper error handling in payment sessions initialization

2. **Region/Currency Issues**:
   - Check for region/currency mismatch errors
   - Ensure the selected region supports the payment methods being offered

3. **Shipping Method Problems**:
   - Ensure shipping methods are available for the selected region
   - Verify shipping options are properly configured in the backend

4. **Address Validation**:
   - Verify the address validation is working properly
   - Check for proper error handling in address forms

### Middleware Redirect Loops

If the site gets stuck in redirect loops:

1. Check the middleware logic in `middleware.ts`
2. Verify the region detection and fallback logic
3. Ensure the default region is properly configured
4. Confirm that country code validation is working
5. Add appropriate error boundaries in the middleware

## Performance Optimization

The storefront is optimized for production with:

1. **Code Splitting**: Automatic by Next.js for routes and components
2. **Image Optimization**: Via Next.js Image component
3. **Caching Strategy**: Mixed caching strategies including:
   - `force-cache` for static content
   - `no-store` for dynamic content
   - ISR for semi-dynamic content
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
   pm2 restart damned-designs-storefront
   ```

3. Verify the deployment:
   - Check the site is accessible at `https://damneddesigns.com`
   - Test critical flows (browse products, add to cart, checkout)
   - Verify all regions and currencies are working