/**
 * Help controller part 3 handling API endpoints
 */
class HelpControllerPart3 {
  constructor(helpService) {
    this.helpService = helpService;
  }

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

module.exports = HelpControllerPart3;
