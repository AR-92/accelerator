/**
 * Help controller handling HTTP requests for help content operations
 */
class HelpController {
  constructor(helpService) {
    this.helpService = helpService;
  }

  /**
   * Get help center overview
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getHelpCenter(req, res) {
    try {
      const [categories, featuredArticles, stats] = await Promise.all([
        this.helpService.getAllCategories(),
        this.helpService.getFeaturedArticles(6),
        this.helpService.getHelpStats(),
      ]);

      res.render('pages/help/help-center', {
        title: 'Help Center - Accelerator Platform',
        layout: 'help',
        activeOverview: true,
        categories,
        featuredArticles,
        stats,
      });
    } catch (error) {
      console.error('Get help center error:', error);
      res.status(500).render('pages/help/help-center', {
        title: 'Help Center - Accelerator Platform',
        layout: 'help',
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
        this.helpService.getCategoryBySlug(categorySlug),
        this.helpService.getArticlesByCategory(categorySlug, options),
      ]);

      // Map category slug to view names and active flags
      const viewMap = {
        'getting-started': 'getting-started',
        'ai-assistant': 'ai-assistant',
        'account-billing': 'account-billing',
        faq: 'faq',
      };

      const activeFlags = {
        'getting-started': 'activeGettingStarted',
        'ai-assistant': 'activeAIAssistant',
        'account-billing': 'activeAccountBilling',
        faq: 'activeFAQ',
      };

      const viewName = viewMap[categorySlug] || 'help-center';
      const activeFlag = activeFlags[categorySlug];

      const renderData = {
        title: `${category.name} - Help Center`,
        layout: 'help',
        category,
        articles,
        currentCategory: categorySlug,
      };

      if (activeFlag) {
        renderData[activeFlag] = true;
      }

      res.render(`pages/help/${viewName}`, renderData);
    } catch (error) {
      console.error('Get category articles error:', error);

      if (error.name === 'NotFoundError') {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Category Not Found - Accelerator Platform',
          layout: 'main',
        });
      }

      res.status(500).render('pages/help/help-center', {
        title: 'Help Center - Accelerator Platform',
        layout: 'help',
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

      const article = await this.helpService.getArticleBySlug(articleSlug);

      if (!article) {
        return res.status(404).render('pages/error/page-not-found', {
          title: 'Article Not Found - Accelerator Platform',
          layout: 'main',
        });
      }

      // Get category information for breadcrumb
      let category = null;
      try {
        category = await this.helpService.getCategoryById(article.categoryId);
      } catch (error) {
        console.error('Category lookup failed:', error.message);
        category = { slug: 'help', name: 'Help Center' };
      }

      // Get related articles based on category and tags
      const relatedArticles = await this.helpService.getRelatedArticles(
        article.id,
        article.categoryId,
        article.tags,
        4
      );

      // Add category info to article object for template
      const articleWithCategory = {
        ...article,
        categorySlug: category.slug,
        categoryName: category.name,
      };

      res.render('pages/help/article', {
        title: `${article.title} - Help Center`,
        layout: 'help',
        article: articleWithCategory,
        relatedArticles,
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
      const categories = await this.helpService.getAllCategories();

      if (!query || query.trim().length < 2) {
        return res.render('pages/help/search-results', {
          title: 'Search Help Content - Accelerator Platform',
          layout: 'help',
          articles: [],
          categories,
          searchQuery: query || '',
          currentCategory: category || '',
          currentDifficulty: difficulty || '',
          error: 'Search query must be at least 2 characters',
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
        this.helpService.searchArticles(query.trim(), filters),
        this.helpService.countSearchResults(query.trim(), {
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

      res.render('pages/help/search-results', {
        title: `Search Results: ${query} - Help Center`,
        layout: 'help',
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
      });
    } catch (error) {
      console.error('Search articles error:', error);
      const categories = await this.helpService
        .getAllCategories()
        .catch(() => []);
      res.status(500).render('pages/help/search-results', {
        title: 'Search Help Content - Accelerator Platform',
        layout: 'help',
        articles: [],
        categories,
        searchQuery: req.query.q || '',
        currentCategory: req.query.category || '',
        currentDifficulty: req.query.difficulty || '',
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
      const categories = await this.helpService.getAllCategories();
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

      const articles = await this.helpService.getArticlesByCategory(
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
      const article = await this.helpService.getArticleBySlug(articleSlug);

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

      const articles = await this.helpService.searchArticles(query);
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
   * Mark article as helpful (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async markArticleHelpfulAPI(req, res) {
    try {
      const { articleId } = req.params;

      const article = await this.helpService.markArticleHelpful(
        parseInt(articleId)
      );
      res.json({
        success: true,
        helpfulCount: article.helpfulCount,
        message: 'Article marked as helpful',
      });
    } catch (error) {
      console.error('Mark article helpful API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to mark article as helpful',
      });
    }
  }

  /**
   * Get help statistics (API)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getHelpStatsAPI(req, res) {
    try {
      const stats = await this.helpService.getHelpStats();
      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error('Get help stats API error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to fetch statistics',
      });
    }
  }
}

module.exports = HelpController;
