/**
 * Learning controller handling HTTP requests for learning content operations
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

      // Map category slug to view names
      const viewMap = {
        'getting-started': 'getting-started',
        courses: 'courses',
        tutorials: 'tutorials',
        resources: 'resources',
      };

      const viewName = viewMap[categorySlug] || 'learn-center';
      const activeKey = `active${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace('-', '')}`;

      res.render(`pages/learn/${viewName}`, {
        title: `${category.name} - Learning Center`,
        layout: 'learn',
        [activeKey]: true,
        category,
        articles,
        currentCategory: categorySlug,
      });
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

      res.render('pages/learn/article', {
        title: `${article.title} - Learning Center`,
        layout: 'learn',
        article,
        // Add related articles or other data as needed
        relatedArticles: [],
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
      const { q: query } = req.query;

      if (!query || query.trim().length < 2) {
        return res.render('pages/learn/search-results', {
          title: 'Search Learning Content - Accelerator Platform',
          layout: 'learn',
          articles: [],
          searchQuery: query || '',
          error: 'Search query must be at least 2 characters',
        });
      }

      const articles = await this.learningService.searchArticles(query);

      res.render('pages/learn/search-results', {
        title: `Search Results: ${query} - Learning Center`,
        layout: 'learn',
        articles,
        searchQuery: query,
        resultCount: articles.length,
      });
    } catch (error) {
      console.error('Search articles error:', error);
      res.status(500).render('pages/learn/search-results', {
        title: 'Search Learning Content - Accelerator Platform',
        layout: 'learn',
        articles: [],
        searchQuery: req.query.q || '',
        error: 'Search failed. Please try again.',
      });
    }
  }

  // API Endpoints for AJAX requests

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
