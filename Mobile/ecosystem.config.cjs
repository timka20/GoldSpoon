module.exports = {
  apps: [
    {
      name: 'gold-spoon',
      script: './node_modules/serve/build/main.js',
      args: 'dist -s -l 3000',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
