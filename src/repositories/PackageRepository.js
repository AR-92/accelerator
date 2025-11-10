const BaseRepository = require('./BaseRepository');

/**
 * Package repository for managing credit packages
 */
class PackageRepository extends BaseRepository {
  constructor(db) {
    super(db, 'packages');
  }

  /**
   * Find packages by status
   * @param {string} status - Package status
   * @returns {Promise<Array>}
   */
  async findByStatus(status) {
    const sql = `SELECT * FROM ${this.tableName} WHERE status = ? ORDER BY sort_order ASC, created_at DESC`;
    return await this.query(sql, [status]);
  }

  /**
   * Find active packages
   * @returns {Promise<Array>}
   */
  async findActive() {
    return await this.findByStatus('active');
  }

  /**
   * Update package sort order
   * @param {number} id - Package ID
   * @param {number} sortOrder - New sort order
   * @returns {Promise<boolean>}
   */
  async updateSortOrder(id, sortOrder) {
    const sql = `UPDATE ${this.tableName} SET sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const result = await this.run(sql, [sortOrder, id]);
    return result.changes > 0;
  }

  /**
   * Get packages ordered by sort order
   * @returns {Promise<Array>}
   */
  async findOrdered() {
    const sql = `SELECT * FROM ${this.tableName} WHERE status = 'active' ORDER BY sort_order ASC, created_at DESC`;
    return await this.query(sql);
  }

  /**
   * Search packages
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>}
   */
  async search(searchTerm) {
    const sql = `SELECT * FROM ${this.tableName} WHERE (name LIKE ? OR description LIKE ?) ORDER BY sort_order ASC, created_at DESC`;
    const searchPattern = `%${searchTerm}%`;
    return await this.query(sql, [searchPattern, searchPattern]);
  }

  /**
   * Get package statistics
   * @returns {Promise<Object>}
   */
  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
        SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as archived,
        AVG(price) as avg_price,
        AVG(credits) as avg_credits
      FROM ${this.tableName}
    `;
    return await this.queryOne(sql);
  }
}

module.exports = PackageRepository;
