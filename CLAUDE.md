# Damned Designs System Reference for Claude

This document contains critical information about the system that Claude should refer to when helping with the Damned Designs e-commerce platform.

## System Architecture

- Backend: Medusa.js running on Node.js 20+
- Storefront: Next.js 15 at port 8000
- Admin Panel: Vite/React running at port 5173
- Images Server: Custom service at port 6162
- Database: PostgreSQL
- Process Management: PM2

## Important Services

| Service | PM2 Name | Port | URL | Notes |
|---------|----------|------|-----|-------|
| Backend | damned-designs-backend | 9000 | https://api.damneddesigns.com | Core e-commerce engine |
| Storefront | damned-designs-storefront | 8000 | https://damneddesigns.com | Customer-facing store |
| Admin | damned-designs-admin | 5173 | https://admin.damneddesigns.com | Admin dashboard |
| Images Server | damned-designs-images | 6162 | https://images.damneddesigns.com | Image hosting |

## Important URLs

- **Main Store**: https://damneddesigns.com
- **Admin Dashboard**: https://admin.damneddesigns.com 
  - Running on port 5173
  - Direct access via: http://172.245.105.195:5173/
  - No Nginx is used - direct access required!
- **API**: https://api.damneddesigns.com
- **Images**: https://images.damneddesigns.com

## Common Commands

```bash
# View all services
pm2 list

# Check logs for specific service
pm2 logs damned-designs-admin

# Restart specific service
pm2 restart damned-designs-admin

# Restart all services
pm2 restart all

# Always save config after changes
pm2 save
```

## ⚠️ Critical Notes

1. **NO NGINX CONFIGURATION**: This system does not use Nginx. URLs like admin.damneddesigns.com must be accessed directly through their respective ports.

2. **AVOID DUPLICATE SERVICES**: The PM2 ecosystem.config.js defines each service, but they can sometimes be started twice. Always check for and remove duplicates:
   ```bash
   # If you see duplicates in pm2 list:
   pm2 delete <id_of_duplicate>
   pm2 save
   ```

3. **DIRECT PORT ACCESS**: To access the admin panel directly use: http://172.245.105.195:5173/

4. **CHECK PROPER PORT BINDING**: Always ensure services are bound to the correct ports:
   ```bash
   netstat -tulpn | grep 5173  # Check admin panel port
   ```

## PM2 Configuration Reference

Located at `/root/damneddesigns/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "damned-designs-backend",
      cwd: "/root/damneddesigns/backend/.medusa/server",
      script: "npm",
      args: "run start",
    },
    {
      name: "damned-designs-storefront",
      cwd: "/root/damneddesigns/storefront",
      script: "npm",
      args: "run start",
    },
    {
      name: "damned-designs-admin",
      cwd: "/root/damneddesigns/admin",
      script: "npm",
      args: "run preview",
    },
    {
      name: "damned-designs-images",
      cwd: "/root/damneddesigns/images/images",
      script: "node",
      args: "index.js",
    }
  ]
};
```

## Troubleshooting

If admin.damneddesigns.com returns a 404:
1. Check PM2 to ensure the admin service is running: `pm2 list`
2. Verify the admin service is accessible directly via: http://172.245.105.195:5173/
3. Remember, there is NO Nginx - direct port access is required!