const BaseRepository = require('../common/BaseRepository');
const Idea = require('../../models/idea/Idea');

/**
 * Idea repository for data access operations
 */
class IdeaRepository extends BaseRepository {
  constructor(db) {
    super(db, 'ideas');
  }

  /**
   * Find idea by href
   * @param {string} href - Idea href
   * @returns {Promise<Idea|null>}
   */
  async findByHref(href) {
    const sql = 'SELECT * FROM ideas WHERE href = ?';
    const row = await this.queryOne(sql, [href]);
    return row ? new Idea(row) : null;
  }

  /**
   * Find idea by ID
   * @param {number} id - Idea ID
   * @returns {Promise<Idea|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new Idea(row) : null;
  }

  /**
   * Find all ideas with optional user filter
   * @param {number} userId - Optional user ID filter
   * @param {Object} options - Query options
   * @returns {Promise<Idea[]>}
   */
  async findAll(userId = null, options = {}) {
    let sql = 'SELECT * FROM ideas';
    const params = [];
    const conditions = [];

    if (userId) {
      conditions.push('user_id = ?');
      params.push(userId);
    }

    if (options.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${options.search}%`, `%${options.search}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY rating DESC, created_at DESC';
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
    return rows.map((row) => new Idea(row));
  }

  /**
   * Count ideas with optional filters
   * @param {number} userId - Optional user ID filter
   * @param {Object} options - Query options
   * @returns {Promise<number>}
   */
  async count(userId = null, options = {}) {
    let sql = 'SELECT COUNT(*) as count FROM ideas';
    const params = [];
    const conditions = [];

    if (userId) {
      conditions.push('user_id = ?');
      params.push(userId);
    }

    if (options.search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${options.search}%`, `%${options.search}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    const result = await this.queryOne(sql, params);
    return result.count;
  }

  /**
   * Create a new idea
   * @param {Object} ideaData - Idea data
   * @returns {Promise<number>} Created idea ID
   */
  async create(ideaData) {
    const idea = new Idea(ideaData);
    idea.validate();

    const data = {
      user_id: idea.userId,
      href: idea.href,
      title: idea.title,
      type: idea.type,
      typeIcon: idea.typeIcon,
      rating: idea.rating,
      description: idea.description,
      tags: JSON.stringify(idea.tags),
      is_favorite: idea.isFavorite,
    };

    return await super.create(data);
  }

  /**
   * Update an idea
   * @param {number} id - Idea ID
   * @param {Object} ideaData - Updated idea data
   * @returns {Promise<boolean>}
   */
  async update(id, ideaData) {
    const idea = new Idea(ideaData);
    idea.validate();

    const data = {};
    if (idea.title) data.title = idea.title;
    if (idea.type) data.type = idea.type;
    if (idea.typeIcon) data.typeIcon = idea.typeIcon;
    if (idea.rating !== undefined) data.rating = idea.rating;
    if (idea.description !== undefined) data.description = idea.description;
    if (idea.tags) data.tags = JSON.stringify(idea.tags);
    if (idea.isFavorite !== undefined) data.is_favorite = idea.isFavorite;
    data.updated_at = new Date().toISOString();

    return await super.update(id, data);
  }

  /**
   * Find ideas by tags
   * @param {string[]} tags - Tags to search for
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Idea[]>}
   */
  async findByTags(tags, userId = null) {
    let sql = 'SELECT * FROM ideas WHERE ';
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

    sql += ' ORDER BY rating DESC, created_at DESC';

    const rows = await this.query(sql, params);
    return rows.map((row) => new Idea(row));
  }

  /**
   * Find ideas by type
   * @param {string} type - Idea type
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Idea[]>}
   */
  async findByType(type, userId = null) {
    let sql = 'SELECT * FROM ideas WHERE type = ?';
    const params = [type];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY rating DESC, created_at DESC';

    const rows = await this.query(sql, params);
    return rows.map((row) => new Idea(row));
  }

  /**
   * Toggle favorite status
   * @param {number} id - Idea ID
   * @returns {Promise<boolean>}
   */
  async toggleFavorite(id) {
    const idea = await this.findById(id);
    if (!idea) return false;

    const data = {
      is_favorite: !idea.isFavorite,
      updated_at: new Date().toISOString(),
    };

    return await super.update(id, data);
  }

  /**
   * Search ideas by title or description
   * @param {string} query - Search query
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Idea[]>}
   */
  async search(query, userId = null) {
    const searchTerm = `%${query}%`;
    let sql = 'SELECT * FROM ideas WHERE (title LIKE ? OR description LIKE ?)';
    const params = [searchTerm, searchTerm];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY rating DESC, created_at DESC';

    const rows = await this.query(sql, params);
    return rows.map((row) => new Idea(row));
  }
}

module.exports = IdeaRepository;
