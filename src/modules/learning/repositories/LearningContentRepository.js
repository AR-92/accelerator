const BaseRepository = require('../../../../src/shared/repositories/BaseRepository');
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
      'SELECT * FROM learning_articles WHERE slug = ? AND is_published = true';
    const row = await this.queryOne(sql, [slug]);
    return row ? new LearningContent(row) : null;
  }

  /**
   * Find all articles (including unpublished for admin)
   * @param {Object} options - Query options
   * @returns {Promise<LearningContent[]>}
   */
  async findAll(options = {}) {
    let sql =
      'SELECT la.*, lc.name as category_name, lc.slug as category_slug FROM learning_articles la LEFT JOIN learning_categories lc ON la.category_id = lc.id WHERE 1=1';
    const params = [];

    if (options.categoryId) {
      sql += ' AND la.category_id = ?';
      params.push(options.categoryId);
    }

    if (options.search) {
      sql += ' AND (la.title LIKE ? OR la.content LIKE ? OR la.excerpt LIKE ?)';
      const searchTerm = `%${options.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY la.created_at DESC';

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
    }

    if (options.offset) {
      sql += ' OFFSET ?';
      params.push(options.offset);
    }

    const rows = await this.query(sql, params);
    return rows.map((row) => {
      const article = new LearningContent(row);
      article.category = { name: row.category_name, slug: row.category_slug };
      return article;
    });
  }

  /**
   * Find all published articles
   * @param {Object} options - Query options
   * @returns {Promise<LearningContent[]>}
   */
  async findAllPublished(options = {}) {
    let sql =
      'SELECT la.*, lc.name as category_name, lc.slug as category_slug FROM learning_articles la LEFT JOIN learning_categories lc ON la.category_id = lc.id WHERE la.is_published = true';
    const params = [];

    if (options.categoryId) {
      sql += ' AND la.category_id = ?';
      params.push(options.categoryId);
    }

    if (options.difficultyLevel) {
      sql += ' AND la.difficulty_level = ?';
      params.push(options.difficultyLevel);
    }

    if (options.search) {
      sql += ' AND (la.title LIKE ? OR la.content LIKE ? OR la.excerpt LIKE ?)';
      const searchTerm = `%${options.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (options.featured) {
      sql += ' AND la.is_featured = ?';
      params.push(1);
    }

    sql += ' ORDER BY la.created_at DESC';

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
    }

    if (options.offset) {
      sql += ' OFFSET ?';
      params.push(options.offset);
    }

    const rows = await this.query(sql, params);
    return rows.map((row) => {
      const article = new LearningContent(row);
      article.category = { name: row.category_name, slug: row.category_slug };
      return article;
    });
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
    let sql = 'SELECT * FROM learning_articles WHERE is_published = true AND (';
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
   * Count articles matching filters
   * @param {Object} options - Query options
   * @returns {Promise<number>} Number of articles
   */
  async countArticles(options = {}) {
    let sql = 'SELECT COUNT(*) as count FROM learning_articles WHERE 1=1';
    const params = [];

    if (!options.includeUnpublished) {
      sql += ' AND is_published = true';
    }

    if (options.categoryId) {
      sql += ' AND category_id = ?';
      params.push(options.categoryId);
    }

    if (options.difficultyLevel) {
      sql += ' AND difficulty_level = ?';
      params.push(options.difficultyLevel);
    }

    if (options.search) {
      sql += ' AND (la.title LIKE ? OR la.content LIKE ? OR la.excerpt LIKE ?)';
      const searchTerm = `%${options.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const row = await this.queryOne(sql, params);
    return row.count || 0;
  }

  /**
   * Find related articles based on category and tags
   * @param {number} articleId - Current article ID
   * @param {number} categoryId - Category ID
   * @param {string[]} tags - Article tags
   * @param {number} limit - Number of related articles to return
   * @returns {Promise<LearningContent[]>}
   */
  async findRelatedArticles(articleId, categoryId, tags, limit = 4) {
    // First try to find articles in the same category
    let sql = `
       SELECT * FROM learning_articles
       WHERE is_published = true AND id != ? AND category_id = ?
       ORDER BY is_featured DESC, view_count DESC
       LIMIT ?
     `;

    let params = [articleId, categoryId, limit];
    let rows = await this.query(sql, params);

    // If we don't have enough articles in the same category, add articles with similar tags
    if (rows.length < limit && tags.length > 0) {
      const remaining = limit - rows.length;
      const tagConditions = tags.map(() => 'tags LIKE ?').join(' OR ');
      sql = `
         SELECT * FROM learning_articles
         WHERE is_published = true AND id != ? AND category_id != ? AND (${tagConditions})
         ORDER BY is_featured DESC, view_count DESC
         LIMIT ?
       `;

      params = [
        articleId,
        categoryId,
        ...tags.map((tag) => `%${tag}%`),
        remaining,
      ];
      const tagRows = await this.query(sql, params);
      rows = rows.concat(tagRows);
    }

    // If still not enough, add featured articles from other categories
    if (rows.length < limit) {
      const remaining = limit - rows.length;
      sql = `
         SELECT * FROM learning_articles
         WHERE is_published = true AND id != ? AND is_featured = true
         ORDER BY view_count DESC
         LIMIT ?
       `;

      params = [articleId, remaining];
      const featuredRows = await this.query(sql, params);
      rows = rows.concat(featuredRows);
    }

    // Remove duplicates and limit to the requested number
    const uniqueRows = rows
      .filter(
        (article, index, self) =>
          index === self.findIndex((a) => a.id === article.id)
      )
      .slice(0, limit);

    return uniqueRows.map((row) => new LearningContent(row));
  }

  /**
   * Get user progress for an article
   * @param {number} userId - User ID
   * @param {number} articleId - Article ID
   * @returns {Promise<Object|null>} Progress data or null
   */
  async getUserProgress(userId, articleId) {
    const sql = `
       SELECT * FROM user_learning_progress
       WHERE user_id = ? AND article_id = ?
     `;
    return await this.queryOne(sql, [userId, articleId]);
  }

  /**
   * Update or create user progress for an article
   * @param {number} userId - User ID
   * @param {number} articleId - Article ID
   * @param {Object} progressData - Progress data
   * @returns {Promise<boolean>} Success status
   */
  async updateUserProgress(userId, articleId, progressData) {
    const existing = await this.getUserProgress(userId, articleId);

    if (existing) {
      // Update existing progress
      const sql = `
         UPDATE user_learning_progress
         SET progress_percentage = ?, time_spent_seconds = ?, last_read_at = ?, completed_at = ?
         WHERE user_id = ? AND article_id = ?
       `;
      const params = [
        progressData.progressPercentage || existing.progress_percentage,
        (existing.time_spent_seconds || 0) +
          (progressData.timeSpentSeconds || 0),
        new Date().toISOString(),
        progressData.isCompleted
          ? new Date().toISOString()
          : existing.completed_at,
        userId,
        articleId,
      ];
      const result = await this.run(sql, params);
      return result.changes > 0;
    } else {
      // Create new progress record
      const sql = `
         INSERT INTO user_learning_progress
         (user_id, article_id, progress_percentage, time_spent_seconds, is_completed, last_read_at, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
       `;
      const params = [
        userId,
        articleId,
        progressData.progressPercentage || 0,
        progressData.timeSpentSeconds || 0,
        progressData.isCompleted || false,
        new Date().toISOString(),
        progressData.isCompleted ? new Date().toISOString() : null,
      ];
      const result = await this.run(sql, params);
      return result.lastID > 0;
    }
  }

  /**
   * Get all user progress for learning articles
   * @param {number} userId - User ID
   * @returns {Promise<Object[]>} Array of progress data
   */
  async getUserLearningProgress(userId) {
    const sql = `
       SELECT
         ulp.*,
         la.title,
         la.slug,
         la.read_time_minutes,
         lc.name as category_name,
         lc.slug as category_slug
       FROM user_learning_progress ulp
       JOIN learning_articles la ON ulp.article_id = la.id
       JOIN learning_categories lc ON la.category_id = lc.id
       WHERE ulp.user_id = ?
       ORDER BY ulp.last_read_at DESC
     `;
    const rows = await this.query(sql, [userId]);
    return rows;
  }

  /**
   * Mark article as completed for user
   * @param {number} userId - User ID
   * @param {number} articleId - Article ID
   * @returns {Promise<boolean>} Success status
   */
  async markArticleCompleted(userId, articleId) {
    return await this.updateUserProgress(userId, articleId, {
      progressPercentage: 100,
      isCompleted: true,
    });
  }

  /**
   * Check if user liked an article
   * @param {number} userId - User ID
   * @param {number} articleId - Article ID
   * @returns {Promise<boolean>} Whether user liked the article
   */
  async hasUserLiked(userId, articleId) {
    const sql =
      'SELECT id FROM article_likes WHERE user_id = ? AND article_id = ?';
    const result = await this.queryOne(sql, [userId, articleId]);
    return !!result;
  }

  /**
   * Add like to article
   * @param {number} userId - User ID
   * @param {number} articleId - Article ID
   * @returns {Promise<boolean>} Success status
   */
  async addLike(userId, articleId) {
    // Check if already liked
    if (await this.hasUserLiked(userId, articleId)) {
      return true; // Already liked
    }

    // Add like record
    const sql = 'INSERT INTO article_likes (user_id, article_id) VALUES (?, ?)';
    const result = await this.run(sql, [userId, articleId]);

    // Increment like count
    await this.incrementLikes(articleId);

    return result.lastID > 0;
  }

  /**
   * Remove like from article
   * @param {number} userId - User ID
   * @param {number} articleId - Article ID
   * @returns {Promise<boolean>} Success status
   */
  async removeLike(userId, articleId) {
    // Remove like record
    const sql =
      'DELETE FROM article_likes WHERE user_id = ? AND article_id = ?';
    const result = await this.run(sql, [userId, articleId]);

    // Decrement like count
    await this.decrementLikes(articleId);

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
         COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_articles,
         SUM(view_count) as total_views,
         SUM(like_count) as total_likes,
         AVG(read_time_minutes) as avg_read_time
       FROM learning_articles
       WHERE is_published = true
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

module.exports = LearningContentRepository;
