/**
 * Health Module
 * Provides health check endpoints
 */

const express = require('express');
const path = require('path');

const createHealthModule = (container) => {
  const router = express.Router();
  const configService = container.get('configService');
  const createLogger = container.get('createLogger');
  const logger = createLogger('HealthCheck');

  // Health check endpoint - lightweight version for fast startup
  router.get('/', (req, res) => {
    // Return basic health status immediately without database checks
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: configService.nodeEnv,
      version: require(path.join(__dirname, '../../../package.json')).version,
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
        environment: configService.nodeEnv,
        version: require(path.join(__dirname, '../../../package.json')).version,
      };

      // Check database connection
      const { testConnection } = container.get('databaseInterface');
      const dbConnected = await testConnection();
      healthCheck.database = dbConnected ? 'Connected' : 'Disconnected';

      res.status(200).json(healthCheck);
    } catch (error) {
      logger.error('Detailed health check error:', error);
      res.status(500).json({
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        message: error.message,
      });
    }
  });

  return router;
};

module.exports = createHealthModule;
