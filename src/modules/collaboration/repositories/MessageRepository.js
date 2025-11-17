const BaseRepository = require('../../../../src/shared/repositories/BaseRepository');

/**
 * Message repository for data access operations
 */
class MessageRepository extends BaseRepository {
  constructor(db) {
    super(db, 'messages');
  }

  /**
   * Find messages by project ID
   * @param {number} projectId - Project ID
   * @param {Object} options - Query options
   * @returns {Promise<Object[]>}
   */
  async findByProjectId(projectId, options = {}) {
    let sql =
      'SELECT m.*, u.name as user_name, u.email as user_email FROM messages m JOIN users u ON m.user_id = u.id WHERE m.project_id = ?';
    const params = [projectId];

    sql += ' ORDER BY m.created_at DESC';

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
    }

    if (options.offset) {
      sql += ' OFFSET ?';
      params.push(options.offset);
    }

    return await this.query(sql, params);
  }

  /**
   * Find messages by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Object[]>}
   */
  async findByUserId(userId) {
    const sql =
      'SELECT m.*, p.title as project_title FROM messages m JOIN projects p ON m.project_id = p.id WHERE m.user_id = ? ORDER BY m.created_at DESC';
    return await this.query(sql, [userId]);
  }

  /**
   * Create a new message
   * @param {Object} messageData - Message data
   * @returns {Promise<number>} Created message ID
   */
  async create(messageData) {
    const data = {
      project_id: messageData.projectId || messageData.project_id,
      user_id: messageData.userId || messageData.user_id,
      body: messageData.body,
    };

    return await super.create(data);
  }

  /**
   * Count messages by user (across all their projects)
   * @param {number} userId - User ID
   * @returns {Promise<number>} Message count
   */
  async countByUser(userId) {
    const sql = `
      SELECT COUNT(m.id) as count FROM messages m
      INNER JOIN projects p ON m.project_id = p.id
      LEFT JOIN project_collaborators pc ON p.id = pc.project_id
      WHERE p.owner_user_id = ? OR pc.user_id = ?
    `;
    const result = await this.queryOne(sql, [userId, userId]);
    return result.count;
  }

  /**
   * Get message statistics
   * @returns {Promise<Object>} Message statistics
   */
  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total_messages,
        COUNT(DISTINCT user_id) as unique_users_messaging,
        COUNT(DISTINCT project_id) as projects_with_messages
      FROM messages
    `;
    return await this.queryOne(sql);
  }
}

module.exports = MessageRepository;
