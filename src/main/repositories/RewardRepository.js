const BaseRepository = require('../../common/repositories/BaseRepository');

/**
 * Reward repository for managing user rewards and achievements
 */
class RewardRepository extends BaseRepository {
  constructor(db) {
    super(db, 'rewards');
  }

  /**
   * Find rewards by user ID (as recipient)
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>}
   */
  async findByUserId(userId, options = {}) {
    let sql = `SELECT * FROM ${this.tableName} WHERE recipient_user_id = ?`;
    const params = [userId];

    sql += ` ORDER BY awarded_at DESC`;

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
   * Find rewards for a user (as recipient)
   * @param {number} userId - User ID
   * @returns {Promise<Array>}
   */
  async findActiveByUserId(userId) {
    const sql = `
      SELECT * FROM ${this.tableName}
      WHERE recipient_user_id = ?
      ORDER BY awarded_at DESC
    `;
    return await this.query(sql, [userId]);
  }

  /**
   * Get reward statistics
   * @returns {Promise<Object>}
   */
  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total_rewards,
        SUM(credits) as total_credits_granted,
        AVG(credits) as avg_credits_per_reward,
        COUNT(DISTINCT recipient_user_id) as unique_users_rewarded
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
        DATE(awarded_at) as date,
        COUNT(*) as rewards_granted,
        SUM(credits) as credits_granted
      FROM ${this.tableName}
      WHERE DATE(awarded_at) BETWEEN ? AND ?
      GROUP BY DATE(awarded_at)
      ORDER BY DATE(awarded_at)
    `;
    return await this.query(sql, [startDate, endDate]);
  }

  /**
   * Expire rewards that have passed their expiration date
   * @returns {Promise<number>} Number of expired rewards
   */
  async expireRewards() {
    // No expiration logic in new schema
    return 0;
  }

  /**
   * Mark reward as used (not applicable in new schema)
   * @param {number} id - Reward ID
   * @returns {Promise<boolean>}
   */
  async markAsUsed(id) {
    // Not applicable in new schema
    return false;
  }

  /**
   * Get total credits granted to a user
   * @param {number} userId - User ID
   * @returns {Promise<number>}
   */
  async getTotalCreditsGranted(userId) {
    const sql = `SELECT SUM(credits) as total FROM ${this.tableName} WHERE recipient_user_id = ?`;
    const result = await this.queryOne(sql, [userId]);
    return result.total || 0;
  }

  /**
   * Get recent rewards
   * @param {number} limit - Number of rewards to return
   * @returns {Promise<Array>}
   */
  async getRecentRewards(limit = 10) {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY awarded_at DESC LIMIT ?`;
    return await this.query(sql, [limit]);
  }
}

module.exports = RewardRepository;
