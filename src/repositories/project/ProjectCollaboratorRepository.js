/**
 * Project Collaborator Repository
 * Handles database operations for project collaborators
 */

class ProjectCollaboratorRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get all collaborators with project and user information
   */
  async getAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT pc.*, p.title as project_title, u.name as user_name, u.email as user_email
        FROM project_collaborators pc
        JOIN projects p ON pc.project_id = p.id
        JOIN users u ON pc.user_id = u.id
        ORDER BY pc.joined_at DESC
      `;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get collaborators for a project
   */
  async getByProjectId(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT pc.*, u.name as user_name, u.email as user_email, u.user_type
        FROM project_collaborators pc
        JOIN users u ON pc.user_id = u.id
        WHERE pc.project_id = ?
        ORDER BY pc.joined_at ASC
      `;
      this.db.all(sql, [projectId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get projects for a user (as collaborator)
   */
  async getProjectsByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT pc.*, p.title as project_title, p.description, p.visibility
        FROM project_collaborators pc
        JOIN projects p ON pc.project_id = p.id
        WHERE pc.user_id = ?
        ORDER BY pc.joined_at DESC
      `;
      this.db.all(sql, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Check if user is collaborator on project
   */
  async isCollaborator(projectId, userId) {
    return new Promise((resolve, reject) => {
      const sql =
        'SELECT COUNT(*) as count FROM project_collaborators WHERE project_id = ? AND user_id = ?';
      this.db.get(sql, [projectId, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row.count > 0);
      });
    });
  }

  /**
   * Get collaborator role
   */
  async getCollaboratorRole(projectId, userId) {
    return new Promise((resolve, reject) => {
      const sql =
        'SELECT role FROM project_collaborators WHERE project_id = ? AND user_id = ?';
      this.db.get(sql, [projectId, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.role : null);
      });
    });
  }

  /**
   * Add collaborator to project
   */
  async addCollaborator(projectId, userId, role = 'member') {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO project_collaborators (project_id, user_id, role)
        VALUES (?, ?, ?)
      `;
      this.db.run(sql, [projectId, userId, role], function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  /**
   * Update collaborator role
   */
  async updateRole(projectId, userId, role) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE project_collaborators
        SET role = ?
        WHERE project_id = ? AND user_id = ?
      `;
      this.db.run(sql, [role, projectId, userId], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Remove collaborator from project
   */
  async removeCollaborator(projectId, userId) {
    return new Promise((resolve, reject) => {
      const sql =
        'DELETE FROM project_collaborators WHERE project_id = ? AND user_id = ?';
      this.db.run(sql, [projectId, userId], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Get collaborator statistics
   */
  async getStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          COUNT(*) as total_collaborators,
          COUNT(DISTINCT project_id) as projects_with_collaborators,
          COUNT(DISTINCT user_id) as unique_collaborators,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_collaborators,
          SUM(CASE WHEN role = 'member' THEN 1 ELSE 0 END) as member_collaborators
        FROM project_collaborators
      `;
      this.db.get(sql, [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get user's collaboration activity
   */
  async getUserCollaborationStats(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          COUNT(*) as total_projects,
          COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_projects,
          COUNT(CASE WHEN role = 'member' THEN 1 END) as member_projects,
          MAX(joined_at) as last_activity
        FROM project_collaborators
        WHERE user_id = ?
      `;
      this.db.get(sql, [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = ProjectCollaboratorRepository;
