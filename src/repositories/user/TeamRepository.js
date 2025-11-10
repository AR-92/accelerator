const BaseRepository = require('../common/BaseRepository');
const Team = require('../../models/user/Team');

/**
 * Team repository for data access operations
 */
class TeamRepository extends BaseRepository {
  constructor(db) {
    super(db, 'teams');
  }

  /**
   * Find team member by ID
   * @param {number} id - Team member ID
   * @returns {Promise<Team|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new Team(row) : null;
  }

  /**
   * Create a new team member
   * @param {Object} teamData - Team data
   * @returns {Promise<number>} Created team member ID
   */
  async create(teamData) {
    const team = new Team(teamData);
    team.validate();

    const data = {
      project_id: team.projectId,
      user_id: team.userId,
      role: team.role,
      joined_at: team.joinedAt.toISOString(),
    };

    return await super.create(data);
  }

  /**
   * Update team member information
   * @param {number} id - Team member ID
   * @param {Object} teamData - Updated team data
   * @returns {Promise<boolean>}
   */
  async update(id, teamData) {
    const team = new Team(teamData);
    team.validate();

    const data = {};
    if (team.role !== undefined) data.role = team.role;
    data.updated_at = new Date().toISOString();

    return await super.update(id, data);
  }

  /**
   * Find team members by project ID
   * @param {number} projectId - Project ID
   * @returns {Promise<Team[]>}
   */
  async findByProjectId(projectId) {
    const sql =
      'SELECT * FROM teams WHERE project_id = ? ORDER BY joined_at ASC';
    const rows = await this.query(sql, [projectId]);
    return rows.map((row) => new Team(row));
  }

  /**
   * Find team members by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Team[]>}
   */
  async findByUserId(userId) {
    const sql = 'SELECT * FROM teams WHERE user_id = ? ORDER BY joined_at ASC';
    const rows = await this.query(sql, [userId]);
    return rows.map((row) => new Team(row));
  }

  /**
   * Check if user is a member of project
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>}
   */
  async isUserInProject(projectId, userId) {
    const sql =
      'SELECT COUNT(*) as count FROM teams WHERE project_id = ? AND user_id = ?';
    const result = await this.queryOne(sql, [projectId, userId]);
    return result.count > 0;
  }

  /**
   * Get user's role in project
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @returns {Promise<string|null>}
   */
  async getUserRoleInProject(projectId, userId) {
    const sql = 'SELECT role FROM teams WHERE project_id = ? AND user_id = ?';
    const result = await this.queryOne(sql, [projectId, userId]);
    return result ? result.role : null;
  }

  /**
   * Remove user from project
   * @param {number} projectId - Project ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>}
   */
  async removeUserFromProject(projectId, userId) {
    const sql = 'DELETE FROM teams WHERE project_id = ? AND user_id = ?';
    const result = await this.run(sql, [projectId, userId]);
    return result.changes > 0;
  }

  /**
   * Get team members with user details
   * @param {number} projectId - Project ID
   * @returns {Promise<Object[]>}
   */
  async getTeamWithUsers(projectId) {
    const sql = `
      SELECT t.*, u.email, u.first_name, u.last_name, u.role as user_role
      FROM teams t
      JOIN users u ON t.user_id = u.id
      WHERE t.project_id = ?
      ORDER BY t.joined_at ASC
    `;
    const rows = await this.query(sql, [projectId]);
    return rows.map((row) => ({
      id: row.id,
      projectId: row.project_id,
      userId: row.user_id,
      role: row.role,
      joinedAt: row.joined_at,
      user: {
        id: row.user_id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.user_role,
        fullName: `${row.first_name} ${row.last_name}`.trim(),
      },
    }));
  }

  /**
   * Count team members by project
   * @param {number} projectId - Project ID
   * @returns {Promise<number>}
   */
  async countByProject(projectId) {
    const sql = 'SELECT COUNT(*) as count FROM teams WHERE project_id = ?';
    const result = await this.queryOne(sql, [projectId]);
    return result.count;
  }
}

module.exports = TeamRepository;
