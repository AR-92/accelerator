/**
 * Application container setup
 * Registers all services, repositories, and controllers using modular approach
 */

const Container = require('./utils/container');
const { db } = require('../config/database');

// Create container instance
const container = new Container();

// Register database connection
container.register('db', () => db);

// Load modules
const authModule = require('./modules/auth')(container);

// TODO: Load other modules as they are migrated
const learningModule = require('./modules/learning')(container);
const helpModule = require('./modules/help')(container);
const collaborationModule = require('./modules/collaboration')(container);
const ideasModule = require('./modules/ideas')(container);
const corporateModule = require('./modules/corporate')(container);
const enterpriseModule = require('./modules/enterprise')(container);
const startupModule = require('./modules/startup')(container);
// const adminModule = require('./modules/admin')(container); // Moved to after registrations

// For now, keep the old registrations for non-migrated modules
// Import repositories
const AdminActivityRepository = require('./admin/repositories/AdminActivityRepository');
const IdeaRepository = require('./main/repositories/IdeaRepository');
const PortfolioRepository = require('./main/repositories/PortfolioRepository');
const VoteRepository = require('./main/repositories/VoteRepository');

const EnterpriseRepository = require('./main/repositories/EnterpriseRepository');
const CorporateRepository = require('./main/repositories/CorporateRepository');
const OrganizationRepository = require('./main/repositories/OrganizationRepository');
const ProjectRepository = require('./modules/collaboration/repositories/ProjectRepository');
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
const IdeaService = require('./main/services/IdeaService');
const VoteService = require('./main/services/VoteService');

const EnterpriseService = require('./main/services/EnterpriseService');
const CorporateService = require('./main/services/CorporateService');
const OrganizationService = require('./main/services/OrganizationService');
const LandingPageService = require('./main/services/LandingPageService');
const LearningService = require('./main/services/LearningService');
const HelpService = require('./main/services/HelpService');

const SystemMonitoringService = require('./admin/services/SystemMonitoringService');
const UserManagementService = require('./admin/services/UserManagementService');
const ContentManagementService = require('./admin/services/ContentManagementService');
const ProjectManagementService = require('./admin/services/ProjectManagementService');
const AdminService = require('./admin/services/AdminService');

// Import controllers
const IdeaController = require('./ideas/controllers/IdeaController');
const VoteController = require('./ideas/controllers/VoteController');

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

// Register repositories
container.register('ideaRepository', () => new IdeaRepository(db));
container.register('portfolioRepository', () => new PortfolioRepository(db));
container.register('voteRepository', () => new VoteRepository(db));

container.register('enterpriseRepository', () => new EnterpriseRepository(db));
container.register('corporateRepository', () => new CorporateRepository(db));
container.register(
  'organizationRepository',
  () => new OrganizationRepository(db)
);
container.register('aiModelRepository', () => new AIModelRepository(db));
container.register('aiWorkflowRepository', () => new AIWorkflowRepository(db));
// Commented out conflicting repositories - now using modular versions
container.register('projectRepository', () => new ProjectRepository(db)); // Restored for admin module compatibility
container.register(
  'collaborationRepository',
  () => new CollaborationRepository(db)
);
container.register(
  'projectCollaboratorRepository',
  () => new ProjectCollaboratorRepository(db)
);
container.register('taskRepository', () => new TaskRepository(db));
container.register('messageRepository', () => new MessageRepository(db));
container.register('teamRepository', () => new TeamRepository(db));
container.register(
  'landingPageRepository',
  () => new LandingPageRepository(db)
);
container.register('packageRepository', () => new PackageRepository(db));
container.register('billingRepository', () => new BillingRepository(db));
container.register('rewardRepository', () => new RewardRepository(db));
container.register(
  'transactionRepository',
  () => new TransactionRepository(db)
);
container.register(
  'paymentMethodRepository',
  () => new PaymentMethodRepository(db)
);
container.register(
  'learningContentRepository',
  () => new LearningContentRepository(db)
);
container.register(
  'learningCategoryRepository',
  () => new LearningCategoryRepository(db)
);
container.register(
  'helpContentRepository',
  () => new HelpContentRepository(db)
);
container.register(
  'helpCategoryRepository',
  () => new HelpCategoryRepository(db)
);
container.register('aiWorkflowRepository', () => new AIWorkflowRepository(db));
container.register(
  'workflowStepRepository',
  () => new WorkflowStepRepository(db)
);

// Register services
container.register(
  'ideaService',
  () => new IdeaService(container.get('ideaRepository'))
);
container.register(
  'voteService',
  () => new VoteService(container.get('voteRepository'))
);

container.register(
  'enterpriseService',
  () => new EnterpriseService(container.get('enterpriseRepository'))
);
container.register(
  'corporateService',
  () => new CorporateService(container.get('corporateRepository'))
);
container.register(
  'organizationService',
  () => new OrganizationService(container.get('organizationRepository'))
);
container.register(
  'landingPageService',
  () => new LandingPageService(container.get('landingPageRepository'))
);
container.register(
  'learningService',
  () =>
    new LearningService(
      container.get('learningContentRepository'),
      container.get('learningCategoryRepository')
    )
);
container.register(
  'helpService',
  () =>
    new HelpService(
      container.get('helpContentRepository'),
      container.get('helpCategoryRepository')
    )
);

// Register controllers
container.register(
  'ideaController',
  () => new IdeaController(container.get('ideaService'))
);
container.register(
  'voteController',
  () => new VoteController(container.get('voteService'))
);

container.register(
  'learningController',
  () => new LearningController(container.get('learningService'))
);

// Load admin module after all dependencies are registered
const adminModule = require('./modules/admin')(container);

module.exports = container;
