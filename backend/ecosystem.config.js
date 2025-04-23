module.exports = {
  apps: [{
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
    name: "damned-designs-storefront",
    cwd: "/root/damneddesigns/storefront",
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
  }]
};