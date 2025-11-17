/**
 * Learning Module
 *
 * Handles learning content management including articles, categories, search, and user progress tracking.
 * This module provides both API endpoints and page routes for learning features.
 */

const LearningController = require('./controllers/LearningController');
const LearningService = require('./services/LearningService');
const LearningContentRepository = require('./repositories/LearningContentRepository');
const LearningCategoryRepository = require('./repositories/LearningCategoryRepository');
const LearningContent = require('./models/LearningContent');
const LearningCategory = require('./models/LearningCategory');

module.exports = (container) => {
  // Register repositories
  container.register(
    'learningContentRepository',
    () =>
      new LearningContentRepository(
        container.get('db'),
        container.get('createLogger')('LearningContentRepository')
      )
  );
  container.register(
    'learningCategoryRepository',
    () =>
      new LearningCategoryRepository(
        container.get('db'),
        container.get('createLogger')('LearningCategoryRepository')
      )
  );

  // Register service
  container.register(
    'learningService',
    () =>
      new LearningService(
        container.get('learningContentRepository'),
        container.get('learningCategoryRepository')
      )
  );

  // Register controller
  container.register(
    'learningController',
    () => new LearningController(container.get('learningService'))
  );

  return {
    LearningController: container.get('learningController'),
    LearningService: container.get('learningService'),
    LearningContentRepository: container.get('learningContentRepository'),
    LearningCategoryRepository: container.get('learningCategoryRepository'),
    LearningContent,
    LearningCategory,
  };
};
