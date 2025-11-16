/**
 * Learning controller handling all learning-related operations
 */
class LearningController {
  constructor(learningService) {
    this.learningService = learningService;
  }

  /**
   * Get learning center overview
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getLearningCenter(req, res) {
    try {
      const [categories, featuredArticles, stats] = await Promise.all([
        this.learningService.getAllCategories(),
        this.learningService.getFeaturedArticles(6),
        this.learningService.getLearningStats(),
      ]);

      res.render('pages/learn/learn-center', {
        title: 'Learning Center - Accelerator Platform',
        layout: 'learn',
        activeOverview: true,
        categories,
        featuredArticles,
        stats,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get learning center error:', error);
      res.status(500).render('pages/learn/learn-center', {
        title: 'Learning Center - Accelerator Platform',
        layout: 'learn',
        activeOverview: true,
        categories: [],
        featuredArticles: [],
        stats: { totalArticles: 0, totalCategories: 0, totalViews: 0 },
      });
    }
  }

  /**
   * Get articles by category
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCategoryArticles(req, res) {
    try {
      const { categorySlug } = req.params;
      const { limit, offset } = req.query;

      const options = {};
      if (limit) options.limit = parseInt(limit);
      if (offset) options.offset = parseInt(offset);

      const [category, articles] = await Promise.all([
        this.learningService.getCategoryBySlug(categorySlug),
        this.learningService.getArticlesByCategory(categorySlug, options),
      ]);

      // Map category slug to view names and active flags
      const viewMap = {
        'getting-started': 'getting-started',
        courses: 'courses',
        tutorials: 'tutorials',
        resources: 'resources',
      };

      const activeFlags = {
        'getting-started': 'activeGettingStarted',
        courses: 'activeCourses',
        tutorials: 'activeTutorials',
        resources: 'activeResources',
      };

      const viewName = viewMap[categorySlug] || 'learn-center';
      const activeFlag = activeFlags[categorySlug];

      const renderData = {
        title: `${category.name} - Learning Center`,
        layout: 'learn',
        category,
        articles,
        currentCategory: categorySlug,
        user: res.locals.user,
      };

      if (activeFlag) {
        renderData[activeFlag] = true;
      }

      res.render(`pages/learn/${viewName}`, renderData);
    } catch (error) {
      console.error('Get category articles error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Category Not Found - Accelerator Platform',
          layout: 'main',
        });
      }

      res.status(500).render('pages/learn/learn-center', {
        title: 'Learning Center - Accelerator Platform',
        layout: 'learn',
        activeOverview: true,
        articles: [],
        error: 'Failed to load articles',
      });
    }
  }

  /**
   * Get individual article
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getArticle(req, res) {
    try {
      const { articleSlug } = req.params;
      const article = await this.learningService.getArticleBySlug(articleSlug);

      // Get related articles based on category and tags
      const relatedArticles = await this.learningService.getRelatedArticles(
        article.id,
        article.categoryId,
        article.tags,
        4
      );

      res.render('pages/learn/article', {
        title: `${article.title} - Learning Center`,
        layout: 'learn',
        article,
        relatedArticles,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Get article error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Article Not Found - Accelerator Platform',
          layout: 'main',
        });
      }

      res.status(500).render('pages/error/page-not-found', {
        title: 'Error Loading Article - Accelerator Platform',
        layout: 'main',
      });
    }
  }

  /**
   * Search articles
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchArticles(req, res) {
    try {
      const { q: query, category, difficulty, limit, offset } = req.query;

      // Get categories for filter dropdown
      const categories = await this.learningService.getAllCategories();

      if (!query || query.trim().length < 2) {
        return res.render('pages/learn/search-results', {
          title: 'Search Learning Content - Accelerator Platform',
          layout: 'learn',
          articles: [],
          categories,
          searchQuery: query || '',
          currentCategory: category || '',
          currentDifficulty: difficulty || '',
          error: 'Search query must be at least 2 characters',
          user: res.locals.user,
        });
      }

      // Build filters object
      const filters = {};
      if (category)
        filters.categoryId = categories.find((c) => c.slug === category)?.id;
      if (difficulty) filters.difficultyLevel = difficulty;
      const pageSize = parseInt(limit) || 12;
      const currentOffset = parseInt(offset) || 0;
      filters.limit = pageSize;
      filters.offset = currentOffset;

      const [articles, totalResults] = await Promise.all([
        this.learningService.searchArticles(query.trim(), filters),
        this.learningService.countSearchResults(query.trim(), {
          ...filters,
          limit: undefined,
          offset: undefined,
        }),
      ]);

      // Calculate pagination data
      const currentPage = Math.floor(currentOffset / pageSize) + 1;
      const totalPages = Math.ceil(totalResults / pageSize);
      const hasPrevious = currentPage > 1;
      const hasNext = currentOffset + articles.length < totalResults;
      const previousOffset = Math.max(0, currentOffset - pageSize);
      const nextOffset = currentOffset + pageSize;
      const offsetStart = currentOffset + 1;
      const offsetEnd = currentOffset + articles.length;

      res.render('pages/learn/search-results', {
        title: `Search Results: ${query} - Learning Center`,
        layout: 'learn',
        articles,
        categories,
        searchQuery: query,
        currentCategory: category || '',
        currentDifficulty: difficulty || '',
        resultCount: articles.length,
        // Pagination data
        currentPage,
        totalPages,
        hasPrevious,
        hasNext,
        previousOffset,
        nextOffset,
        offsetStart,
        offsetEnd,
        totalResults,
        user: res.locals.user,
      });
    } catch (error) {
      console.error('Search articles error:', error);
      const categories = await this.learningService
        .getAllCategories()
        .catch(() => []);
      res.status(500).render('pages/learn/search-results', {
        title: 'Search Learning Content - Accelerator Platform',
        layout: 'learn',
        articles: [],
        categories,
        searchQuery: req.query.q || '',
        currentCategory: req.query.category || '',
        currentDifficulty: req.query.difficulty || '',
        error: 'Search failed. Please try again.',
      });
    }
  }

  /**
   * Get all categories (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCategoriesAPI(req, res) {
    try {
      const categories = await this.learningService.getAllCategories();
      res.json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error('Get categories API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch categories',
      });
    }
  }

  /**
   * Get articles by category (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCategoryArticlesAPI(req, res) {
    try {
      const { categorySlug } = req.params;
      const { limit, offset } = req.query;

      const options = {};
      if (limit) options.limit = parseInt(limit);
      if (offset) options.offset = parseInt(offset);

      const articles = await this.learningService.getArticlesByCategory(
        categorySlug,
        options
      );
      res.json({
        success: true,
        articles,
        count: articles.length,
      });
    } catch (error) {
      console.error('Get category articles API error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch articles',
      });
    }
  }

  /**
   * Get article by slug (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getArticleAPI(req, res) {
    try {
      const { articleSlug } = req.params;
      const article = await this.learningService.getArticleBySlug(articleSlug);

      res.json({
        success: true,
        article,
      });
    } catch (error) {
      console.error('Get article API error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch article',
      });
    }
  }

  /**
   * Search articles (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchArticlesAPI(req, res) {
    try {
      const { q: query } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Search query must be at least 2 characters',
        });
      }

      const articles = await this.learningService.searchArticles(query);
      res.json({
        success: true,
        articles,
        count: articles.length,
        query: query.trim(),
      });
    } catch (error) {
      console.error('Search articles API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Search failed',
      });
    }
  }

  /**
   * Get user progress for an article (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserArticleProgressAPI(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.id; // Assuming user is authenticated

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const progress = await this.learningService.getUserArticleProgress(
        userId,
        parseInt(articleId)
      );
      res.json({
        success: true,
        progress,
      });
    } catch (error) {
      console.error('Get user article progress API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch progress',
      });
    }
  }

  /**
   * Update user progress for an article (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUserArticleProgressAPI(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.id;
      const { progressPercentage, timeSpentSeconds, isCompleted } = req.body;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const success = await this.learningService.updateUserArticleProgress(
        userId,
        parseInt(articleId),
        {
          progressPercentage: parseInt(progressPercentage) || 0,
          timeSpentSeconds: parseInt(timeSpentSeconds) || 0,
          isCompleted: Boolean(isCompleted),
        }
      );

      res.json({
        success,
        message: success
          ? 'Progress updated successfully'
          : 'Failed to update progress',
      });
    } catch (error) {
      console.error('Update user article progress API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update progress',
      });
    }
  }

  /**
   * Mark article as completed (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async markArticleCompletedAPI(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const success = await this.learningService.markArticleCompleted(
        userId,
        parseInt(articleId)
      );
      res.json({
        success,
        message: success
          ? 'Article marked as completed'
          : 'Failed to mark article as completed',
      });
    } catch (error) {
      console.error('Mark article completed API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to mark article as completed',
      });
    }
  }

  /**
   * Get user learning progress (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUserLearningProgressAPI(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const progress =
        await this.learningService.getUserLearningProgress(userId);
      res.json({
        success: true,
        progress,
      });
    } catch (error) {
      console.error('Get user learning progress API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch learning progress',
      });
    }
  }

  /**
   * Like an article (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async likeArticleAPI(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const article = await this.learningService.likeArticle(
        userId,
        parseInt(articleId)
      );
      res.json({
        success: true,
        likeCount: article.likeCount,
        message: 'Article liked successfully',
      });
    } catch (error) {
      console.error('Like article API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to like article',
      });
    }
  }

  /**
   * Unlike an article (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async unlikeArticleAPI(req, res) {
    try {
      const { articleId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'Authentication Required',
          message: 'User must be logged in',
        });
      }

      const article = await this.learningService.unlikeArticle(
        userId,
        parseInt(articleId)
      );
      res.json({
        success: true,
        likeCount: article.likeCount,
        message: 'Article unliked successfully',
      });
    } catch (error) {
      console.error('Unlike article API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to unlike article',
      });
    }
  }

  /**
   * Get learning statistics (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getLearningStatsAPI(req, res) {
    try {
      const stats = await this.learningService.getLearningStats();
      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error('Get learning stats API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch statistics',
      });
    }
  }
}

module.exports = LearningController;
