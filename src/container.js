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
const {
  LearningContentRepository,
  LearningCategoryRepository,
} = require('./repositories/LearningContentRepository');
const {
  HelpContentRepository,
  HelpCategoryRepository,
} = require('./repositories/HelpContentRepository');

// Import services
const AuthService = require('./services/AuthService');
const IdeaService = require('./services/IdeaService');
const VoteService = require('./services/VoteService');
const StartupService = require('./services/StartupService');
const EnterpriseService = require('./services/EnterpriseService');
const CorporateService = require('./services/CorporateService');
const LearningService = require('./services/LearningService');
const HelpService = require('./services/HelpService');
const AdminService = require('./services/AdminService');

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
  'adminService',
  (c) =>
    new AdminService(
      c.get('userRepository'),
      c.get('helpService'),
      c.get('learningService'),
      c.get('adminActivityRepository'),
      c.get('startupService'),
      c.get('enterpriseService'),
      c.get('corporateService')
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
