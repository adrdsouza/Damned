module.exports = {
  apps: [{
    name: "damned-designs-storefront",
    cwd: "/root/damneddesigns/storefront",
    script: "npm",
    args: "run dev",
    env: {
      NODE_ENV: "development",
    },
    time: true,
    autorestart: true,
    max_restarts: 10,
    watch: false,
    instances: 1,
    exec_mode: "fork"
  }]
};
