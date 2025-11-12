const request = require('supertest');
const express = require('express');
const container = require('../../../container');
const { requireAuth } = require('../../../middleware/auth/auth');

// Get the mocked container get function
const mockContainerGet = container.get;

// Mock the container to return mock services
jest.mock('../../../container', () => ({
  get: jest.fn(),
}));

// Mock the auth middleware
jest.mock('../../../middleware/auth/auth', () => ({
  requireAuth: jest.fn((req, res, next) => next()),
  optionalAuth: jest.fn((req, res, next) => next()),
}));

describe('Learning Routes Integration', () => {
  let app;
  let mockLearningController;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock controller
    mockLearningController = {
      getLearningCenter: jest.fn(),
      getCategoryArticles: jest.fn(),
      getArticle: jest.fn(),
      searchArticles: jest.fn(),
      getCategoriesAPI: jest.fn(),
      getCategoryArticlesAPI: jest.fn(),
      getArticleAPI: jest.fn(),
      searchArticlesAPI: jest.fn(),
      getLearningStatsAPI: jest.fn(),
    };

    // Mock container to return our mock controller
    mockContainerGet.mockImplementation((serviceName) => {
      if (serviceName === 'learningController') {
        return mockLearningController;
      }
      if (serviceName === 'adminController') {
        return {
          showDashboard: jest.fn(),
          showUsers: jest.fn(),
          showUserDetails: jest.fn(),
          showStartups: jest.fn(),
          showStartupDetails: jest.fn(),
          showEnterprises: jest.fn(),
          showEnterpriseDetails: jest.fn(),
          showCorporates: jest.fn(),
          showCorporateDetails: jest.fn(),
          showIdeas: jest.fn(),
          showIdeaDetails: jest.fn(),
          showCollaborations: jest.fn(),
          showCollaborationDetails: jest.fn(),
          showContent: jest.fn(),
          showLearningContent: jest.fn(),
          showHelpContent: jest.fn(),
          showSettings: jest.fn(),
          showSystemHealth: jest.fn(),
          getSystemStatsAPI: jest.fn(),
          createUser: jest.fn(),
          getUser: jest.fn(),
          updateUserCredits: jest.fn(),
          updateUserRole: jest.fn(),
          updateUserStatus: jest.fn(),
          updateUserBanned: jest.fn(),
          resetUserPassword: jest.fn(),
          exportUsersToCSV: jest.fn(),
          deleteUser: jest.fn(),
          bulkUpdateCredits: jest.fn(),
          bulkUpdateRoles: jest.fn(),
          createStartup: jest.fn(),
          getStartup: jest.fn(),
          updateStartup: jest.fn(),
          deleteStartup: jest.fn(),
          showStartups: jest.fn(),
          showStartupDetails: jest.fn(),
          showEnterprises: jest.fn(),
          showEnterpriseDetails: jest.fn(),
          createEnterprise: jest.fn(),
          getEnterprise: jest.fn(),
          updateEnterprise: jest.fn(),
          deleteEnterprise: jest.fn(),
          bulkUpdateEnterpriseStatus: jest.fn(),
          bulkDeleteEnterprises: jest.fn(),
          exportEnterprisesToCSV: jest.fn(),
          showCollaborations: jest.fn(),
          showCollaborationDetails: jest.fn(),
          getProject: jest.fn(),
          updateProjectStatus: jest.fn(),
          removeUserFromProject: jest.fn(),
          deleteProject: jest.fn(),
          showCorporates: jest.fn(),
          showCorporateDetails: jest.fn(),
          createCorporate: jest.fn(),
          getCorporate: jest.fn(),
          updateCorporate: jest.fn(),
          deleteCorporate: jest.fn(),
          bulkUpdateCorporateStatus: jest.fn(),
          bulkDeleteCorporates: jest.fn(),
          exportCorporatesToCSV: jest.fn(),
          getIdea: jest.fn(),
          updateIdea: jest.fn(),
          deleteIdea: jest.fn(),
          showPackages: jest.fn(),
          showPackageDetails: jest.fn(),
          createPackage: jest.fn(),
          getPackage: jest.fn(),
          updatePackage: jest.fn(),
          deletePackage: jest.fn(),
          showBilling: jest.fn(),
          showBillingDetails: jest.fn(),
          createBillingTransaction: jest.fn(),
          getBillingTransaction: jest.fn(),
          updateBillingStatus: jest.fn(),
          processRefund: jest.fn(),
          showRewards: jest.fn(),
          showRewardDetails: jest.fn(),
          createReward: jest.fn(),
          grantReward: jest.fn(),
          getReward: jest.fn(),
          updateReward: jest.fn(),
          deleteReward: jest.fn(),
          updateLandingPageSectionOrder: jest.fn(),
          showCredits: jest.fn(),
          showTransactions: jest.fn(),
          showPaymentMethods: jest.fn(),
        };
      }
      // Return a mock object for other services to prevent undefined errors
      return {
        login: jest.fn(),
        logout: jest.fn(),
        // Add other methods as needed
      };
    });

    // Create express app with routes
    app = express();
    app.use(express.json());

    // Set up minimal view engine for testing
    app.engine('hbs', (filePath, options, callback) => {
      callback(null, '<html><body>Test</body></html>');
    });
    app.set('view engine', 'hbs');
    app.set('views', 'src/views');

    // Import and use routes (this will use our mocked container)
    const learningRoutes = require('../../../routes/pages/main');
    app.use('/', learningRoutes);

    // API routes
    const apiRoutes = require('../../../routes/api/v1');
    app.use('/api', apiRoutes);
  });

  describe('GET /learn', () => {
    it('should call learning controller getLearningCenter', async () => {
      mockLearningController.getLearningCenter.mockImplementation(
        (req, res) => {
          res.render('pages/learn/learn-center', {
            title: 'Learning Center',
            categories: [],
            featuredArticles: [],
            stats: {},
          });
        }
      );

      const response = await request(app).get('/learn');

      expect(mockLearningController.getLearningCenter).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /learn/getting-started', () => {
    it('should call learning controller getCategoryArticles with correct params', async () => {
      mockLearningController.getCategoryArticles.mockImplementation(
        (req, res) => {
          res.render('pages/learn/getting-started', {
            title: 'Getting Started',
            category: { name: 'Getting Started' },
            articles: [],
          });
        }
      );

      const response = await request(app).get('/learn/getting-started');

      expect(mockLearningController.getCategoryArticles).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /learn/courses', () => {
    it('should call learning controller for courses category', async () => {
      mockLearningController.getCategoryArticles.mockImplementation(
        (req, res) => {
          res.render('pages/learn/courses', {
            title: 'Courses',
            category: { name: 'Courses' },
            articles: [],
          });
        }
      );

      const response = await request(app).get('/learn/courses');

      expect(mockLearningController.getCategoryArticles).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /learn/tutorials', () => {
    it('should call learning controller for tutorials category', async () => {
      mockLearningController.getCategoryArticles.mockImplementation(
        (req, res) => {
          res.render('pages/learn/tutorials', {
            title: 'Tutorials',
            category: { name: 'Tutorials' },
            articles: [],
          });
        }
      );

      const response = await request(app).get('/learn/tutorials');

      expect(mockLearningController.getCategoryArticles).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /learn/resources', () => {
    it('should call learning controller for resources category', async () => {
      mockLearningController.getCategoryArticles.mockImplementation(
        (req, res) => {
          res.render('pages/learn/resources', {
            title: 'Resources',
            category: { name: 'Resources' },
            articles: [],
          });
        }
      );

      const response = await request(app).get('/learn/resources');

      expect(mockLearningController.getCategoryArticles).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('GET /learn/search', () => {
    it('should call learning controller searchArticles', async () => {
      mockLearningController.searchArticles.mockImplementation((req, res) => {
        res.render('pages/learn/search-results', {
          title: 'Search Results',
          articles: [],
          searchQuery: 'test',
        });
      });

      const response = await request(app).get('/learn/search?q=test');

      expect(mockLearningController.searchArticles).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });
  });

  describe('API Routes', () => {
    describe('GET /api/learning/categories', () => {
      it('should call getCategoriesAPI', async () => {
        mockLearningController.getCategoriesAPI.mockImplementation(
          async (req, res) => {
            res.json({ success: true, categories: [] });
          }
        );

        const response = await request(app).get('/api/learning/categories');

        expect(mockLearningController.getCategoriesAPI).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    describe('GET /api/learning/categories/:categorySlug/articles', () => {
      it('should call getCategoryArticlesAPI', async () => {
        mockLearningController.getCategoryArticlesAPI.mockImplementation(
          async (req, res) => {
            res.json({ success: true, articles: [] });
          }
        );

        const response = await request(app).get(
          '/api/learning/categories/getting-started/articles'
        );

        expect(
          mockLearningController.getCategoryArticlesAPI
        ).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    describe('GET /api/learning/articles/:articleSlug', () => {
      it('should call getArticleAPI', async () => {
        mockLearningController.getArticleAPI.mockImplementation(
          async (req, res) => {
            res.json({
              success: true,
              article: { id: 1, title: 'Test Article' },
            });
          }
        );

        const response = await request(app).get(
          '/api/learning/articles/test-article'
        );

        expect(mockLearningController.getArticleAPI).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.article.title).toBe('Test Article');
      });
    });

    describe('GET /api/learning/search', () => {
      it('should call searchArticlesAPI', async () => {
        mockLearningController.searchArticlesAPI.mockImplementation(
          async (req, res) => {
            res.json({ success: true, articles: [], query: 'test' });
          }
        );

        const response = await request(app).get('/api/learning/search?q=test');

        expect(mockLearningController.searchArticlesAPI).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.query).toBe('test');
      });
    });

    describe('GET /api/learning/stats', () => {
      it('should call getLearningStatsAPI', async () => {
        mockLearningController.getLearningStatsAPI.mockImplementation(
          async (req, res) => {
            res.json({ success: true, stats: { totalArticles: 10 } });
          }
        );

        const response = await request(app).get('/api/learning/stats');

        expect(mockLearningController.getLearningStatsAPI).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.stats.totalArticles).toBe(10);
      });
    });
  });
});
