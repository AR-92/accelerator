const BaseRepository = require('../common/BaseRepository');

/**
 * Reward repository for managing user rewards and achievements
 */
class RewardRepository extends BaseRepository {
  constructor(db) {
    super(db, 'rewards');
  }

  /**
   * Find rewards by user ID
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

    if (options.type) {
      sql += ` AND type = ?`;
      params.push(options.type);
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
   * Find active rewards for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>}
   */
  async findActiveByUserId(userId) {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = ? AND status = 'active'
        AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      ORDER BY created_at DESC
    `;
    return await this.query(sql, [userId]);
  }

  /**
   * Find rewards by type
   * @param {string} type - Reward type
   * @param {Object} options - Query options
   * @returns {Promise<Array>}
   */
  async findByType(type, options = {}) {
    let sql = `SELECT * FROM ${this.tableName} WHERE type = ?`;
    const params = [type];

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
   * Get reward statistics
   * @returns {Promise<Object>}
   */
  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total_rewards,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_rewards,
        SUM(CASE WHEN status = 'used' THEN 1 ELSE 0 END) as used_rewards,
        SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired_rewards,
        SUM(credits) as total_credits_granted,
        AVG(credits) as avg_credits_per_reward,
        COUNT(DISTINCT user_id) as unique_users_rewarded
      FROM ${this.tableName}
    `;
    return await this.queryOne(sql);
  }

  /**
   * Get rewards by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>}
   */
  async getRewardsByDateRange(startDate, endDate) {
    const sql = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as rewards_granted,
        SUM(credits) as credits_granted
      FROM ${this.tableName}
      WHERE DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `;
    return await this.query(sql, [startDate, endDate]);
  }

  /**
   * Expire rewards that have passed their expiration date
   * @returns {Promise<number>} Number of expired rewards
   */
  async expireRewards() {
    const sql = `UPDATE ${this.tableName} SET status = 'expired', updated_at = CURRENT_TIMESTAMP WHERE status = 'active' AND expires_at <= CURRENT_TIMESTAMP`;
    const result = await this.run(sql);
    return result.changes;
  }

  /**
   * Mark reward as used
   * @param {number} id - Reward ID
   * @returns {Promise<boolean>}
   */
  async markAsUsed(id) {
    const sql = `UPDATE ${this.tableName} SET status = 'used', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'active'`;
    const result = await this.run(sql, [id]);
    return result.changes > 0;
  }

  /**
   * Get total credits granted to a user
   * @param {number} userId - User ID
   * @returns {Promise<number>}
   */
  async getTotalCreditsGranted(userId) {
    const sql = `SELECT SUM(credits) as total FROM ${this.tableName} WHERE user_id = ? AND status IN ('active', 'used')`;
    const result = await this.queryOne(sql, [userId]);
    return result.total || 0;
  }

  /**
   * Get recent rewards
   * @param {number} limit - Number of rewards to return
   * @returns {Promise<Array>}
   */
  async getRecentRewards(limit = 10) {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC LIMIT ?`;
    return await this.query(sql, [limit]);
  }
}

module.exports = RewardRepository;
