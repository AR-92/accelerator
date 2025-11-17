/**
 * Help service handling business logic for help content
 */
class HelpService {
  constructor(helpContentRepository, helpCategoryRepository) {
    this.contentRepo = helpContentRepository;
    this.categoryRepo = helpCategoryRepository;
  }

  /**
   * Get all help categories
   * @returns {Promise<Object[]>} Array of category data
   */
  async getAllCategories() {
    const categories = await this.categoryRepo.findAllActive();
    return categories.map((category) => category.toPublicJSON());
  }

  /**
   * Get category by slug
   * @param {string} slug - Category slug
   * @returns {Promise<Object>} Category data
   */
  async getCategoryBySlug(slug) {
    const category = await this.categoryRepo.findBySlug(slug);
    if (!category) {
      const NotFoundError = require('../../../../../shared/utils/errors/NotFoundError');
      throw new NotFoundError('Help category not found');
    }
    return category.toPublicJSON();
  }

  /**
   * Get category by ID
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Category data
   */
  async getCategoryById(id) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      const NotFoundError = require('../../../../../shared/utils/errors/NotFoundError');
      throw new NotFoundError('Help category not found');
    }
    return category.toPublicJSON();
  }

  /**
   * Get all published articles
   * @param {Object} filters - Filter options
   * @returns {Promise<Object[]>} Array of article data
   */
  async getAllArticles(filters = {}) {
    const articles = await this.contentRepo.findAllPublished(filters);
    return articles.map((article) => article.toPublicJSON());
  }

  /**
   * Get articles for admin (including unpublished)
   * @param {Object} filters - Filter options
   * @returns {Promise<Object[]>} Array of article data
   */
  async getArticles(filters = {}) {
    const articles = await this.contentRepo.findAll({
      ...filters,
      includeUnpublished: true,
    });
    return articles.map((article) => article.toPublicJSON());
  }

  /**
   * Get all categories
   * @returns {Promise<Object[]>} Array of category data
   */
  async getCategories() {
    return await this.getAllCategories();
  }

  /**
   * Count articles with filters
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Number of articles
   */
  async countArticles(filters = {}) {
    return await this.contentRepo.countArticles({
      ...filters,
      includeUnpublished: true,
    });
  }

  /**
   * Get article by slug
   * @param {string} slug - Article slug
   * @returns {Promise<Object>} Article data
   */
  async getArticleBySlug(slug) {
    const article = await this.contentRepo.findBySlug(slug);
    if (!article) {
      const NotFoundError = require('../../../../../shared/utils/errors/NotFoundError');
      throw new NotFoundError('Help article not found');
    }

    // Increment view count asynchronously (don't wait for it)
    this.contentRepo
      .incrementViews(article.id)
      .catch((err) => console.error('Failed to increment view count:', err));

    return article.toPublicJSON();
  }

  /**
   * Get articles by category
   * @param {string} categorySlug - Category slug
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object[]>} Array of article data
   */
  async getArticlesByCategory(categorySlug, filters = {}) {
    const category = await this.categoryRepo.findBySlug(categorySlug);
    if (!category) {
      const NotFoundError = require('../../../../../shared/utils/errors/NotFoundError');
      throw new NotFoundError('Help category not found');
    }

    const articles = await this.contentRepo.findByCategory(
      category.id,
      filters
    );
    return articles.map((article) => article.toPublicJSON());
  }

  /**
   * Get featured articles
   * @param {number} limit - Number of articles to return
   * @returns {Promise<Object[]>} Array of featured article data
   */
  async getFeaturedArticles(limit = 6) {
    const articles = await this.contentRepo.findFeatured(limit);
    return articles.map((article) => article.toPublicJSON());
  }

  /**
   * Search articles
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object[]>} Array of article data
   */
  async searchArticles(query, filters = {}) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const articles = await this.contentRepo.findAllPublished({
      ...filters,
      search: query.trim(),
    });

    return articles.map((article) => article.toPublicJSON());
  }

  /**
   * Count search results
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise<number>} Number of results
   */
  async countSearchResults(query, filters = {}) {
    if (!query || query.trim().length < 2) {
      return 0;
    }

    return await this.contentRepo.countArticles({
      ...filters,
      search: query.trim(),
    });
  }

  /**
   * Get articles by tags
   * @param {string[]} tags - Tags to filter by
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object[]>} Array of article data
   */
  async getArticlesByTags(tags, filters = {}) {
    const articles = await this.contentRepo.findByTags(tags, filters);
    return articles.map((article) => article.toPublicJSON());
  }

  /**
   * Get related articles for a given article
   * @param {number} articleId - Article ID
   * @param {number} categoryId - Category ID
   * @param {string[]} tags - Article tags
   * @param {number} limit - Number of related articles
   * @returns {Promise<Object[]>} Array of related article data
   */
  async getRelatedArticles(articleId, categoryId, tags, limit = 4) {
    const articles = await this.contentRepo.findRelatedArticles(
      articleId,
      categoryId,
      tags,
      limit
    );
    return articles.map((article) => article.toPublicJSON());
  }

  /**
   * Mark article as helpful
   * @param {number} articleId - Article ID
   * @returns {Promise<Object>} Updated article data with helpful count
   */
  async markArticleHelpful(articleId) {
    await this.contentRepo.incrementHelpful(articleId);
    return await this.getArticleBySlug(
      (await this.contentRepo.findById(articleId)).slug
    );
  }

  /**
   * Get help content statistics
   * @returns {Promise<Object>} Statistics object
   */
  async getHelpStats() {
    const [articleStats, categories] = await Promise.all([
      this.contentRepo.getStats(),
      this.categoryRepo.findAllActive(),
    ]);

    return {
      ...articleStats,
      totalCategories: categories.length,
    };
  }

  /**
   * Create a new article (admin function)
   * @param {Object} articleData - Article data
   * @returns {Promise<Object>} Created article data
   */
  async createArticle(articleData) {
    const articleId = await this.contentRepo.create(articleData);
    return await this.getArticleBySlug(articleData.slug);
  }

  /**
   * Update an article (admin function)
   * @param {number} id - Article ID
   * @param {Object} articleData - Updated article data
   * @returns {Promise<Object>} Updated article data
   */
  async updateArticle(id, articleData) {
    const updated = await this.contentRepo.update(id, articleData);
    if (!updated) {
      const NotFoundError = require('../../../../../shared/utils/errors/NotFoundError');
      throw new NotFoundError('Help article not found');
    }

    // Find the updated article by slug if provided, otherwise by ID
    if (articleData.slug) {
      return await this.getArticleBySlug(articleData.slug);
    } else {
      const article = await this.contentRepo.findById(id);
      return article ? article.toPublicJSON() : null;
    }
  }

  /**
   * Delete an article (admin function)
   * @param {number} id - Article ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteArticle(id) {
    return await this.contentRepo.delete(id);
  }

  /**
   * Create a new category (admin function)
   * @param {Object} categoryData - Category data
   * @returns {Promise<Object>} Created category data
   */
  async createCategory(categoryData) {
    const categoryId = await this.categoryRepo.create(categoryData);
    const category = await this.categoryRepo.findById(categoryId);
    return category ? category.toPublicJSON() : null;
  }

  /**
   * Update a category (admin function)
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<Object>} Updated category data
   */
  async updateCategory(id, categoryData) {
    const updated = await this.categoryRepo.update(id, categoryData);
    if (!updated) {
      const NotFoundError = require('../../../../../shared/utils/errors/NotFoundError');
      throw new NotFoundError('Help category not found');
    }

    const category = await this.categoryRepo.findById(id);
    return category ? category.toPublicJSON() : null;
  }

  /**
   * Delete a category (admin function)
   * @param {number} id - Category ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCategory(id) {
    return await this.categoryRepo.delete(id);
  }
}

module.exports = HelpService;
