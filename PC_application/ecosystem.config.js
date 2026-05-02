module.exports = {
  apps: [
    {
      name: 'API',
      cwd: '/root/server/api',
      script: 'index.js',
      watch: true,
      ignore_watch: ['node_modules', 'logs', '*.log'],
      env: {
        NODE_ENV: 'development'
      },
      autorestart: true
    },
    {
      name: 'AdminPanel',
      cwd: '/root/admin',
      script: 'npm',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development'
      },
      autorestart: true
    }
  ]
};
