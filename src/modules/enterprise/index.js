/**
 * Enterprise Module
 *
 * Handles enterprise business management including CRUD operations,
 * search, filtering, statistics, and bulk operations.
 */

const EnterpriseController = require('./controllers/EnterpriseController');
const EnterpriseService = require('./services/EnterpriseService');
const EnterpriseRepository = require('./repositories/EnterpriseRepository');
const Enterprise = require('./models/Enterprise');

module.exports = (container) => {
  container.register(
    'enterpriseRepository',
    () => new EnterpriseRepository(container.get('db'))
  );
  container.register(
    'enterpriseService',
    () => new EnterpriseService(container.get('enterpriseRepository'))
  );
  container.register(
    'enterpriseController',
    () => new EnterpriseController(container.get('enterpriseService'))
  );

  return {
    EnterpriseController: container.get('enterpriseController'),
    EnterpriseService: container.get('enterpriseService'),
    EnterpriseRepository: container.get('enterpriseRepository'),
    Enterprise,
  };
};
