module.exports = {
  apps: [{
    name: 'accelerator',
    script: './server.js',
    
    // Environment variables
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    
    // Process management
    instances: 'max', // Use maximum CPU cores
    exec_mode: 'cluster', // Use cluster mode for multiple instances
    watch: false, // Don't watch in production
    
    // Logging
    output: './logs/app.log',
    error: './logs/error.log',
    log: './logs/combined.log',
    time: true,
    
    // Restart settings
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    
    // Node.js settings
    node_args: '--max-old-space-size=1024',
    kill_timeout: 3000,
    
    // Health check
    cron_restart: '0 0 * * *', // Restart every day at midnight
  }],
  
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-production-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:yourusername/accelerator.git',
      path: '/var/www/accelerator',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};