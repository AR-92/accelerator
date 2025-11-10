/**
 * Enterprise repository handling database operations for enterprises
 */
const BaseRepository = require('../common/BaseRepository');
const Enterprise = require('../../models/Enterprise');

class EnterpriseRepository extends BaseRepository {
  constructor(db) {
    super(db, 'enterprises');
  }

  /**
   * Find all enterprises with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of Enterprise instances
   */
  async findAllFiltered(filters = {}) {
    let sql = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const params = [];

    if (filters.industry) {
      sql += ' AND industry LIKE ?';
      params.push(`%${filters.industry}%`);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.companySize) {
      sql += ' AND company_size = ?';
      params.push(filters.companySize);
    }

    if (filters.userId) {
      sql += ' AND user_id = ?';
      params.push(filters.userId);
    }

    // Sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ${sortBy} ${sortOrder}`;

    // Pagination
    if (filters.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
    }

    if (filters.offset) {
      sql += ' OFFSET ?';
      params.push(filters.offset);
    }

    const rows = await this.query(sql, params);
    return rows.map((row) => new Enterprise(row));
  }

  /**
   * Count enterprises with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Count of enterprises
   */
  async countFiltered(filters = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE 1=1`;
    const params = [];

    if (filters.industry) {
      sql += ' AND industry LIKE ?';
      params.push(`%${filters.industry}%`);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.companySize) {
      sql += ' AND company_size = ?';
      params.push(filters.companySize);
    }

    if (filters.userId) {
      sql += ' AND user_id = ?';
      params.push(filters.userId);
    }

    const result = await this.query(sql, params);
    return result[0].count;
  }

  /**
   * Get enterprise by ID
   * @param {number} id - Enterprise ID
   * @returns {Promise<Enterprise|null>} Enterprise instance or null
   */
  async getById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const rows = await this.query(sql, [id]);
    return rows.length > 0 ? new Enterprise(rows[0]) : null;
  }

  /**
   * Create a new enterprise
   * @param {Object} enterpriseData - Enterprise data
   * @returns {Promise<number>} Created enterprise ID
   */
  async create(enterpriseData) {
    const enterprise = new Enterprise(enterpriseData);
    enterprise.validate();

    const data = {
      user_id: enterprise.userId,
      name: enterprise.name,
      description: enterprise.description,
      industry: enterprise.industry,
      founded_date: enterprise.foundedDate,
      website: enterprise.website,
      status: enterprise.status,
      company_size: enterprise.companySize,
      revenue: enterprise.revenue,
      location: enterprise.location,
    };

    return await super.create(data);
  }

  /**
   * Update an enterprise
   * @param {number} id - Enterprise ID
   * @param {Object} enterpriseData - Updated enterprise data
   * @returns {Promise<boolean>} Success status
   */
  async update(id, enterpriseData) {
    const enterprise = new Enterprise(enterpriseData);
    enterprise.validate();

    const data = {
      name: enterprise.name,
      description: enterprise.description,
      industry: enterprise.industry,
      founded_date: enterprise.foundedDate,
      website: enterprise.website,
      status: enterprise.status,
      company_size: enterprise.companySize,
      revenue: enterprise.revenue,
      location: enterprise.location,
      updated_at: new Date().toISOString(),
    };

    return await super.update(id, data);
  }

  /**
   * Delete an enterprise
   * @param {number} id - Enterprise ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    return await super.delete(id);
  }

  /**
   * Get enterprises by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of Enterprise instances
   */
  async getByUserId(userId) {
    const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ? ORDER BY created_at DESC`;
    const rows = await this.query(sql, [userId]);
    return rows.map((row) => new Enterprise(row));
  }

  /**
   * Get enterprise statistics
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics() {
    const sql = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
        SUM(CASE WHEN status = 'acquired' THEN 1 ELSE 0 END) as acquired,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
        COUNT(DISTINCT industry) as industries
      FROM ${this.tableName}
    `;

    const result = await this.query(sql);
    return result[0];
  }

  /**
   * Count enterprises by status
   * @returns {Promise<Object>} Status counts
   */
  async countByStatus() {
    const sql =
      'SELECT status, COUNT(*) as count FROM enterprises GROUP BY status';
    const rows = await this.query(sql);
    const result = {};
    rows.forEach((row) => {
      result[row.status] = row.count;
    });
    return result;
  }
}

module.exports = EnterpriseRepository;
