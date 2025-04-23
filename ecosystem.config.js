module.exports = {
  apps: [
    {
      // Backend Medusa Server
      name: "damned-designs-backend",
      cwd: "/root/damneddesigns/backend/.medusa/server",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    {
      // Storefront SvelteKit Server (Production Mode)
      name: "damned-designs-storefront",
      cwd: "/root/damneddesigns/storefront",
      script: "npm",
      args: "run preview",
      env: {
        NODE_ENV: "production",
        // Removed hardcoded backend URL to use the value from .env
      },
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    {
      // Admin Panel - Production Mode
      name: "damned-designs-admin",
      cwd: "/root/damneddesigns/admin",
      script: "npm",
      args: "run preview",
      env: {
        NODE_ENV: "production",
      },
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    {
      // Images Server
      name: "damned-designs-images",
      cwd: "/root/damneddesigns/images/images",
      script: "node",
      args: "index.js",
      env: {
        NODE_ENV: "production",
      },
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    }
  ]
};