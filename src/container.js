/**
 * Application container setup
 * Registers all services, repositories, and controllers
 */

const Container = require('./utils/container');
const { db } = require('../config/database');

// Import repositories
const UserRepository = require('./repositories/UserRepository');
const AdminActivityRepository = require('./repositories/AdminActivityRepository');
const IdeaRepository = require('./repositories/IdeaRepository');
const PortfolioRepository = require('./repositories/PortfolioRepository');
const VoteRepository = require('./repositories/VoteRepository');
const StartupRepository = require('./repositories/StartupRepository');
const EnterpriseRepository = require('./repositories/EnterpriseRepository');
const CorporateRepository = require('./repositories/CorporateRepository');
const ProjectRepository = require('./repositories/ProjectRepository');
const TeamRepository = require('./repositories/TeamRepository');
const LandingPageRepository = require('./repositories/LandingPageRepository');
const PackageRepository = require('./repositories/PackageRepository');
const BillingRepository = require('./repositories/BillingRepository');
const RewardRepository = require('./repositories/RewardRepository');
const {
  LearningContentRepository,
  LearningCategoryRepository,
} = require('./repositories/LearningContentRepository');
const {
  HelpContentRepository,
  HelpCategoryRepository,
} = require('./repositories/HelpContentRepository');

// Import services
const AuthService = require('./services/auth/AuthService');
const IdeaService = require('./services/idea/IdeaService');
const VoteService = require('./services/idea/VoteService');
const StartupService = require('./services/business/StartupService');
const EnterpriseService = require('./services/business/EnterpriseService');
const CorporateService = require('./services/business/CorporateService');
const LandingPageService = require('./services/content/LandingPageService');
const LearningService = require('./services/content/LearningService');
const HelpService = require('./services/content/HelpService');

// Import admin sub-services
const SystemMonitoringService = require('./services/admin/SystemMonitoringService');
const UserManagementService = require('./services/admin/UserManagementService');
const ContentManagementService = require('./services/admin/ContentManagementService');
const BusinessManagementService = require('./services/admin/BusinessManagementService');
const ProjectManagementService = require('./services/admin/ProjectManagementService');
const AdminService = require('./services/admin/AdminService');

// Import controllers
const AuthController = require('./controllers/AuthController');
const IdeaController = require('./controllers/IdeaController');
const VoteController = require('./controllers/VoteController');
const StartupController = require('./controllers/StartupController');
const EnterpriseController = require('./controllers/EnterpriseController');
const CorporateController = require('./controllers/CorporateController');
const LearningController = require('./controllers/LearningController');
const HelpController = require('./controllers/HelpController');
const AdminController = require('./controllers/AdminController');
const AdminAuthController = require('./controllers/AdminAuthController');

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
  'projectRepository',
  (c) => new ProjectRepository(c.get('db'))
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
  (c) => new VoteService(c.get('voteRepository'), c.get('ideaRepository'))
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
  'businessManagementService',
  (c) =>
    new BusinessManagementService(
      c.get('startupService'),
      c.get('enterpriseService'),
      c.get('corporateService'),
      c.get('adminActivityRepository')
    )
);
container.register(
  'projectManagementService',
  (c) =>
    new ProjectManagementService(
      c.get('projectRepository'),
      c.get('teamRepository'),
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
      c.get('businessManagementService'),
      c.get('projectManagementService'),
      c.get('ideaService'),
      c.get('voteService'),
      c.get('landingPageService'),
      c.get('packageRepository'),
      c.get('billingRepository'),
      c.get('rewardRepository'),
      c.get('voteRepository')
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
container.register(
  'startupController',
  (c) => new StartupController(c.get('startupService'))
);
container.register(
  'enterpriseController',
  (c) => new EnterpriseController(c.get('enterpriseService'))
);
container.register(
  'corporateController',
  (c) => new CorporateController(c.get('corporateService'))
);
container.register(
  'learningController',
  (c) => new LearningController(c.get('learningService'))
);
container.register(
  'helpController',
  (c) => new HelpController(c.get('helpService'))
);
container.register(
  'adminController',
  (c) => new AdminController(c.get('adminService'))
);
container.register(
  'adminAuthController',
  (c) => new AdminAuthController(c.get('authService'))
);

module.exports = container;
