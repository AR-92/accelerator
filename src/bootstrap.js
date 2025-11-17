/**
 * Application Bootstrap
 * Handles startup, database initialization, and server start
 */

const container = require('./container');
const createApp = require('./app');

/**
 * Bootstrap the application
 */
const bootstrap = async () => {
  const configService = container.get('configService');
  const pathService = container.get('pathService');
  const createLogger = container.get('createLogger');
  const logger = createLogger('Bootstrap');

  // Clear the server log file at startup
  const fs = require('fs');
  const path = require('path');
  const logFilePath = path.join(pathService.logs, 'server.log');
  try {
    fs.writeFileSync(logFilePath, '');
  } catch (error) {
    logger.error('Failed to clear log file', error);
  }

  if (!configService.skipDbMigration) {
    // Initialize database
    try {
      const { testConnection, runMigrations } =
        container.get('databaseInterface');

      logger.info('Initializing database...');

      // Run migrations first
      await runMigrations();

      // Then test the connection
      const isConnected = await testConnection();
      if (isConnected) {
        logger.info('PostgreSQL connection established successfully');
      } else {
        logger.warn('Warning: PostgreSQL connection failed');
        process.exit(1);
      }
    } catch (error) {
      logger.error('Database initialization error:', error);
      process.exit(1);
    }
  } else {
    logger.info('Skipping database migration (development mode)');
  }

  // Create the Express app
  const app = createApp(container);

  // Mount routes from modules
  const authRoutes = require('./modules/auth/routes/pages')(
    container.get('authController')
  );
  const pageRoutes = container.get('pagesModule');
  const aiAssistantModelsRoutes = container.get('aiAssistantModelsModule');
  const adminRoutes = require('./modules/admin/routes/api/v1/admin');
  const adminPageRoutes = require('./modules/admin/routes/pages/admin');
  const startupApiRoutes = require('./modules/startup/routes/api');
  const learningApiRoutes = require('./modules/learning/routes/api');
  const learningPageRoutes = require('./modules/learning/routes/pages');
  const helpApiRoutes = require('./modules/help/routes/api');
  const helpPageRoutes = require('./modules/help/routes/pages');
  const collaborationApiRoutes = require('./modules/collaboration/routes/api');
  const collaborationPageRoutes = require('./modules/collaboration/routes/pages');
  const healthRoutes = container.get('healthModule');

  app.use('/auth', authRoutes);
  app.use('/pages', pageRoutes);
  app.use('/pages', aiAssistantModelsRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/startups', startupApiRoutes);
  app.use('/api/learning', learningApiRoutes);
  app.use('/learn', learningPageRoutes);
  app.use('/api/help', helpApiRoutes);
  app.use('/help', helpPageRoutes);
  app.use('/api/collaborate', collaborationApiRoutes);
  app.use('/pages/collaborate', collaborationPageRoutes);
  logger.info('Mounting admin routes at /admin');
  app.use('/admin', adminPageRoutes);
  app.use('/health', healthRoutes);

  // 404 handler
  const { notFoundHandler } = require('./shared/middleware/error/errorHandler');
  app.use('*', notFoundHandler);

  // Start the server
  const server = app.listen(configService.port, '0.0.0.0', () => {
    logger.info(`Server running at http://localhost:${configService.port}`);
    logger.info(`Environment: ${configService.nodeEnv}`);
    logger.info(`Node version: ${process.version}`);
    logger.info('Server is ready to accept requests');
  });

  server.on('error', (error) => {
    const errorLogger = createLogger('Server');
    errorLogger.error('Server error', error);
  });

  // Graceful shutdown
  // process.on('SIGTERM', () => {
  //   logger.info('SIGTERM received, shutting down gracefully');
  //   process.exit(0);
  // });

  // process.on('SIGINT', () => {
  //   logger.info('SIGINT received, shutting down gracefully');
  //   process.exit(0);
  // });
};

module.exports = bootstrap;
