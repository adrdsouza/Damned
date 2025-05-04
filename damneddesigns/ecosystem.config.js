module.exports = {
  apps: [
    {
      // Backend Medusa Server in production mode with admin disabled
      name: "backend",
      cwd: "/root/damneddesigns/backend",
      script: "npx",
      args: "medusa start --port 9000",
      env: {
        NODE_ENV: "production"
      },
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    {
      // Storefront Next.js Server (Production Mode)
      name: "storefront",
      cwd: "/root/damneddesigns/storefront",
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
      // Images Server
      name: "images",
      cwd: "/root/damneddesigns/images",
      script: "index.js",
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