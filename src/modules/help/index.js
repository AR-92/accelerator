/**
 * Help Module
 *
 * Handles help content management including articles, categories, search, and user support.
 * This module provides both API endpoints and page routes for help features.
 */

const HelpController = require('./controllers/HelpController');
const HelpService = require('./services/HelpService');
const HelpContentRepository = require('./repositories/HelpContentRepository');
const HelpCategoryRepository = require('./repositories/HelpCategoryRepository');
const HelpContent = require('./models/HelpContent');
const HelpCategory = require('./models/HelpCategory');

module.exports = (container) => {
  // Register repositories
  container.register(
    'helpContentRepository',
    () =>
      new HelpContentRepository(
        container.get('db'),
        container.get('createLogger')('HelpContentRepository')
      )
  );
  container.register(
    'helpCategoryRepository',
    () =>
      new HelpCategoryRepository(
        container.get('db'),
        container.get('createLogger')('HelpCategoryRepository')
      )
  );

  // Register service
  container.register(
    'helpService',
    () =>
      new HelpService(
        container.get('helpContentRepository'),
        container.get('helpCategoryRepository')
      )
  );

  // Register controller
  container.register(
    'helpController',
    () => new HelpController(container.get('helpService'))
  );

  return {
    HelpController: container.get('helpController'),
    HelpService: container.get('helpService'),
    HelpContentRepository: container.get('helpContentRepository'),
    HelpCategoryRepository: container.get('helpCategoryRepository'),
    HelpContent,
    HelpCategory,
  };
};
