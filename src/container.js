/**
 * Application container setup
 * Registers all services, repositories, and controllers
 */

const Container = require('./utils/container');
const { db } = require('../config/database');

// Import repositories
const UserRepository = require('./repositories/UserRepository');
const IdeaRepository = require('./repositories/IdeaRepository');
const PortfolioRepository = require('./repositories/PortfolioRepository');
const VoteRepository = require('./repositories/VoteRepository');
const {
  LearningContentRepository,
  LearningCategoryRepository,
} = require('./repositories/LearningContentRepository');

// Import services
const AuthService = require('./services/AuthService');
const IdeaService = require('./services/IdeaService');
const VoteService = require('./services/VoteService');
const LearningService = require('./services/LearningService');

// Import controllers
const AuthController = require('./controllers/AuthController');
const IdeaController = require('./controllers/IdeaController');
const VoteController = require('./controllers/VoteController');
const LearningController = require('./controllers/LearningController');

// Create container instance
const container = new Container();

// Register database connection
container.register('db', () => db);

// Register repositories
container.register('userRepository', (c) => new UserRepository(c.get('db')));
container.register('ideaRepository', (c) => new IdeaRepository(c.get('db')));
container.register(
  'portfolioRepository',
  (c) => new PortfolioRepository(c.get('db'))
);
container.register('voteRepository', (c) => new VoteRepository(c.get('db')));
container.register(
  'learningContentRepository',
  (c) => new LearningContentRepository(c.get('db'))
);
container.register(
  'learningCategoryRepository',
  (c) => new LearningCategoryRepository(c.get('db'))
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
  'learningService',
  (c) =>
    new LearningService(
      c.get('learningContentRepository'),
      c.get('learningCategoryRepository')
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
  'learningController',
  (c) => new LearningController(c.get('learningService'))
);

module.exports = container;
