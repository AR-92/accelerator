const express = require('express');
const router = express.Router();

// Health check endpoint - lightweight version for fast startup
router.get('/', (req, res) => {
  // Return basic health status immediately without database checks
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: require('../../../package.json').version,
    database: 'Initializing...', // Will be updated once DB is ready
  };

  res.status(200).json(healthCheck);
});

// Detailed health check endpoint
router.get('/detailed', async (req, res) => {
  try {
    // Check basic server status
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: require('../../../package.json').version,
    };

    // Check database connection
    const { testConnection } = require('../../../config/database');
    const dbConnected = await testConnection();
    healthCheck.database = dbConnected ? 'Connected' : 'Disconnected';

    res.status(200).json(healthCheck);
  } catch (error) {
    const { Logger } = require('../../utils/logger');
    const healthLogger = new Logger('HealthCheck');
    healthLogger.error('Detailed health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      message: error.message,
    });
  }
});

module.exports = router;
