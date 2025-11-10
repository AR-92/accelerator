const request = require('supertest');
const express = require('express');
const container = require('../../../container');
const { requireAuth } = require('../../../middleware/auth/auth');

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
    container.get.mockReturnValue(mockLearningController);

    // Create express app with routes
    app = express();
    app.use(express.json());

    // Import and use routes (this will use our mocked container)
    const learningRoutes = require('../../../routes/pages/main');
    app.use('/', learningRoutes);

    // API routes
    const apiRoutes = require('../../../routes/api/v1/api');
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
          (req, res) => {
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
          (req, res) => {
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
        mockLearningController.getArticleAPI.mockImplementation((req, res) => {
          res.json({
            success: true,
            article: { id: 1, title: 'Test Article' },
          });
        });

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
          (req, res) => {
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
          (req, res) => {
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
