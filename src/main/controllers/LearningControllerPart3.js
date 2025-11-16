/**
 * Learning controller part 3 handling basic API endpoints
 */
class LearningControllerPart3 {
  constructor(learningService) {
    this.learningService = learningService;
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
}

module.exports = LearningControllerPart3;
