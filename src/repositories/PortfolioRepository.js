const BaseRepository = require('./BaseRepository');
const Portfolio = require('../models/Portfolio');

/**
 * Portfolio repository for data access operations
 */
class PortfolioRepository extends BaseRepository {
  constructor(db) {
    super(db, 'portfolio');
  }

  /**
   * Find portfolio by ID
   * @param {number} id - Portfolio ID
   * @returns {Promise<Portfolio|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new Portfolio(row) : null;
  }

  /**
   * Find all portfolio items with optional user filter
   * @param {number} userId - Optional user ID filter
   * @param {Object} options - Query options
   * @returns {Promise<Portfolio[]>}
   */
  async findAll(userId = null, options = {}) {
    let sql = 'SELECT * FROM portfolio';
    const params = [];

    if (userId) {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }

    if (options.where && Object.keys(options.where).length > 0) {
      const whereClause = Object.keys(options.where)
        .map((key) => `${key} = ?`)
        .join(' AND ');
      sql += userId ? ` AND ${whereClause}` : ` WHERE ${whereClause}`;
      params.push(...Object.values(options.where));
    }

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY updated_date DESC, created_at DESC';
    }

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
    }

    const rows = await this.query(sql, params);
    return rows.map((row) => new Portfolio(row));
  }

  /**
   * Create a new portfolio item
   * @param {Object} portfolioData - Portfolio data
   * @returns {Promise<number>} Created portfolio ID
   */
  async create(portfolioData) {
    const portfolio = new Portfolio(portfolioData);
    portfolio.validate();

    const data = {
      user_id: portfolio.userId,
      title: portfolio.title,
      description: portfolio.description,
      category: portfolio.category,
      tags: JSON.stringify(portfolio.tags),
      votes: portfolio.votes,
      is_public: portfolio.isPublic,
      image: portfolio.image,
      created_date: portfolio.createdDate.toISOString(),
      updated_date: portfolio.updatedDate.toISOString(),
    };

    return await super.create(data);
  }

  /**
   * Update a portfolio item
   * @param {number} id - Portfolio ID
   * @param {Object} portfolioData - Updated portfolio data
   * @returns {Promise<boolean>}
   */
  async update(id, portfolioData) {
    const portfolio = new Portfolio(portfolioData);
    portfolio.validate();

    const data = {};
    if (portfolio.title) data.title = portfolio.title;
    if (portfolio.description !== undefined)
      data.description = portfolio.description;
    if (portfolio.category) data.category = portfolio.category;
    if (portfolio.tags) data.tags = JSON.stringify(portfolio.tags);
    if (portfolio.isPublic !== undefined) data.is_public = portfolio.isPublic;
    if (portfolio.image !== undefined) data.image = portfolio.image;
    data.updated_date = new Date().toISOString();
    data.updated_at = new Date().toISOString();

    return await super.update(id, data);
  }

  /**
   * Find portfolio items by category
   * @param {string} category - Portfolio category
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Portfolio[]>}
   */
  async findByCategory(category, userId = null) {
    let sql = 'SELECT * FROM portfolio WHERE category = ?';
    const params = [category];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY updated_date DESC, created_at DESC';

    const rows = await this.query(sql, params);
    return rows.map((row) => new Portfolio(row));
  }

  /**
   * Find portfolio items by tags
   * @param {string[]} tags - Tags to search for
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Portfolio[]>}
   */
  async findByTags(tags, userId = null) {
    let sql = 'SELECT * FROM portfolio WHERE ';
    const params = [];

    const tagConditions = tags.map(() => 'tags LIKE ?').join(' OR ');
    sql += `(${tagConditions})`;

    tags.forEach((tag) => {
      params.push(`%${tag}%`);
    });

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY updated_date DESC, created_at DESC';

    const rows = await this.query(sql, params);
    return rows.map((row) => new Portfolio(row));
  }

  /**
   * Find public portfolio items
   * @param {Object} options - Query options
   * @returns {Promise<Portfolio[]>}
   */
  async findPublic(options = {}) {
    const where = { is_public: 1 };
    return await this.findAll(null, { ...options, where });
  }

  /**
   * Increment votes for a portfolio item
   * @param {number} id - Portfolio ID
   * @returns {Promise<boolean>}
   */
  async incrementVotes(id) {
    const sql =
      'UPDATE portfolio SET votes = votes + 1, updated_date = ?, updated_at = ? WHERE id = ?';
    const params = [new Date().toISOString(), new Date().toISOString(), id];
    const result = await this.run(sql, params);
    return result.changes > 0;
  }

  /**
   * Decrement votes for a portfolio item
   * @param {number} id - Portfolio ID
   * @returns {Promise<boolean>}
   */
  async decrementVotes(id) {
    const sql =
      'UPDATE portfolio SET votes = CASE WHEN votes > 0 THEN votes - 1 ELSE 0 END, updated_date = ?, updated_at = ? WHERE id = ?';
    const params = [new Date().toISOString(), new Date().toISOString(), id];
    const result = await this.run(sql, params);
    return result.changes > 0;
  }

  /**
   * Search portfolio items by title or description
   * @param {string} query - Search query
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Portfolio[]>}
   */
  async search(query, userId = null) {
    const searchTerm = `%${query}%`;
    let sql =
      'SELECT * FROM portfolio WHERE (title LIKE ? OR description LIKE ?)';
    const params = [searchTerm, searchTerm];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY updated_date DESC, created_at DESC';

    const rows = await this.query(sql, params);
    return rows.map((row) => new Portfolio(row));
  }
}

module.exports = PortfolioRepository;
