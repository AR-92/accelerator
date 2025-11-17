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

const AdminActivityRepository = require('./repositories/AdminActivityRepository');
const AdminService = require('./services/AdminService');
const SystemMonitoringService = require('./services/SystemMonitoringService');
const UserManagementService = require('./services/UserManagementService');
const ContentManagementService = require('./services/ContentManagementService');
const ProjectManagementService = require('./services/ProjectManagementService');
const BusinessManagementService = require('./services/BusinessManagementService');

// Import additional repositories used by admin
const OrganizationRepository = require('./repositories/OrganizationRepository');
const LandingPageRepository = require('./repositories/LandingPageRepository');
const PackageRepository = require('./repositories/PackageRepository');
const BillingRepository = require('./repositories/BillingRepository');
const RewardRepository = require('./repositories/RewardRepository');
const TransactionRepository = require('./repositories/TransactionRepository');
const PaymentMethodRepository = require('./repositories/PaymentMethodRepository');
const AIModelRepository = require('./repositories/AIModelRepository');
const AIWorkflowRepository = require('./repositories/AIWorkflowRepository');
const WorkflowStepRepository = require('./repositories/WorkflowStepRepository');

// Import additional services
const OrganizationService = require('./services/OrganizationService');
const LandingPageService = require('./services/LandingPageService');

module.exports = (container) => {
  // Register repositories
  container.register(
    'adminActivityRepository',
    () => new AdminActivityRepository(container.get('db'))
  );

  // Register additional repositories
  container.register(
    'organizationRepository',
    () =>
      new OrganizationRepository(
        container.get('db'),
        container.get('createLogger')('OrganizationRepository')
      )
  );
  container.register(
    'landingPageRepository',
    () =>
      new LandingPageRepository(
        container.get('db'),
        container.get('createLogger')('LandingPageRepository')
      )
  );
  container.register(
    'packageRepository',
    () =>
      new PackageRepository(
        container.get('db'),
        container.get('createLogger')('PackageRepository')
      )
  );
  container.register(
    'billingRepository',
    () =>
      new BillingRepository(
        container.get('db'),
        container.get('createLogger')('BillingRepository')
      )
  );
  container.register(
    'rewardRepository',
    () =>
      new RewardRepository(
        container.get('db'),
        container.get('createLogger')('RewardRepository')
      )
  );
  container.register(
    'transactionRepository',
    () =>
      new TransactionRepository(
        container.get('db'),
        container.get('createLogger')('TransactionRepository')
      )
  );
  container.register(
    'paymentMethodRepository',
    () =>
      new PaymentMethodRepository(
        container.get('db'),
        container.get('createLogger')('PaymentMethodRepository')
      )
  );
  container.register(
    'aiModelRepository',
    () =>
      new AIModelRepository(
        container.get('db'),
        container.get('createLogger')('AIModelRepository')
      )
  );
  container.register(
    'aiWorkflowRepository',
    () =>
      new AIWorkflowRepository(
        container.get('db'),
        container.get('createLogger')('AIWorkflowRepository')
      )
  );
  container.register(
    'workflowStepRepository',
    () =>
      new WorkflowStepRepository(
        container.get('db'),
        container.get('createLogger')('WorkflowStepRepository')
      )
  );

  // Register additional services
  container.register(
    'organizationService',
    () => new OrganizationService(container.get('organizationRepository'))
  );
  container.register(
    'landingPageService',
    () => new LandingPageService(container.get('landingPageRepository'))
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
    () =>
      new SystemMonitoringService(
        container.get('userRepository'),
        container.get('helpService'),
        container.get('learningService'),
        container.get('adminActivityRepository'),
        container.get('startupService'),
        container.get('enterpriseService'),
        container.get('corporateService'),
        container.get('packageRepository'),
        container.get('billingRepository'),
        container.get('rewardRepository'),
        container.get('projectRepository'),
        container.get('taskRepository'),
        container.get('messageRepository'),
        container.get('ideaRepository'),
        container.get('voteRepository'),
        container.get('organizationRepository'),
        container.get('landingPageRepository'),
        container.get('transactionRepository'),
        container.get('paymentMethodRepository'),
        container.get('aiModelRepository'),
        container.get('aiWorkflowRepository'),
        container.get('workflowStepRepository')
      )
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
        container.get('helpService'),
        container.get('learningService')
      )
  );
  container.register(
    'projectManagementService',
    () =>
      new ProjectManagementService(
        container.get('projectRepository'),
        container.get('teamRepository'),
        container.get('adminActivityRepository')
      )
  );
  container.register(
    'businessManagementService',
    () =>
      new BusinessManagementService(
        container.get('startupService'),
        container.get('enterpriseService'),
        container.get('corporateService'),
        container.get('adminActivityRepository')
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
    () =>
      new AdminDashboardController(
        container.get('adminService'),
        container.get('createLogger')('AdminDashboard')
      )
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
    () => new AdminAIController(container.get('adminService'))
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
