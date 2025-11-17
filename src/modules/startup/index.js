/**
 * Startup Module
 *
 * Handles startup management including CRUD operations, search, filtering, and user-specific startup data.
 * This module provides both API endpoints and page routes for startup features.
 */

const StartupController = require('./controllers/StartupController');
const StartupService = require('./services/StartupService');
const StartupRepository = require('./repositories/StartupRepository');
const Startup = require('./models/Startup');

module.exports = (container) => {
  // Register repository
  container.register(
    'startupRepository',
    () =>
      new StartupRepository(
        container.get('db'),
        container.get('createLogger')('StartupRepository')
      )
  );

  // Register service
  container.register(
    'startupService',
    () => new StartupService(container.get('startupRepository'))
  );

  // Register controller
  container.register(
    'startupController',
    () => new StartupController(container.get('startupService'))
  );

  return {
    StartupController: container.get('startupController'),
    StartupService: container.get('startupService'),
    StartupRepository: container.get('startupRepository'),
    Startup,
  };
};
