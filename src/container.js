/**
 * Application container setup
 * Registers all services, repositories, and controllers
 */

const Container = require('./utils/container');
const { db } = require('../config/database');

// Import repositories
const UserRepository = require('./main/repositories/UserRepository');
const AdminActivityRepository = require('./admin/repositories/AdminActivityRepository');
const IdeaRepository = require('./main/repositories/IdeaRepository');
const PortfolioRepository = require('./main/repositories/PortfolioRepository');
const VoteRepository = require('./main/repositories/VoteRepository');
const StartupRepository = require('./main/repositories/StartupRepository');
const EnterpriseRepository = require('./main/repositories/EnterpriseRepository');
const CorporateRepository = require('./main/repositories/CorporateRepository');
const OrganizationRepository = require('./main/repositories/OrganizationRepository');
const ProjectRepository = require('./main/repositories/ProjectRepository');
const CollaborationRepository = require('./main/repositories/CollaborationRepository');
const ProjectCollaboratorRepository = require('./main/repositories/ProjectCollaboratorRepository');
const TaskRepository = require('./main/repositories/TaskRepository');
const MessageRepository = require('./main/repositories/MessageRepository');
const TeamRepository = require('./main/repositories/TeamRepository');
const LandingPageRepository = require('./main/repositories/LandingPageRepository');
const PackageRepository = require('./main/repositories/PackageRepository');
const BillingRepository = require('./main/repositories/BillingRepository');
const RewardRepository = require('./main/repositories/RewardRepository');
const TransactionRepository = require('./main/repositories/TransactionRepository');
const PaymentMethodRepository = require('./main/repositories/PaymentMethodRepository');
const LearningContentRepository = require('./main/repositories/learning/LearningContentRepository');
const LearningCategoryRepository = require('./main/repositories/learning/LearningCategoryRepository');
const HelpContentRepository = require('./main/repositories/help/HelpContentRepository');
const HelpCategoryRepository = require('./main/repositories/help/HelpCategoryRepository');
const AIModelRepository = require('./main/repositories/AIModelRepository');
const AIWorkflowRepository = require('./main/repositories/AIWorkflowRepository');
const WorkflowStepRepository = require('./main/repositories/WorkflowStepRepository');

// Import services
const AuthService = require('./auth/services/AuthService');
const IdeaService = require('./main/services/IdeaService');
const VoteService = require('./main/services/VoteService');
const StartupService = require('./main/services/StartupService');
const EnterpriseService = require('./main/services/EnterpriseService');
const CorporateService = require('./main/services/CorporateService');
const OrganizationService = require('./main/services/OrganizationService');
const LandingPageService = require('./main/services/LandingPageService');
const LearningService = require('./main/services/LearningService');
const HelpService = require('./main/services/HelpService');

// Import admin sub-services
const SystemMonitoringService = require('./admin/services/SystemMonitoringService');
const UserManagementService = require('./admin/services/UserManagementService');
const ContentManagementService = require('./admin/services/ContentManagementService');
const ProjectManagementService = require('./admin/services/ProjectManagementService');
const AdminService = require('./admin/services/AdminService');

// Import controllers
const AuthController = require('./auth/controllers/AuthController');
const IdeaController = require('./ideas/controllers/IdeaController');
const VoteController = require('./ideas/controllers/VoteController');
const StartupControllerPart1 = require('./main/controllers/StartupControllerPart1');
const StartupControllerPart2 = require('./main/controllers/StartupControllerPart2');
const EnterpriseControllerPart1 = require('./main/controllers/EnterpriseControllerPart1');
const EnterpriseControllerPart2 = require('./main/controllers/EnterpriseControllerPart2');
const CorporateControllerPart1 = require('./main/controllers/CorporateControllerPart1');
const CorporateControllerPart2 = require('./main/controllers/CorporateControllerPart2');
const LearningController = require('./learning/controllers/LearningController');
const HelpControllerPart1 = require('./main/controllers/HelpControllerPart1');
const HelpControllerPart2 = require('./main/controllers/HelpControllerPart2');
const HelpControllerPart3 = require('./main/controllers/HelpControllerPart3');
const AdminDashboardController = require('./admin/controllers/AdminDashboardController');
const AdminSystemStatsController = require('./admin/controllers/AdminSystemStatsController');
const AdminUserViewController = require('./admin/controllers/AdminUserViewController');
const AdminUserActionController = require('./admin/controllers/AdminUserActionController');
const AdminBusinessController = require('./admin/controllers/AdminBusinessController');
const AdminOrganizationController = require('./admin/controllers/AdminOrganizationController');
const AdminAIController = require('./admin/controllers/AdminAIController');
const AdminCreditController = require('./admin/controllers/AdminCreditController');
const AdminAuthController = require('./admin/controllers/AdminAuthController');

// Create container instance
const container = new Container();

// Register database connection
container.register('db', () => db);

// Register repositories
container.register('userRepository', (c) => new UserRepository(c.get('db')));
container.register(
  'adminActivityRepository',
  (c) => new AdminActivityRepository(c.get('db'))
);
container.register('ideaRepository', (c) => new IdeaRepository(c.get('db')));
container.register(
  'portfolioRepository',
  (c) => new PortfolioRepository(c.get('db'))
);
container.register('voteRepository', (c) => new VoteRepository(c.get('db')));
container.register(
  'startupRepository',
  (c) => new StartupRepository(c.get('db'))
);
container.register(
  'enterpriseRepository',
  (c) => new EnterpriseRepository(c.get('db'))
);
container.register(
  'corporateRepository',
  (c) => new CorporateRepository(c.get('db'))
);
container.register('ideaRepository', (c) => new IdeaRepository(c.get('db')));
container.register(
  'organizationRepository',
  (c) => new OrganizationRepository(c.get('db'))
);
container.register(
  'learningContentRepository',
  (c) => new LearningContentRepository(c.get('db'))
);
container.register(
  'learningCategoryRepository',
  (c) => new LearningCategoryRepository(c.get('db'))
);
container.register(
  'helpContentRepository',
  (c) => new HelpContentRepository(c.get('db'))
);
container.register(
  'helpCategoryRepository',
  (c) => new HelpCategoryRepository(c.get('db'))
);
container.register(
  'aiModelRepository',
  (c) => new AIModelRepository(c.get('db'))
);
container.register(
  'aiWorkflowRepository',
  (c) => new AIWorkflowRepository(c.get('db'))
);
container.register(
  'workflowStepRepository',
  (c) => new WorkflowStepRepository(c.get('db'))
);
container.register(
  'projectRepository',
  (c) => new ProjectRepository(c.get('db'))
);
container.register(
  'collaborationRepository',
  (c) => new CollaborationRepository(c.get('db'))
);
container.register(
  'projectCollaboratorRepository',
  (c) => new ProjectCollaboratorRepository(c.get('db'))
);
container.register('teamRepository', (c) => new TeamRepository(c.get('db')));
container.register(
  'landingPageRepository',
  (c) => new LandingPageRepository(c.get('db'))
);
container.register('taskRepository', (c) => new TaskRepository(c.get('db')));
container.register(
  'messageRepository',
  (c) => new MessageRepository(c.get('db'))
);
container.register(
  'packageRepository',
  (c) => new PackageRepository(c.get('db'))
);
container.register(
  'billingRepository',
  (c) => new BillingRepository(c.get('db'))
);
container.register(
  'rewardRepository',
  (c) => new RewardRepository(c.get('db'))
);
container.register(
  'transactionRepository',
  (c) => new TransactionRepository(c.get('db'))
);
container.register(
  'paymentMethodRepository',
  (c) => new PaymentMethodRepository(c.get('db'))
);
container.register('voteRepository', (c) => new VoteRepository(c.get('db')));

// Register services
container.register(
  'authService',
  (c) => new AuthService(c.get('userRepository'))
);
container.register(
  'ideaService',
  (c) => new IdeaService(c.get('ideaRepository'), c.get('voteRepository'))
);
container.register(
  'voteService',
  (c) => new VoteService(c.get('voteRepository'), c.get('projectRepository'))
);
container.register(
  'startupService',
  (c) => new StartupService(c.get('startupRepository'))
);
container.register(
  'enterpriseService',
  (c) => new EnterpriseService(c.get('enterpriseRepository'))
);
container.register(
  'corporateService',
  (c) => new CorporateService(c.get('corporateRepository'))
);
container.register(
  'organizationService',
  (c) => new OrganizationService(c.get('organizationRepository'))
);
container.register(
  'landingPageService',
  (c) => new LandingPageService(c.get('landingPageRepository'))
);
container.register(
  'learningService',
  (c) =>
    new LearningService(
      c.get('learningContentRepository'),
      c.get('learningCategoryRepository')
    )
);
container.register(
  'helpService',
  (c) =>
    new HelpService(
      c.get('helpContentRepository'),
      c.get('helpCategoryRepository')
    )
);
container.register(
  'systemMonitoringService',
  (c) =>
    new SystemMonitoringService(
      c.get('userRepository'),
      c.get('helpService'),
      c.get('learningService'),
      c.get('adminActivityRepository'),
      c.get('startupService'),
      c.get('enterpriseService'),
      c.get('corporateService'),
      c.get('packageRepository'),
      c.get('billingRepository'),
      c.get('rewardRepository'),
      c.get('projectRepository'),
      c.get('taskRepository'),
      c.get('messageRepository'),
      c.get('ideaRepository'),
      c.get('voteRepository'),
      c.get('organizationRepository'),
      c.get('landingPageRepository'),
      c.get('projectCollaboratorRepository')
    )
);
container.register(
  'userManagementService',
  (c) =>
    new UserManagementService(
      c.get('userRepository'),
      c.get('adminActivityRepository')
    )
);
container.register(
  'contentManagementService',
  (c) =>
    new ContentManagementService(c.get('helpService'), c.get('learningService'))
);

container.register(
  'projectManagementService',
  (c) =>
    new ProjectManagementService(
      c.get('projectRepository'),
      c.get('projectCollaboratorRepository'),
      c.get('adminActivityRepository')
    )
);
container.register(
  'adminService',
  (c) =>
    new AdminService(
      c.get('systemMonitoringService'),
      c.get('userManagementService'),
      c.get('contentManagementService'),
      c.get('projectManagementService'),
      c.get('ideaService'),
      c.get('voteService'),
      c.get('landingPageService'),
      c.get('organizationService'),
      c.get('packageRepository'),
      c.get('billingRepository'),
      c.get('rewardRepository'),
      c.get('transactionRepository'),
      c.get('paymentMethodRepository'),
      c.get('aiModelRepository'),
      c.get('aiWorkflowRepository'),
      c.get('workflowStepRepository'),
      c.get('voteRepository'),
      c.get('collaborationRepository'),
      c.get('projectCollaboratorRepository'),
      c.get('db')
    )
);

// Register controllers
container.register(
  'authController',
  (c) => new AuthController(c.get('authService'))
);
container.register(
  'ideaController',
  (c) => new IdeaController(c.get('ideaService'))
);
container.register(
  'voteController',
  (c) => new VoteController(c.get('voteService'))
);
container.register('startupController', (c) => {
  const startupService = c.get('startupService');
  const part1 = new StartupControllerPart1(startupService);
  const part2 = new StartupControllerPart2(startupService);
  return {
    getAllStartups: part1.getAllStartups.bind(part1),
    searchStartups: part2.searchStartups.bind(part2),
    getStartupsFiltered: part2.getStartupsFiltered.bind(part2),
    getStartupById: part1.getStartupById.bind(part1),
    createStartup: part1.createStartup.bind(part1),
    updateStartup: part1.updateStartup.bind(part1),
    deleteStartup: part1.deleteStartup.bind(part1),
  };
});
container.register('enterpriseController', (c) => {
  const enterpriseService = c.get('enterpriseService');
  const part1 = new EnterpriseControllerPart1(enterpriseService);
  const part2 = new EnterpriseControllerPart2(enterpriseService);
  return {
    getAllEnterprises: part1.getAllEnterprises.bind(part1),
    searchEnterprises: part1.searchEnterprises.bind(part1),
    getEnterprisesFiltered: part1.getEnterprisesFiltered.bind(part1),
    getEnterpriseById: part1.getEnterpriseById.bind(part1),
    createEnterprise: part1.createEnterprise.bind(part1),
    updateEnterprise: part1.updateEnterprise.bind(part1),
    deleteEnterprise: part2.deleteEnterprise.bind(part2),
    getStatistics: part2.getStatistics.bind(part2),
    bulkUpdateStatus: part2.bulkUpdateStatus.bind(part2),
    bulkDelete: part2.bulkDelete.bind(part2),
    exportToCSV: part2.exportToCSV.bind(part2),
  };
});
container.register('corporateController', (c) => {
  const corporateService = c.get('corporateService');
  const part1 = new CorporateControllerPart1(corporateService);
  const part2 = new CorporateControllerPart2(corporateService);
  return {
    getAllCorporates: part1.getAllCorporates.bind(part1),
    searchCorporates: part1.searchCorporates.bind(part1),
    getCorporatesFiltered: part1.getCorporatesFiltered.bind(part1),
    getCorporateById: part1.getCorporateById.bind(part1),
    createCorporate: part1.createCorporate.bind(part1),
    updateCorporate: part1.updateCorporate.bind(part1),
    deleteCorporate: part2.deleteCorporate.bind(part2),
    getStatistics: part2.getStatistics.bind(part2),
    bulkUpdateStatus: part2.bulkUpdateStatus.bind(part2),
    bulkDelete: part2.bulkDelete.bind(part2),
    exportToCSV: part2.exportToCSV.bind(part2),
  };
});
container.register(
  'learningController',
  (c) => new LearningController(c.get('learningService'))
);
container.register('helpController', (c) => {
  const helpService = c.get('helpService');
  const part1 = new HelpControllerPart1(helpService);
  const part2 = new HelpControllerPart2(helpService);
  const part3 = new HelpControllerPart3(helpService);
  return {
    getHelpCenter: part1.getHelpCenter.bind(part1),
    getCategoryArticles: part1.getCategoryArticles.bind(part1),
    getArticle: part2.getArticle.bind(part2),
    searchArticles: part2.searchArticles.bind(part2),
    getCategoriesAPI: part3.getCategoriesAPI.bind(part3),
    getCategoryArticlesAPI: part3.getCategoryArticlesAPI.bind(part3),
    getArticleAPI: part3.getArticleAPI.bind(part3),
    searchArticlesAPI: part3.searchArticlesAPI.bind(part3),
    markArticleHelpfulAPI: part3.markArticleHelpfulAPI.bind(part3),
    getHelpStatsAPI: part3.getHelpStatsAPI.bind(part3),
  };
});
container.register('adminController', (c) => {
  const adminService = c.get('adminService');
  const dashboard = new AdminDashboardController(adminService);
  const systemStats = new AdminSystemStatsController(adminService);
  const userView = new AdminUserViewController(adminService);
  const userAction = new AdminUserActionController(adminService);
  const business = new AdminBusinessController(adminService);
  const organizations = new AdminOrganizationController(adminService);
  const ai = new AdminAIController(adminService);
  const credits = new AdminCreditController(adminService);
  return {
    showDashboard: dashboard.showDashboard.bind(dashboard),
    showUsers: userView.showUsers.bind(userView),
    showUserDetails: userView.showUserDetails.bind(userView),
    showContent: dashboard.showContent.bind(dashboard),
    showHelpContent: dashboard.showHelpContent.bind(dashboard),
    showLearningContent: dashboard.showLearningContent.bind(dashboard),
    showSettings: dashboard.showSettings.bind(dashboard),
    showSystemHealth: dashboard.showSystemHealth.bind(dashboard),
    showIdeas: business.showIdeas.bind(business),
    showIdeaDetails: business.showIdeaDetails.bind(business),
    getIdea: business.getIdea.bind(business),
    updateIdea: business.updateIdea.bind(business),
    deleteIdea: business.deleteIdea.bind(business),
    showVotes: dashboard.showVotes.bind(dashboard),
    showCollaborations: business.showCollaborations.bind(business),
    showCollaborationDetails: business.showCollaborationDetails.bind(business),
    getProject: business.getProject.bind(business),
    updateProjectStatus: business.updateProjectStatus.bind(business),
    removeUserFromProject: business.removeUserFromProject.bind(business),
    deleteProject: business.deleteProject.bind(business),
    showPackages: business.showPackages.bind(business),
    showPackageDetails: business.showPackageDetails.bind(business),
    getPackage: business.getPackage.bind(business),
    createPackage: business.createPackage.bind(business),
    updatePackage: business.updatePackage.bind(business),
    deletePackage: business.deletePackage.bind(business),
    showBilling: business.showBilling.bind(business),
    showBillingDetails: business.showBillingDetails.bind(business),
    getBillingTransaction: business.getBillingTransaction.bind(business),
    createBillingTransaction: business.createBillingTransaction.bind(business),
    updateBillingStatus: business.updateBillingStatus.bind(business),
    processRefund: business.processRefund.bind(business),
    showRewards: business.showRewards.bind(business),
    showRewardDetails: business.showRewardDetails.bind(business),
    getReward: business.getReward.bind(business),
    createReward: business.createReward.bind(business),
    updateReward: business.updateReward.bind(business),
    deleteReward: business.deleteReward.bind(business),
    grantReward: business.grantReward.bind(business),
    showLandingPage: dashboard.showLandingPage.bind(dashboard),
    getSystemStatsAPI: systemStats.getSystemStatsAPI.bind(systemStats),
    createUser: userAction.createUser.bind(userAction),
    getUser: userView.getUser.bind(userView),
    updateUserCredits: userAction.updateUserCredits.bind(userAction),
    updateUserRole: userAction.updateUserRole.bind(userAction),
    updateUserStatus: userAction.updateUserStatus.bind(userAction),
    updateUserBanned: userAction.updateUserBanned.bind(userAction),
    resetUserPassword: userAction.resetUserPassword.bind(userAction),
    impersonateUser: userAction.impersonateUser.bind(userAction),
    impersonateUserPage: userAction.impersonateUserPage.bind(userAction),
    exportUsersToCSV: userView.exportUsersToCSV.bind(userView),
    deleteUser: userAction.deleteUser.bind(userAction),
    bulkUpdateCredits: userAction.bulkUpdateCredits.bind(userAction),
    bulkUpdateRoles: userAction.bulkUpdateRoles.bind(userAction),
    updateLandingPageSectionOrder:
      business.updateLandingPageSectionOrder.bind(business),
    // Organization controllers
    showOrganizations: organizations.showOrganizations.bind(organizations),
    showOrganizationDetails:
      organizations.showOrganizationDetails.bind(organizations),
    // AI controllers
    showAIModels: ai.showAIModels.bind(ai),
    showAIWorkflows: ai.showAIWorkflows.bind(ai),
    showAIWorkflowDetails: ai.showAIWorkflowDetails.bind(ai),
    // Credit controllers
    showCredits: credits.showCredits.bind(credits),
    showTransactions: credits.showTransactions.bind(credits),
    showPaymentMethods: credits.showPaymentMethods.bind(credits),
    // New SCRUD methods for missing tables
    showProjects: business.showProjects.bind(business),
    showProjectDetails: business.showProjectDetails.bind(business),
    createProject: business.createProject.bind(business),
    updateProject: business.updateProject.bind(business),
    showProjectCollaborators: business.showProjectCollaborators.bind(business),
    createProjectCollaborator:
      business.createProjectCollaborator.bind(business),
    updateProjectCollaborator:
      business.updateProjectCollaborator.bind(business),
    deleteProjectCollaborator:
      business.deleteProjectCollaborator.bind(business),
    showTasks: business.showTasks.bind(business),
    createTask: business.createTask.bind(business),
    updateTask: business.updateTask.bind(business),
    deleteTask: business.deleteTask.bind(business),
    showMessages: business.showMessages.bind(business),
    createMessage: business.createMessage.bind(business),
    updateMessage: business.updateMessage.bind(business),
    deleteMessage: business.deleteMessage.bind(business),
    showStartups: business.showStartups.bind(business),
    createStartup: business.createStartup.bind(business),
    updateStartup: business.updateStartup.bind(business),
    deleteStartup: business.deleteStartup.bind(business),
    showEnterprises: business.showEnterprises.bind(business),
    createEnterprise: business.createEnterprise.bind(business),
    updateEnterprise: business.updateEnterprise.bind(business),
    deleteEnterprise: business.deleteEnterprise.bind(business),
    showCorporates: business.showCorporates.bind(business),
    createCorporate: business.createCorporate.bind(business),
    updateCorporate: business.updateCorporate.bind(business),
    deleteCorporate: business.deleteCorporate.bind(business),
    showHelpCategories: business.showHelpCategories.bind(business),
    createHelpCategory: business.createHelpCategory.bind(business),
    updateHelpCategory: business.updateHelpCategory.bind(business),
    deleteHelpCategory: business.deleteHelpCategory.bind(business),
    showHelpArticles: business.showHelpArticles.bind(business),
    createHelpArticle: business.createHelpArticle.bind(business),
    updateHelpArticle: business.updateHelpArticle.bind(business),
    deleteHelpArticle: business.deleteHelpArticle.bind(business),
  };
});
container.register(
  'adminAuthController',
  (c) => new AdminAuthController(c.get('authService'))
);

module.exports = container;
