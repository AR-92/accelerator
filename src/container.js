/**
 * Application container setup
 * Registers all services, repositories, and controllers using modular approach
 */

const Container = require('./utils/container');
const ConfigService = require('./utils/configService');
const PathService = require('./utils/pathService');
const { createLogger, Logger } = require('./utils/logger');
const { createDatabaseInterface } = require('../config/database');

// Create container instance
const container = new Container();

// Register configuration service
container.register('configService', () => new ConfigService());

// Register path service
container.register('pathService', () => new PathService());

// Register logger
container.register('logger', (c) => createLogger(c.get('configService')));

// Register logger factory for creating context loggers
container.register(
  'createLogger',
  (c) => (context) => new Logger(c.get('logger'), context)
);

// Register database connection
const databaseInterface = createDatabaseInterface(
  container.get('configService'),
  container.get('createLogger')
);
container.register('databaseInterface', () => databaseInterface);
container.register('db', () => databaseInterface.db);

// Load modules
const authModule = require('./modules/auth')(container);
const learningModule = require('./modules/learning')(container);
const helpModule = require('./modules/help')(container);
const collaborationModule = require('./modules/collaboration')(container);
const ideasModule = require('./modules/ideas')(container);
const corporateModule = require('./modules/corporate')(container);
const enterpriseModule = require('./modules/enterprise')(container);
const startupModule = require('./modules/startup')(container);
const adminModule = require('./modules/admin')(container);

// Register modular routes
container.register('pagesModule', () => require('./modules/pages')(container));
container.register('healthModule', () =>
  require('./modules/health')(container)
);
container.register('aiAssistantModelsModule', () =>
  require('./modules/ai-assistant-models')(container)
);

module.exports = container;
