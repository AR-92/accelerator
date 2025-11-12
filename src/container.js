/**
 * Application container setup
 * Registers all services, repositories, and controllers
 */

const Container = require('./utils/container');
const { db } = require('../config/database');

// Import repositories
const UserRepository = require('./repositories/user/UserRepository');
const AdminActivityRepository = require('./repositories/admin/AdminActivityRepository');
const IdeaRepository = require('./repositories/idea/IdeaRepository');
const PortfolioRepository = require('./repositories/project/PortfolioRepository');
const VoteRepository = require('./repositories/idea/VoteRepository');
const StartupRepository = require('./repositories/business/StartupRepository');
const EnterpriseRepository = require('./repositories/business/EnterpriseRepository');
const CorporateRepository = require('./repositories/business/CorporateRepository');
const OrganizationRepository = require('./repositories/business/OrganizationRepository');
const ProjectRepository = require('./repositories/project/ProjectRepository');
const CollaborationRepository = require('./repositories/project/CollaborationRepository');
const ProjectCollaboratorRepository = require('./repositories/project/ProjectCollaboratorRepository');
const TeamRepository = require('./repositories/user/TeamRepository');
const LandingPageRepository = require('./repositories/content/LandingPageRepository');
const PackageRepository = require('./repositories/billing/PackageRepository');
const BillingRepository = require('./repositories/billing/BillingRepository');
const RewardRepository = require('./repositories/billing/RewardRepository');
const TransactionRepository = require('./repositories/billing/TransactionRepository');
const PaymentMethodRepository = require('./repositories/billing/PaymentMethodRepository');
const LearningContentRepository = require('./repositories/content/learning/LearningContentRepository');
const LearningCategoryRepository = require('./repositories/content/learning/LearningCategoryRepository');
const HelpContentRepository = require('./repositories/content/help/HelpContentRepository');
const HelpCategoryRepository = require('./repositories/content/help/HelpCategoryRepository');
const AIModelRepository = require('./repositories/ai/AIModelRepository');
const AIWorkflowRepository = require('./repositories/ai/AIWorkflowRepository');
const WorkflowStepRepository = require('./repositories/ai/WorkflowStepRepository');

// Import services
const AuthService = require('./services/auth/AuthService');
const IdeaService = require('./services/idea/IdeaService');
const VoteService = require('./services/idea/VoteService');
const StartupService = require('./services/business/StartupService');
const EnterpriseService = require('./services/business/EnterpriseService');
const CorporateService = require('./services/business/CorporateService');
const OrganizationService = require('./services/business/OrganizationService');
const LandingPageService = require('./services/content/LandingPageService');
const LearningService = require('./services/content/LearningService');
const HelpService = require('./services/content/HelpService');

// Import admin sub-services
const SystemMonitoringService = require('./services/admin/SystemMonitoringService');
const UserManagementService = require('./services/admin/UserManagementService');
const ContentManagementService = require('./services/admin/ContentManagementService');
const ProjectManagementService = require('./services/admin/ProjectManagementService');
const AdminService = require('./services/admin/AdminService');

// Import controllers
const AuthControllerPart1 = require('./controllers/auth/AuthControllerPart1');
const AuthControllerPart2 = require('./controllers/auth/AuthControllerPart2');
const IdeaController = require('./controllers/idea/IdeaControllerPart1');
const VoteControllerPart1 = require('./controllers/idea/VoteControllerPart1');
const VoteControllerPart2 = require('./controllers/idea/VoteControllerPart2');
const StartupControllerPart1 = require('./controllers/business/StartupControllerPart1');
const StartupControllerPart2 = require('./controllers/business/StartupControllerPart2');
const EnterpriseControllerPart1 = require('./controllers/business/EnterpriseControllerPart1');
const EnterpriseControllerPart2 = require('./controllers/business/EnterpriseControllerPart2');
const CorporateControllerPart1 = require('./controllers/business/CorporateControllerPart1');
const CorporateControllerPart2 = require('./controllers/business/CorporateControllerPart2');
const LearningControllerPart1 = require('./controllers/content/LearningControllerPart1');
const LearningControllerPart2 = require('./controllers/content/LearningControllerPart2');
const LearningControllerPart3 = require('./controllers/content/LearningControllerPart3');
const LearningControllerPart4 = require('./controllers/content/LearningControllerPart4');
const HelpControllerPart1 = require('./controllers/content/HelpControllerPart1');
const HelpControllerPart2 = require('./controllers/content/HelpControllerPart2');
const HelpControllerPart3 = require('./controllers/content/HelpControllerPart3');
const AdminDashboardController = require('./controllers/admin/AdminDashboardController');
const AdminSystemStatsController = require('./controllers/admin/AdminSystemStatsController');
const AdminUserViewController = require('./controllers/admin/AdminUserViewController');
const AdminUserActionController = require('./controllers/admin/AdminUserActionController');
const AdminBusinessController = require('./controllers/admin/AdminBusinessController');
const AdminOrganizationController = require('./controllers/admin/AdminOrganizationController');
const AdminAIController = require('./controllers/admin/AdminAIController');
const AdminCreditController = require('./controllers/admin/AdminCreditController');
const AdminAuthController = require('./controllers/admin/AdminAuthController');

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
      c.get('rewardRepository')
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
      c.get('projectCollaboratorRepository')
    )
);

// Register controllers
container.register('authController', (c) => {
  const authService = c.get('authService');
  const part1 = new AuthControllerPart1(authService);
  const part2 = new AuthControllerPart2(authService);
  return {
    login: part1.login.bind(part1),
    register: part1.register.bind(part1),
    logout: part1.logout.bind(part1),
    // Add other methods if needed
  };
});
container.register(
  'ideaController',
  (c) => new IdeaController(c.get('ideaService'))
);
container.register('voteController', (c) => {
  const voteService = c.get('voteService');
  const part1 = new VoteControllerPart1(voteService);
  const part2 = new VoteControllerPart2(voteService);
  return {
    getVotesForIdea: part1.getVotesForIdea.bind(part1),
    addVote: part1.addVote.bind(part1),
    getVoteStats: part1.getVoteStats.bind(part1),
    getUserVotes: part1.getUserVotes.bind(part1),
    updateVote: part2.updateVote.bind(part2),
    deleteVote: part2.deleteVote.bind(part2),
  };
});
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
container.register('learningController', (c) => {
  const learningService = c.get('learningService');
  const part1 = new LearningControllerPart1(learningService);
  const part2 = new LearningControllerPart2(learningService);
  const part3 = new LearningControllerPart3(learningService);
  const part4 = new LearningControllerPart4(learningService);
  return {
    getLearningCenter: part1.getLearningCenter.bind(part1),
    getCategoryArticles: part1.getCategoryArticles.bind(part1),
    getArticle: part2.getArticle.bind(part2),
    searchArticles: part2.searchArticles.bind(part2),
    getCategoriesAPI: part3.getCategoriesAPI.bind(part3),
    getCategoryArticlesAPI: part3.getCategoryArticlesAPI.bind(part3),
    getArticleAPI: part3.getArticleAPI.bind(part3),
    searchArticlesAPI: part3.searchArticlesAPI.bind(part3),
    getUserArticleProgressAPI: part3.getUserArticleProgressAPI.bind(part3),
    updateUserArticleProgressAPI:
      part4.updateUserArticleProgressAPI.bind(part4),
    markArticleCompletedAPI: part4.markArticleCompletedAPI.bind(part4),
    getUserLearningProgressAPI: part4.getUserLearningProgressAPI.bind(part4),
    likeArticleAPI: part4.likeArticleAPI.bind(part4),
    unlikeArticleAPI: part4.unlikeArticleAPI.bind(part4),
    getLearningStatsAPI: part4.getLearningStatsAPI.bind(part4),
  };
});
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
  };
});
container.register(
  'adminAuthController',
  (c) => new AdminAuthController(c.get('authService'))
);

module.exports = container;
