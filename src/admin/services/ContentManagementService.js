/**
 * Content management service handling help and learning content for admin
 */
class ContentManagementService {
  constructor(helpService, learningService) {
    this.helpService = helpService;
    this.learningService = learningService;
  }

  /**
   * Get help content for admin management
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Help content data with pagination
   */
  async getHelpContent(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [articles, totalCount, categories] = await Promise.all([
        this.helpService.getArticles({
          limit,
          offset,
          category: options.category,
          search: options.search,
        }),
        this.helpService.countArticles({
          category: options.category,
          search: options.search,
        }),
        this.helpService.getCategories(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        articles,
        categories,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting help content:', error);
      throw error;
    }
  }

  /**
   * Get learning content for admin management
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Learning content data with pagination
   */
  async getLearningContent(options = {}) {
    try {
      const page = options.page || 1;
      const limit = options.limit || 20;
      const offset = (page - 1) * limit;

      const [articles, totalCount, categories] = await Promise.all([
        this.learningService.getArticles({
          limit,
          offset,
          category: options.category,
          search: options.search,
        }),
        this.learningService.countArticles({
          category: options.category,
          search: options.search,
        }),
        this.learningService.getCategories(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        articles,
        categories,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
        },
      };
    } catch (error) {
      console.error('Error getting learning content:', error);
      throw error;
    }
  }
}

module.exports = ContentManagementService;
