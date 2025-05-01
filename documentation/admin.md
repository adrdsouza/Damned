# Damned Designs Admin Panel Documentation

## Overview

The Damned Designs Admin Panel is a Vite-based React application that provides the administrative interface for managing the e-commerce platform. This document details the architecture, configuration, and operational aspects of the admin system.

## Architecture & Components

### Core Components

- **Framework**: Vite with React 18
- **Programming Language**: TypeScript
- **Directory**: `/root/damneddesigns/admin`
- **UI Components**: Medusa UI, Radix UI
- **State Management**: React Query (Tanstack Query)
- **Data Grid**: Tanstack Table
- **Internationalization**: i18next

### Key Directories and Files

- **Source Code**: `/root/damneddesigns/admin/src`
- **Main Entry Point**: `/root/damneddesigns/admin/src/main.tsx`
- **Build Configuration**: `/root/damneddesigns/admin/vite.config.mts`
- **Environment Config**: `/root/damneddesigns/admin/.env`
- **Package Configuration**: `/root/damneddesigns/admin/package.json`

### Custom Routes & Components

The admin panel includes several custom routes extending the standard Medusa admin functionality:

1. **Inventory Management**:
   - Route: `/inventory`
   - Key Files: 
     - `/src/routes/inventory/inventory-list/inventory-list.tsx`
     - `/src/routes/inventory/inventory-detail/inventory-detail.tsx`

2. **Reservation System**:
   - Routes: `/reservations`, `/reservations/:id`
   - Key Files:
     - `/src/routes/reservations/reservation-list/reservation-list.tsx`
     - `/src/routes/reservations/reservation-detail/reservation-detail.tsx`
     - `/src/routes/reservations/reservation-create/reservation-create.tsx`

3. **Tax Region Management**:
   - Routes: `/tax-regions`, `/tax-regions/:id`
   - Key Files:
     - `/src/routes/tax-regions/tax-region-list/tax-region-list.tsx`
     - `/src/routes/tax-regions/tax-region-detail/tax-region-detail.tsx`
     - Multiple other tax-related components

4. **Return Reason Management**:
   - Routes: `/return-reasons`, `/return-reasons/:id`
   - Key Files:
     - `/src/routes/return-reasons/return-reason-list/return-reason-list.tsx`
     - `/src/routes/return-reasons/return-reason-edit/return-reason-edit.tsx`

5. **User Profile Management**:
   - Route: `/profile`
   - Key File: `/src/routes/profile/profile-detail/profile-detail.tsx`

## Configuration Details

### Environment Variables

The admin panel configuration relies on environment variables defined in `/root/damneddesigns/admin/.env`:

```
# Direct connection to the API endpoint
VITE_MEDUSA_BACKEND_URL="https://api.damneddesigns.com"
VITE_MEDUSA_STOREFRONT_URL="https://damneddesigns.com"
```

### Development vs. Production Configuration

- **Development**: Uses local backend URL (`http://localhost:9000`)
- **Production**: Uses direct API domain (`https://api.damneddesigns.com`)

### Build Configuration

The Vite build is configured in `vite.config.mts` with these important settings:

```javascript
preview: {
  host: "0.0.0.0",
  port: 5173,
  allowedHosts: ["admin.damneddesigns.com"]
}
```

This configuration:
- Makes the admin panel accessible on all network interfaces (0.0.0.0)
- Uses port 5173 for the production preview server
- Restricts allowed hosts to `admin.damneddesigns.com`

## Development Workflow

### Local Development

For local development:

1. Start the admin panel in development mode:
   ```bash
   cd /root/damneddesigns/admin
   npm run dev
   ```

2. This launches Vite's development server with:
   - Hot Module Replacement (HMR)
   - Backend proxy for API requests
   - Browser auto-opening

### Building for Production

The production build process involves these steps:

1. Build the production assets:
   ```bash
   cd /root/damneddesigns/admin
   npm run build:preview
   ```
   
2. The build generates optimized assets in the `dist` directory
3. The static files are served directly by Caddy from the `dist` directory
4. No PM2 process is needed as Caddy handles serving the static files efficiently

## API Communication

### Backend API Integration

The admin panel communicates with the Medusa backend using:

1. **API Base URL**: `https://api.damneddesigns.com`
2. **Authentication**: Admin JWT tokens with cross-domain cookies
3. **Request Pattern**: Uses Medusa Admin API client for standardized requests
4. **API Routes**: Accesses `/admin/*` routes with elevated permissions

### Authentication Flow

1. Admin user logs in via the login screen
2. Credentials are validated against the Medusa backend
3. On successful authentication:
   - JWT token is stored in cookies with domain `damneddesigns.com`
   - User is redirected to the dashboard
4. Token refresh occurs automatically when needed
5. Cross-domain cookies with `sameSite: "none"` allow authentication across subdomains

## Feature Overview

### Core Admin Features

1. **Dashboard & Analytics**:
   - Order volume tracking
   - Revenue analytics
   - Inventory status
   
2. **Product Management**:
   - Product creation, editing, deletion
   - Variant management
   - Inventory tracking
   - Product images and media
   
3. **Order Management**:
   - Order listing with filtering and search
   - Order details view
   - Order fulfillment
   - Return processing
   
4. **Customer Management**:
   - Customer listing and details
   - Order history per customer
   - Customer group management
   
5. **Discount & Promotion Management**:
   - Discount creation and management
   - Promotion rules configuration
   - Discount code generation
   
6. **Settings & Configuration**:
   - Store settings
   - User management
   - Payment provider configuration
   - Shipping option management

### Custom Extensions

1. **Reservation System**:
   - Create reservations for products
   - Track reservation status
   - Convert reservations to orders
   
2. **Tax Region Management**:
   - Configure tax regions and rates
   - Set up tax overrides for specific products/regions
   - Province-level tax configuration

## Monitoring & Troubleshooting

### Logs & Monitoring

- **Application Logs**: View Caddy logs with `journalctl -u caddy` for admin panel serving issues
- **Runtime Monitoring**: Use `pm2 monit` for real-time stats
- **Console Debugging**: React Developer Tools for component inspection

### Common Issues & Solutions

#### Admin Panel 404 Not Found

If you encounter 404 Not Found errors or static assets not loading:

1. Verify the Caddy configuration is correct: `cat /etc/caddy/Caddyfile`
2. Check that the static files exist in the dist directory: `ls -la /root/damneddesigns/admin/dist`
3. Check for an `index.html` file in the dist directory: `ls -la /root/damneddesigns/admin/dist/index.html`
4. If the index.html file is missing, rebuild the admin panel with:
   ```bash
   cd /root/damneddesigns/admin
   npm run build:preview
   ```
5. Restart Caddy: `systemctl restart caddy`

#### Authentication Problems

If login fails or authentication errors occur:

1. Clear browser cookies and local storage
2. Check backend logs for authentication errors: `pm2 logs damned-designs-backend`
3. Verify the admin panel's `.env` has `VITE_MEDUSA_BACKEND_URL="https://api.damneddesigns.com"`
4. Check that backend's `.env` has proper AUTH_CORS setting that includes both admin.damneddesigns.com and api.damneddesigns.com
5. Ensure the backend has COOKIE_DOMAIN=damneddesigns.com defined
6. Check Caddy configuration for proper handling of /auth/* routes
7. Check browser network tab for specific error responses
8. Rebuild admin panel and restart backend:
   ```bash
   cd /root/damneddesigns/admin
   npm run build:preview
   pm2 restart damned-designs-backend
   systemctl reload caddy
   ```

#### Admin to Backend API Issues

If the admin panel cannot communicate with the backend:

1. Verify the admin `.env` file has `VITE_MEDUSA_BACKEND_URL="https://api.damneddesigns.com"`
2. Ensure the backend CORS settings include admin.damneddesigns.com and api.damneddesigns.com
3. Test the API directly: `curl https://api.damneddesigns.com/health`
4. Check the client configuration in `src/lib/client/client.ts` has credentials included:
   ```javascript
   export const sdk = new Medusa({
     baseUrl: backendUrl,
     auth: {
       type: "session",
       credentials: "include",
     },
     publicConfig: {
       credentials: "include",
     },
   })
   ```
5. Check for errors in the browser console and network tab

## Security Considerations

The admin panel implements several security measures:

1. **Authentication**: JWT-based auth with proper token management
2. **Authorization**: Role-based access control (RBAC)
3. **API Isolation**: Admin API routes are separate from public store routes
4. **CORS Protection**: Strict CORS settings prevent unauthorized access
5. **Subdomain Isolation**: Running on `admin.damneddesigns.com` for separation
6. **Secure Cookies**: Cookies set with secure flag and proper domain
7. **Cross-Domain Authentication**: Configured with SameSite=None and secure flag

## Performance Optimization

The admin panel is optimized for production with:

1. **Code Splitting**: Lazy loading of routes and components
2. **Asset Optimization**: Minification and compression of JS/CSS
3. **Caching Strategy**: Effective React Query caching
4. **Server-Side Pagination**: For large datasets in tables

## Customization & Extension

To add new custom features to the admin panel:

1. Create a new route in the appropriate directory
2. Register the route in the router configuration
3. Implement the required components using Medusa UI components
4. Connect to the backend API using the admin API client
5. Add any necessary translations in i18n files

## Deployment Checklist

When deploying updated versions of the admin panel:

1. Update dependencies: `npm update`
2. Verify environment variables are correctly set
3. Build the production assets: `npm run build:preview`
4. Ensure the right backend URL is configured
5. Verify the admin panel is accessible at `https://admin.damneddesigns.com`
6. Test login and key functionality
7. Verify that API requests are working properly
8. Check for console errors during operation