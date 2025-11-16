/**
 * Admin Module
 *
 * Handles administrative functions including user management, system monitoring,
 * content management, business operations, and AI model management.
 * This module provides both API endpoints and page routes for admin functionality.
 */

const AdminController = require('./controllers/AdminController');
const AdminDashboardController = require('./controllers/AdminDashboardController');
const AdminSystemStatsController = require('./controllers/AdminSystemStatsController');
const AdminUserViewController = require('./controllers/AdminUserViewController');
const AdminUserActionController = require('./controllers/AdminUserActionController');
const AdminBusinessController = require('./controllers/AdminBusinessController');
const AdminOrganizationController = require('./controllers/AdminOrganizationController');
const AdminAIController = require('./controllers/AdminAIController');
const AdminCreditController = require('./controllers/AdminCreditController');
const AdminAuthController = require('./controllers/AdminAuthController');

const AdminService = require('./services/AdminService');
const SystemMonitoringService = require('./services/SystemMonitoringService');
const UserManagementService = require('./services/UserManagementService');
const ContentManagementService = require('./services/ContentManagementService');
const ProjectManagementService = require('./services/ProjectManagementService');
const BusinessManagementService = require('./services/BusinessManagementService');

const AdminActivityRepository = require('./repositories/AdminActivityRepository');

module.exports = (container) => {
  // Register repositories
  container.register(
    'adminActivityRepository',
    () => new AdminActivityRepository(container.get('db'))
  );

  // Register services
  container.register(
    'adminService',
    () =>
      new AdminService(
        container.get('systemMonitoringService'),
        container.get('userManagementService'),
        container.get('contentManagementService'),
        container.get('projectManagementService'),
        container.get('ideaService'),
        container.get('voteService'),
        container.get('landingPageService'),
        container.get('organizationService'),
        container.get('packageRepository'),
        container.get('billingRepository'),
        container.get('rewardRepository'),
        container.get('transactionRepository'),
        container.get('paymentMethodRepository'),
        container.get('aiModelRepository'),
        container.get('aiWorkflowRepository'),
        container.get('workflowStepRepository'),
        container.get('voteRepository'),
        container.get('collaborationRepository'),
        container.get('projectCollaboratorRepository'),
        container.get('db')
      )
  );
  container.register(
    'systemMonitoringService',
    () => new SystemMonitoringService()
  );
  container.register(
    'userManagementService',
    () =>
      new UserManagementService(
        container.get('userRepository'),
        container.get('adminActivityRepository')
      )
  );
  container.register(
    'contentManagementService',
    () =>
      new ContentManagementService(
        container.get('learningContentRepository'),
        container.get('helpContentRepository')
      )
  );
  container.register(
    'projectManagementService',
    () =>
      new ProjectManagementService(
        container.get('projectRepository'),
        container.get('adminActivityRepository')
      )
  );
  container.register(
    'businessManagementService',
    () =>
      new BusinessManagementService(
        container.get('corporateRepository'),
        container.get('enterpriseRepository'),
        container.get('startupRepository')
      )
  );

  // Register controllers
  container.register(
    'adminController',
    () =>
      new AdminController(
        container.get('adminDashboardController'),
        container.get('adminUserViewController'),
        container.get('adminUserActionController'),
        container.get('adminOrganizationController'),
        container.get('adminBusinessController'),
        container.get('adminAIController'),
        container.get('adminCreditController'),
        container.get('adminSystemStatsController')
      )
  );
  container.register(
    'adminDashboardController',
    () => new AdminDashboardController(container.get('adminService'))
  );
  container.register(
    'adminSystemStatsController',
    () =>
      new AdminSystemStatsController(container.get('systemMonitoringService'))
  );
  container.register(
    'adminUserViewController',
    () => new AdminUserViewController(container.get('userManagementService'))
  );
  container.register(
    'adminUserActionController',
    () => new AdminUserActionController(container.get('userManagementService'))
  );
  container.register(
    'adminBusinessController',
    () =>
      new AdminBusinessController(
        container.get('corporateService'),
        container.get('enterpriseService'),
        container.get('startupService')
      )
  );
  container.register(
    'adminOrganizationController',
    () => new AdminOrganizationController(container.get('adminService'))
  );
  container.register(
    'adminAIController',
    () =>
      new AdminAIController(
        container.get('aiModelRepository'),
        container.get('aiWorkflowRepository')
      )
  );
  container.register(
    'adminCreditController',
    () => new AdminCreditController(container.get('adminService'))
  );
  container.register(
    'adminAuthController',
    () => new AdminAuthController(container.get('userRepository'))
  );

  return {
    AdminDashboardController: container.get('adminDashboardController'),
    AdminSystemStatsController: container.get('adminSystemStatsController'),
    AdminUserViewController: container.get('adminUserViewController'),
    AdminUserActionController: container.get('adminUserActionController'),
    AdminBusinessController: container.get('adminBusinessController'),
    AdminOrganizationController: container.get('adminOrganizationController'),
    AdminAIController: container.get('adminAIController'),
    AdminCreditController: container.get('adminCreditController'),
    AdminAuthController: container.get('adminAuthController'),
    AdminService: container.get('adminService'),
    SystemMonitoringService: container.get('systemMonitoringService'),
    UserManagementService: container.get('userManagementService'),
    ContentManagementService: container.get('contentManagementService'),
    ProjectManagementService: container.get('projectManagementService'),
    BusinessManagementService: container.get('businessManagementService'),
    AdminActivityRepository: container.get('adminActivityRepository'),
  };
};
