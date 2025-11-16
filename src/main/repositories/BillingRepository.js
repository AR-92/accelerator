const BaseRepository = require('../../shared/repositories/BaseRepository');

/**
 * Billing repository for managing transactions and payments
 */
class BillingRepository extends BaseRepository {
  constructor(db) {
    super(db, 'billing');
  }

  /**
   * Find billing records by user ID
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>}
   */
  async findByUserId(userId, options = {}) {
    let sql = `SELECT * FROM ${this.tableName} WHERE user_id = ?`;
    const params = [userId];

    if (options.status) {
      sql += ` AND status = ?`;
      params.push(options.status);
    }

    sql += ` ORDER BY created_at DESC`;

    if (options.limit) {
      sql += ` LIMIT ?`;
      params.push(options.limit);
    }

    if (options.offset) {
      sql += ` OFFSET ?`;
      params.push(options.offset);
    }

    return await this.query(sql, params);
  }

  /**
   * Find billing records by status
   * @param {string} status - Billing status
   * @param {Object} options - Query options
   * @returns {Promise<Array>}
   */
  async findByStatus(status, options = {}) {
    let sql = `SELECT * FROM ${this.tableName} WHERE status = ?`;
    const params = [status];

    sql += ` ORDER BY created_at DESC`;

    if (options.limit) {
      sql += ` LIMIT ?`;
      params.push(options.limit);
    }

    if (options.offset) {
      sql += ` OFFSET ?`;
      params.push(options.offset);
    }

    return await this.query(sql, params);
  }

  /**
   * Get billing statistics
   * @returns {Promise<Object>}
   */
  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'paid' THEN amount_cents / 100.0 ELSE 0 END) as total_revenue,
        SUM(CASE WHEN status = 'refunded' THEN refund_amount / 100.0 ELSE 0 END) as total_refunds,
        AVG(CASE WHEN status = 'paid' THEN amount_cents / 100.0 ELSE NULL END) as avg_transaction,
        COUNT(DISTINCT user_id) as unique_customers,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_transactions,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_transactions
      FROM ${this.tableName}
    `;
    return await this.queryOne(sql);
  }

  /**
   * Get revenue by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>}
   */
  async getRevenueByDateRange(startDate, endDate) {
    const sql = `
      SELECT
        DATE(created_at) as date,
        SUM(CASE WHEN status = 'paid' THEN amount_cents / 100.0 ELSE 0 END) as revenue,
        COUNT(*) as transactions
      FROM ${this.tableName}
      WHERE DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `;
    return await this.query(sql, [startDate, endDate]);
  }

  /**
   * Find transactions by transaction ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>}
   */
  async findByTransactionId(transactionId) {
    const sql = `SELECT * FROM ${this.tableName} WHERE transaction_id = ?`;
    return await this.queryOne(sql, [transactionId]);
  }

  /**
   * Update billing status
   * @param {number} id - Billing record ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data to update
   * @returns {Promise<boolean>}
   */
  async updateStatus(id, status, additionalData = {}) {
    const updateData = { status, ...additionalData };
    if (status === 'paid' && !updateData.processed_at) {
      updateData.processed_at = new Date().toISOString();
    }

    return await this.update(id, updateData);
  }

  /**
   * Process refund
   * @param {number} id - Billing record ID
   * @param {number} refundAmount - Refund amount
   * @param {string} refundReason - Refund reason
   * @returns {Promise<boolean>}
   */
  async processRefund(id, refundAmount, refundReason) {
    const sql = `UPDATE ${this.tableName} SET status = 'refunded', refund_amount = ?, refund_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const result = await this.run(sql, [refundAmount, refundReason, id]);
    return result.changes > 0;
  }

  /**
   * Get recent transactions
   * @param {number} limit - Number of transactions to return
   * @returns {Promise<Array>}
   */
  async getRecentTransactions(limit = 10) {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC LIMIT ?`;
    return await this.query(sql, [limit]);
  }
}

module.exports = BillingRepository;
