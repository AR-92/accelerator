const BaseRepository = require('./BaseRepository');
const LearningContent = require('../models/LearningContent');
const LearningCategory = require('../models/LearningCategory');

/**
 * Learning Content repository for data access operations
 */
class LearningContentRepository extends BaseRepository {
  constructor(db) {
    super(db, 'learning_articles');
  }

  /**
   * Find article by ID
   * @param {number} id - Article ID
   * @returns {Promise<LearningContent|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new LearningContent(row) : null;
  }

  /**
   * Find article by slug
   * @param {string} slug - Article slug
   * @returns {Promise<LearningContent|null>}
   */
  async findBySlug(slug) {
    const sql =
      'SELECT * FROM learning_articles WHERE slug = ? AND is_published = 1';
    const row = await this.queryOne(sql, [slug]);
    return row ? new LearningContent(row) : null;
  }

  /**
   * Find all published articles
   * @param {Object} options - Query options
   * @returns {Promise<LearningContent[]>}
   */
  async findAllPublished(options = {}) {
    let sql = 'SELECT * FROM learning_articles WHERE is_published = 1';
    const params = [];

    if (options.categoryId) {
      sql += ' AND category_id = ?';
      params.push(options.categoryId);
    }

    if (options.difficultyLevel) {
      sql += ' AND difficulty_level = ?';
      params.push(options.difficultyLevel);
    }

    if (options.featured !== undefined) {
      sql += ' AND is_featured = ?';
      params.push(options.featured ? 1 : 0);
    }

    if (options.search) {
      sql += ' AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)';
      const searchTerm = `%${options.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY is_featured DESC, created_at DESC';
    }

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
    }

    if (options.offset) {
      sql += ' OFFSET ?';
      params.push(options.offset);
    }

    const rows = await this.query(sql, params);
    return rows.map((row) => new LearningContent(row));
  }

  /**
   * Find articles by category
   * @param {number} categoryId - Category ID
   * @param {Object} options - Query options
   * @returns {Promise<LearningContent[]>}
   */
  async findByCategory(categoryId, options = {}) {
    return await this.findAllPublished({ ...options, categoryId });
  }

  /**
   * Find featured articles
   * @param {number} limit - Number of articles to return
   * @returns {Promise<LearningContent[]>}
   */
  async findFeatured(limit = 6) {
    return await this.findAllPublished({ featured: true, limit });
  }

  /**
   * Find articles by tags
   * @param {string[]} tags - Tags to search for
   * @param {Object} options - Query options
   * @returns {Promise<LearningContent[]>}
   */
  async findByTags(tags, options = {}) {
    let sql = 'SELECT * FROM learning_articles WHERE is_published = 1 AND (';
    const params = [];

    const tagConditions = tags.map(() => 'tags LIKE ?').join(' OR ');
    sql += `${tagConditions})`;

    tags.forEach((tag) => {
      params.push(`%${tag}%`);
    });

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY created_at DESC';
    }

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
    }

    const rows = await this.query(sql, params);
    return rows.map((row) => new LearningContent(row));
  }

  /**
   * Create a new article
   * @param {Object} articleData - Article data
   * @returns {Promise<number>} Created article ID
   */
  async create(articleData) {
    const article = new LearningContent(articleData);
    article.validate();

    const data = {
      category_id: article.categoryId,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featured_image: article.featuredImage,
      read_time_minutes: article.readTimeMinutes,
      difficulty_level: article.difficultyLevel,
      tags: JSON.stringify(article.tags),
      is_featured: article.isFeatured,
      is_published: article.isPublished,
      author_name: article.authorName,
      author_bio: article.authorBio,
      author_image: article.authorImage,
      seo_title: article.seoTitle,
      seo_description: article.seoDescription,
      seo_keywords: article.seoKeywords,
    };

    return await super.create(data);
  }

  /**
   * Update an article
   * @param {number} id - Article ID
   * @param {Object} articleData - Updated article data
   * @returns {Promise<boolean>}
   */
  async update(id, articleData) {
    const article = new LearningContent(articleData);
    article.validate();

    const data = {};
    if (article.categoryId !== undefined) data.category_id = article.categoryId;
    if (article.title) data.title = article.title;
    if (article.slug) data.slug = article.slug;
    if (article.excerpt !== undefined) data.excerpt = article.excerpt;
    if (article.content) data.content = article.content;
    if (article.featuredImage !== undefined)
      data.featured_image = article.featuredImage;
    if (article.readTimeMinutes !== undefined)
      data.read_time_minutes = article.readTimeMinutes;
    if (article.difficultyLevel)
      data.difficulty_level = article.difficultyLevel;
    if (article.tags) data.tags = JSON.stringify(article.tags);
    if (article.isFeatured !== undefined) data.is_featured = article.isFeatured;
    if (article.isPublished !== undefined)
      data.is_published = article.isPublished;
    if (article.authorName !== undefined) data.author_name = article.authorName;
    if (article.authorBio !== undefined) data.author_bio = article.authorBio;
    if (article.authorImage !== undefined)
      data.author_image = article.authorImage;
    if (article.seoTitle !== undefined) data.seo_title = article.seoTitle;
    if (article.seoDescription !== undefined)
      data.seo_description = article.seoDescription;
    if (article.seoKeywords !== undefined)
      data.seo_keywords = article.seoKeywords;
    data.updated_at = new Date().toISOString();

    return await super.update(id, data);
  }

  /**
   * Increment view count
   * @param {number} id - Article ID
   * @returns {Promise<boolean>}
   */
  async incrementViews(id) {
    const sql =
      'UPDATE learning_articles SET view_count = view_count + 1, updated_at = ? WHERE id = ?';
    const params = [new Date().toISOString(), id];
    const result = await this.run(sql, params);
    return result.changes > 0;
  }

  /**
   * Increment like count
   * @param {number} id - Article ID
   * @returns {Promise<boolean>}
   */
  async incrementLikes(id) {
    const sql =
      'UPDATE learning_articles SET like_count = like_count + 1, updated_at = ? WHERE id = ?';
    const params = [new Date().toISOString(), id];
    const result = await this.run(sql, params);
    return result.changes > 0;
  }

  /**
   * Decrement like count
   * @param {number} id - Article ID
   * @returns {Promise<boolean>}
   */
  async decrementLikes(id) {
    const sql =
      'UPDATE learning_articles SET like_count = CASE WHEN like_count > 0 THEN like_count - 1 ELSE 0 END, updated_at = ? WHERE id = ?';
    const params = [new Date().toISOString(), id];
    const result = await this.run(sql, params);
    return result.changes > 0;
  }

  /**
   * Get article statistics
   * @returns {Promise<Object>} Statistics object
   */
  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total_articles,
        COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_articles,
        SUM(view_count) as total_views,
        SUM(like_count) as total_likes,
        AVG(read_time_minutes) as avg_read_time
      FROM learning_articles
      WHERE is_published = 1
    `;

    const result = await this.queryOne(sql);
    return {
      totalArticles: result.total_articles || 0,
      featuredArticles: result.featured_articles || 0,
      totalViews: result.total_views || 0,
      totalLikes: result.total_likes || 0,
      avgReadTime: Math.round(result.avg_read_time || 0),
    };
  }
}

/**
 * Learning Category repository
 */
class LearningCategoryRepository extends BaseRepository {
  constructor(db) {
    super(db, 'learning_categories');
  }

  /**
   * Find category by ID
   * @param {number} id - Category ID
   * @returns {Promise<LearningCategory|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new LearningCategory(row) : null;
  }

  /**
   * Find category by slug
   * @param {string} slug - Category slug
   * @returns {Promise<LearningCategory|null>}
   */
  async findBySlug(slug) {
    const sql =
      'SELECT * FROM learning_categories WHERE slug = ? AND is_active = 1';
    const row = await this.queryOne(sql, [slug]);
    return row ? new LearningCategory(row) : null;
  }

  /**
   * Find all active categories
   * @param {Object} options - Query options
   * @returns {Promise<LearningCategory[]>}
   */
  async findAllActive(options = {}) {
    let sql = 'SELECT * FROM learning_categories WHERE is_active = 1';
    const params = [];

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY sort_order ASC, name ASC';
    }

    const rows = await this.query(sql, params);
    return rows.map((row) => new LearningCategory(row));
  }

  /**
   * Create a new category
   * @param {Object} categoryData - Category data
   * @returns {Promise<number>} Created category ID
   */
  async create(categoryData) {
    const category = new LearningCategory(categoryData);
    category.validate();

    const data = {
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      sort_order: category.sortOrder,
      is_active: category.isActive,
    };

    return await super.create(data);
  }

  /**
   * Update a category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise<boolean>}
   */
  async update(id, categoryData) {
    const category = new LearningCategory(categoryData);
    category.validate();

    const data = {};
    if (category.name) data.name = category.name;
    if (category.slug) data.slug = category.slug;
    if (category.description !== undefined)
      data.description = category.description;
    if (category.icon !== undefined) data.icon = category.icon;
    if (category.color) data.color = category.color;
    if (category.sortOrder !== undefined) data.sort_order = category.sortOrder;
    if (category.isActive !== undefined) data.is_active = category.isActive;
    data.updated_at = new Date().toISOString();

    return await super.update(id, data);
  }
}

module.exports = {
  LearningContentRepository,
  LearningCategoryRepository,
};
