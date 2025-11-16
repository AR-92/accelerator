const BaseRepository = require('../../../shared/repositories/BaseRepository');
const Startup = require('../models/Startup');

/**
 * Startup repository for data access operations
 */
class StartupRepository extends BaseRepository {
  constructor(db) {
    super(db, 'startups');
  }

  /**
   * Find startup by ID
   * @param {number} id - Startup ID
   * @returns {Promise<Startup|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new Startup(row) : null;
  }

  /**
   * Find all startups with optional user filter
   * @param {number} userId - Optional user ID filter
   * @param {Object} options - Query options
   * @returns {Promise<Startup[]>}
   */
  async findAll(userId = null, options = {}) {
    let sql = 'SELECT * FROM startups';
    const params = [];

    if (userId) {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY created_at DESC';
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
    return rows.map((row) => new Startup(row));
  }

  /**
   * Create a new startup
   * @param {Object} startupData - Startup data
   * @returns {Promise<number>} Created startup ID
   */
  async create(startupData) {
    const startup = new Startup(startupData);
    startup.validate();

    const data = {
      user_id: startup.userId,
      name: startup.name,
      description: startup.description,
      industry: startup.industry,
      founded_date: startup.foundedDate,
      website: startup.website,
      status: startup.status,
    };

    return await super.create(data);
  }

  /**
   * Update a startup
   * @param {number} id - Startup ID
   * @param {Object} startupData - Updated startup data
   * @returns {Promise<boolean>}
   */
  async update(id, startupData) {
    const startup = new Startup(startupData);
    startup.validate();

    const data = {};
    if (startup.name) data.name = startup.name;
    if (startup.description !== undefined)
      data.description = startup.description;
    if (startup.industry) data.industry = startup.industry;
    if (startup.foundedDate !== undefined)
      data.founded_date = startup.foundedDate;
    if (startup.website !== undefined) data.website = startup.website;
    if (startup.status) data.status = startup.status;
    data.updated_at = new Date().toISOString();

    return await super.update(id, data);
  }

  /**
   * Find startups by industry
   * @param {string} industry - Industry
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Startup[]>}
   */
  async findByIndustry(industry, userId = null) {
    let sql = 'SELECT * FROM startups WHERE industry = ?';
    const params = [industry];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await this.query(sql, params);
    return rows.map((row) => new Startup(row));
  }

  /**
   * Find startups by status
   * @param {string} status - Status
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Startup[]>}
   */
  async findByStatus(status, userId = null) {
    let sql = 'SELECT * FROM startups WHERE status = ?';
    const params = [status];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await this.query(sql, params);
    return rows.map((row) => new Startup(row));
  }

  /**
   * Search startups by name or description
   * @param {string} query - Search query
   * @param {number} userId - Optional user ID filter
   * @returns {Promise<Startup[]>}
   */
  async search(query, userId = null) {
    const searchTerm = `%${query}%`;
    let sql =
      'SELECT * FROM startups WHERE (name LIKE ? OR description LIKE ?)';
    const params = [searchTerm, searchTerm];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await this.query(sql, params);
    return rows.map((row) => new Startup(row));
  }

  /**
   * Count startups by status
   * @returns {Promise<Object>} Status counts
   */
  async countByStatus() {
    const sql = 'SELECT stage, COUNT(*) as count FROM startups GROUP BY stage';
    const rows = await this.query(sql);
    const result = {};
    rows.forEach((row) => {
      result[row.stage] = row.count;
    });
    return result;
  }

  /**
   * Get startups with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Startup[]>}
   */
  async findAllFiltered(options = {}) {
    const {
      limit = 20,
      offset = 0,
      industry,
      status,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
      userId,
    } = options;

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = [
      'id',
      'name',
      'industry',
      'status',
      'founded_date',
      'created_at',
      'updated_at',
    ];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    let sql = 'SELECT * FROM startups WHERE 1=1';
    const params = [];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    if (industry) {
      sql += ' AND industry = ?';
      params.push(industry);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ` ORDER BY ${validSortBy} ${validSortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const rows = await this.query(sql, params);
    return rows.map((row) => new Startup(row));
  }

  /**
   * Count startups with filtering
   * @param {Object} options - Filter options
   * @returns {Promise<number>}
   */
  async countFiltered(options = {}) {
    const { industry, status, search, userId } = options;

    let sql = 'SELECT COUNT(*) as count FROM startups WHERE 1=1';
    const params = [];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    if (industry) {
      sql += ' AND industry = ?';
      params.push(industry);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    const result = await this.queryOne(sql, params);
    return result.count;
  }
}

module.exports = StartupRepository;
