const BaseRepository = require('../common/BaseRepository');

class AdminActivityRepository extends BaseRepository {
  constructor(db) {
    super(db, 'admin_activity_log');
  }

  /**
   * Create a new activity log entry
   * @param {Object} activityData - Activity data
   * @returns {Promise<number>} Created activity ID
   */
  async create(activityData) {
    const data = {
      admin_id: activityData.adminId,
      admin_email: activityData.adminEmail,
      action: activityData.action,
      target_type: activityData.targetType,
      target_id: activityData.targetId,
      details: activityData.details
        ? JSON.stringify(activityData.details)
        : null,
      ip: activityData.ip,
    };

    return await super.create(data);
  }

  /**
   * Get recent activities
   * @param {number} limit - Number of activities to return
   * @returns {Promise<Array>} Recent activities
   */
  async getRecent(limit = 10) {
    const sql = `
      SELECT * FROM admin_activity_log
      ORDER BY timestamp DESC
      LIMIT ?
    `;
    const rows = await this.query(sql, [limit]);
    return rows.map((row) => ({
      id: row.id,
      adminId: row.admin_id,
      adminEmail: row.admin_email,
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id,
      details: row.details ? JSON.parse(row.details) : null,
      ip: row.ip,
      timestamp: row.timestamp,
    }));
  }

  /**
   * Get activities for a specific target
   * @param {string} targetType - Type of target (user, etc.)
   * @param {number} targetId - Target ID
   * @param {number} limit - Number of activities to return
   * @returns {Promise<Array>} Activities for the target
   */
  async getByTarget(targetType, targetId, limit = 20) {
    const sql = `
      SELECT * FROM admin_activity_log
      WHERE target_type = ? AND target_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `;
    const rows = await this.query(sql, [targetType, targetId, limit]);
    return rows.map((row) => ({
      id: row.id,
      adminId: row.admin_id,
      adminEmail: row.admin_email,
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id,
      details: row.details ? JSON.parse(row.details) : null,
      ip: row.ip,
      timestamp: row.timestamp,
    }));
  }
}

module.exports = AdminActivityRepository;
