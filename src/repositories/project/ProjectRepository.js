const BaseRepository = require('../common/BaseRepository');
const Project = require('../../models/project/Project');

/**
 * Project repository for data access operations
 */
class ProjectRepository extends BaseRepository {
  constructor(db) {
    super(db, 'projects');
  }

  /**
   * Find project by ID
   * @param {number} id - Project ID
   * @returns {Promise<Project|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new Project(row) : null;
  }

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise<number>} Created project ID
   */
  async create(projectData) {
    const project = new Project(projectData);
    project.validate();

    const data = {
      user_id: project.userId,
      title: project.title,
      description: project.description,
      status: project.status,
    };

    return await super.create(data);
  }

  /**
   * Update project information
   * @param {number} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise<boolean>}
   */
  async update(id, projectData) {
    const project = new Project(projectData);
    project.validate();

    const data = {};
    if (project.title !== undefined) data.title = project.title;
    if (project.description !== undefined)
      data.description = project.description;
    if (project.status !== undefined) data.status = project.status;
    data.updated_at = new Date().toISOString();

    return await super.update(id, data);
  }

  /**
   * Find projects by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Project[]>}
   */
  async findByUserId(userId) {
    const sql =
      'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC';
    const rows = await this.query(sql, [userId]);
    return rows.map((row) => new Project(row));
  }

  /**
   * Find projects by status
   * @param {string} status - Project status
   * @returns {Promise<Project[]>}
   */
  async findByStatus(status) {
    const sql =
      'SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC';
    const rows = await this.query(sql, [status]);
    return rows.map((row) => new Project(row));
  }

  /**
   * Search projects by title or description
   * @param {string} query - Search query
   * @returns {Promise<Project[]>}
   */
  async search(query) {
    const searchTerm = `%${query}%`;
    const sql = `
      SELECT * FROM projects
      WHERE title LIKE ? OR description LIKE ?
      ORDER BY title
    `;
    const rows = await this.query(sql, [searchTerm, searchTerm]);
    return rows.map((row) => new Project(row));
  }

  /**
   * Get projects with pagination and filtering
   * @param {Object} options - Query options
   * @returns {Promise<Project[]>}
   */
  async findAll(options = {}) {
    const {
      limit = 20,
      offset = 0,
      userId,
      status,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = options;

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = [
      'id',
      'title',
      'description',
      'status',
      'created_at',
      'updated_at',
    ];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase())
      ? sortOrder.toUpperCase()
      : 'DESC';

    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params = [];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    sql += ` ORDER BY ${validSortBy} ${validSortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const rows = await this.query(sql, params);
    return rows.map((row) => new Project(row));
  }

  /**
   * Count projects with filtering
   * @param {Object} options - Filter options
   * @returns {Promise<number>}
   */
  async countFiltered(options = {}) {
    const { userId, status, search } = options;

    let sql = 'SELECT COUNT(*) as count FROM projects WHERE 1=1';
    const params = [];

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      sql += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }

    const result = await this.queryOne(sql, params);
    return result.count;
  }

  /**
   * Count projects by status
   * @returns {Promise<Object>} Status counts
   */
  async countByStatus() {
    const sql =
      'SELECT status, COUNT(*) as count FROM projects GROUP BY status';
    const rows = await this.query(sql);
    const result = {};
    rows.forEach((row) => {
      result[row.status] = row.count;
    });
    return result;
  }
}

module.exports = ProjectRepository;
