# Environment Variables Reference

This file contains all environment variables required for the Damned Designs system. Copy the relevant section to your .env files as needed. Do not commit your actual .env files to git.

## Backend (.env)
```
STORE_CORS=http://localhost:8000,https://docs.medusajs.com,https://damneddesigns.com,https://api.damneddesigns.com
ADMIN_CORS=http://localhost:5173,http://localhost:9000,https://docs.medusajs.com,https://damneddesigns.com,https://admin.damneddesigns.com
AUTH_CORS=http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com,https://damneddesigns.com,https://admin.damneddesigns.com,https://api.damneddesigns.com
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgres://myuser:adrdsouza@localhost/medusa-medusaapp
SERVER_LINK=https://api.damneddesigns.com
IMAGE_SERVER_URL=https://images.damneddesigns.com
NMI_SECURITY_KEY=h3WD8p6Hc8WM4eEAqpb6fsTJMYp45Mrp
SEZZLE_PUBLIC_KEY=sz_pub_mHYs860HGQAamnTUWOMfmOOsISn9slaT
SEZZLE_PRIVATE_KEY=sz_pr_SSKy28nqlOAd5ujZu9w8jEHCvGJ78fBR
SEZZLE_SANDBOX_MODE=false
SEZZLE_CAPTURE_MODE=automatic
SMTP_FROM=info@damneddesigns.com
SMTP_USERNAME=info@damneddesigns.com
```

## Storefront (.env)
```
MEDUSA_BACKEND_URL=https://api.damneddesigns.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_4a68e1bd85e72212ebbe8364d329891e7bdabcc921912541f37078fcfe197bfe
NEXT_PUBLIC_BASE_URL=https://damneddesigns.com
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=supersecret
NEXT_PUBLIC_NMI_TOKENIZATION_KEY=checkout_public_2he6c5yTBC73u3AV2reJeHb37TpEegUa
```

## Images Server (.env)
```
PORT=6162
DOMAIN_URL=https://images.damneddesigns.com
UPLOAD_DIR=static
ALLOWED_ORIGINS=https://admin.damneddesigns.com,https://api.damneddesigns.com
```

## Admin Panel (.env)
```
VITE_MEDUSA_BACKEND_URL="https://admin.damneddesigns.com/api"
VITE_MEDUSA_STOREFRONT_URL="https://damneddesigns.com"
```

## Image Service Integration

- `IMAGE_SERVER_URL`: Internal URL for backend-to-image-service communication (e.g., http://localhost:6162)
- `PUBLIC_IMAGE_URL`: Public base URL for accessing images (e.g., https://images.damneddesigns.com)
