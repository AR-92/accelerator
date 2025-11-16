/**
 * Corporate Module
 *
 * Handles corporate business management including CRUD operations,
 * search, filtering, statistics, and bulk operations.
 * This module provides both API endpoints and page routes for corporate features.
 */

const CorporateController = require('./controllers/CorporateController');
const CorporateService = require('./services/CorporateService');
const CorporateRepository = require('./repositories/CorporateRepository');
const Corporate = require('./models/Corporate');

module.exports = (container) => {
  // Register repository
  container.register(
    'corporateRepository',
    () => new CorporateRepository(container.get('db'))
  );

  // Register service
  container.register(
    'corporateService',
    () => new CorporateService(container.get('corporateRepository'))
  );

  // Register controller
  container.register(
    'corporateController',
    () => new CorporateController(container.get('corporateService'))
  );

  return {
    CorporateController: container.get('corporateController'),
    CorporateService: container.get('corporateService'),
    CorporateRepository: container.get('corporateRepository'),
    Corporate,
  };
};
