/**
 * Corporate repository handling database operations for corporates
 */
const BaseRepository = require('../common/BaseRepository');
const Corporate = require('../../models/Corporate');

class CorporateRepository extends BaseRepository {
  constructor(db) {
    super(db, 'corporates');
  }

  /**
   * Find all corporates with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Array of Corporate instances
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

    if (filters.sector) {
      sql += ' AND sector LIKE ?';
      params.push(`%${filters.sector}%`);
    }

    if (filters.companySize) {
      sql += ' AND company_size = ?';
      params.push(filters.companySize);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
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
    return rows.map((row) => new Corporate(row));
  }

  /**
   * Count corporates with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<number>} Count of corporates
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

    if (filters.sector) {
      sql += ' AND sector LIKE ?';
      params.push(`%${filters.sector}%`);
    }

    if (filters.companySize) {
      sql += ' AND company_size = ?';
      params.push(filters.companySize);
    }

    if (filters.search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.userId) {
      sql += ' AND user_id = ?';
      params.push(filters.userId);
    }

    const result = await this.query(sql, params);
    return result[0].count;
  }

  /**
   * Get corporate by ID
   * @param {number} id - Corporate ID
   * @returns {Promise<Corporate|null>} Corporate instance or null
   */
  async getById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const rows = await this.query(sql, [id]);
    return rows.length > 0 ? new Corporate(rows[0]) : null;
  }

  /**
   * Create a new corporate
   * @param {Object} corporateData - Corporate data
   * @returns {Promise<number>} Created corporate ID
   */
  async create(corporateData) {
    const corporate = new Corporate(corporateData);
    corporate.validate();

    const data = {
      user_id: corporate.userId,
      name: corporate.name,
      description: corporate.description,
      industry: corporate.industry,
      founded_date: corporate.foundedDate,
      website: corporate.website,
      status: corporate.status,
      company_size: corporate.companySize,
      revenue: corporate.revenue,
      location: corporate.location,
      headquarters: corporate.headquarters,
      employee_count: corporate.employeeCount,
      sector: corporate.sector,
    };

    return await super.create(data);
  }

  /**
   * Update a corporate
   * @param {number} id - Corporate ID
   * @param {Object} corporateData - Updated corporate data
   * @returns {Promise<boolean>} Success status
   */
  async update(id, corporateData) {
    const corporate = new Corporate(corporateData);
    corporate.validate();

    const data = {
      name: corporate.name,
      description: corporate.description,
      industry: corporate.industry,
      founded_date: corporate.foundedDate,
      website: corporate.website,
      status: corporate.status,
      company_size: corporate.companySize,
      revenue: corporate.revenue,
      location: corporate.location,
      headquarters: corporate.headquarters,
      employee_count: corporate.employeeCount,
      sector: corporate.sector,
      updated_at: new Date().toISOString(),
    };

    return await super.update(id, data);
  }

  /**
   * Delete a corporate
   * @param {number} id - Corporate ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    return await super.delete(id);
  }

  /**
   * Get corporates by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of Corporate instances
   */
  async getByUserId(userId) {
    const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ? ORDER BY created_at DESC`;
    const rows = await this.query(sql, [userId]);
    return rows.map((row) => new Corporate(row));
  }

  /**
   * Get corporate statistics
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
        COUNT(DISTINCT industry) as industries,
        COUNT(DISTINCT sector) as sectors,
        AVG(employee_count) as avgEmployeeCount,
        SUM(revenue) as totalRevenue
      FROM ${this.tableName}
    `;

    const result = await this.query(sql);
    return result[0];
  }

  /**
   * Count corporates by status
   * @returns {Promise<Object>} Status counts
   */
  async countByStatus() {
    const sql =
      'SELECT status, COUNT(*) as count FROM corporates GROUP BY status';
    const rows = await this.query(sql);
    const result = {};
    rows.forEach((row) => {
      result[row.status] = row.count;
    });
    return result;
  }
}

module.exports = CorporateRepository;
