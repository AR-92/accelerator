import 'dotenv/config';
import app from './src/app.js';
import config from './src/config/index.js';
import logger from './src/utils/logger.js';
import homeRoutes from './src/controllers/home.js';
import todosRoutes from './src/controllers/todos.js';

// Register routes
homeRoutes(app);
todosRoutes(app);

// Start server
const server = app.listen(config.port, () => {
  logger.info(`Server running at http://localhost:${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
  // Force exit after 5 seconds
  setTimeout(() => {
    logger.info('Force terminating');
    process.exit(0);
  }, 5000);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
  // Force exit after 5 seconds
  setTimeout(() => {
    logger.info('Force terminating');
    process.exit(0);
  }, 5000);
});

export default server;