module.exports = {
  apps: [
    {
      // Backend Medusa Server
      name: "backend",
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
      // Storefront Next.js Server (Production Mode)
      name: "storefront",
      cwd: "/root/damneddesigns/storefront",
      script: "npm",
      args: "run start",
        env:{
HOST:"0.0.0.0"

},    
      time: true,
      autorestart: true,
      max_restarts: 10,
      watch: false,
      instances: 1,
      exec_mode: "fork"
    },
    // Admin Panel is now served by Caddy directly from static files at /root/damneddesigns/admin/dist
    {
      // Images Server
      name: "images",
      cwd: "/root/damneddesigns/images",
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
