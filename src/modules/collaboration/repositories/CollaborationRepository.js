const BaseRepository = require('../../../../src/shared/repositories/BaseRepository');
const Collaboration = require('../models/Collaboration');

/**
 * Collaboration repository for data access operations
 */
class CollaborationRepository extends BaseRepository {
  constructor(db, logger) {
    super(db, 'collaborations', logger);
  }

  /**
   * Find collaboration by ID
   * @param {number} id - Collaboration ID
   * @returns {Promise<Collaboration|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new Collaboration(row) : null;
  }

  /**
   * Find collaborations for a specific project
   * @param {number} projectId - Project ID
   * @param {Object} options - Query options
   * @returns {Promise<Collaboration[]>}
   */
  async findByProjectId(projectId, options = {}) {
    let sql = 'SELECT * FROM collaborations WHERE project_id = ?';
    const params = [projectId];

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY timestamp DESC';
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
    return rows.map((row) => new Collaboration(row));
  }

  /**
   * Find collaborations by user
   * @param {number} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Collaboration[]>}
   */
  async findByUserId(userId, options = {}) {
    let sql = 'SELECT * FROM collaborations WHERE user_id = ?';
    const params = [userId];

    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`;
    } else {
      sql += ' ORDER BY timestamp DESC';
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
    return rows.map((row) => new Collaboration(row));
  }

  /**
   * Create a new collaboration
   * @param {Object} collaborationData - Collaboration data
   * @returns {Promise<number>} Created collaboration ID
   */
  async create(collaborationData) {
    const collaboration = new Collaboration(collaborationData);
    collaboration.validate();

    const data = {
      project_id: collaboration.projectId,
      user_id: collaboration.userId,
      message: collaboration.message,
    };

    return await super.create(data);
  }

  /**
   * Update a collaboration
   * @param {number} id - Collaboration ID
   * @param {Object} collaborationData - Updated collaboration data
   * @returns {Promise<boolean>}
   */
  async update(id, collaborationData) {
    const collaboration = new Collaboration(collaborationData);
    collaboration.validate();

    const data = {};
    if (collaboration.message !== undefined)
      data.message = collaboration.message;

    return await super.update(id, data);
  }

  /**
   * Delete collaborations for a project (useful for cleanup)
   * @param {number} projectId - Project ID
   * @returns {Promise<number>} Number of deleted collaborations
   */
  async deleteByProjectId(projectId) {
    const sql = 'DELETE FROM collaborations WHERE project_id = ?';
    const result = await this.run(sql, [projectId]);
    return result.changes;
  }
}

module.exports = CollaborationRepository;
