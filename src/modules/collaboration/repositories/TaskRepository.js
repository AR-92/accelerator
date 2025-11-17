const BaseRepository = require('../../../../src/shared/repositories/BaseRepository');

/**
 * Task repository for data access operations
 */
class TaskRepository extends BaseRepository {
  constructor(db) {
    super(db, 'tasks');
  }

  /**
   * Find task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const row = await super.findById(id);
    return row;
  }

  /**
   * Find tasks by project ID
   * @param {number} projectId - Project ID
   * @param {Object} options - Query options
   * @returns {Promise<Object[]>}
   */
  async findByProjectId(projectId, options = {}) {
    let sql = 'SELECT * FROM tasks WHERE project_id = ?';
    const params = [projectId];

    if (options.status) {
      sql += ' AND status = ?';
      params.push(options.status);
    }

    sql += ' ORDER BY created_at DESC';

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
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise<number>} Created task ID
   */
  async create(taskData) {
    const data = {
      project_id: taskData.projectId || taskData.project_id,
      title: taskData.title,
      description: taskData.description || null,
      assignee_user_id:
        taskData.assigneeUserId || taskData.assignee_user_id || null,
      status: taskData.status || 'todo',
    };

    return await super.create(data);
  }

  /**
   * Update a task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<boolean>}
   */
  async update(id, taskData) {
    const data = {};
    if (taskData.title !== undefined) data.title = taskData.title;
    if (taskData.description !== undefined)
      data.description = taskData.description;
    if (
      taskData.assigneeUserId !== undefined ||
      taskData.assignee_user_id !== undefined
    ) {
      data.assignee_user_id =
        taskData.assigneeUserId || taskData.assignee_user_id;
    }
    if (taskData.status !== undefined) data.status = taskData.status;
    if (taskData.projectId !== undefined || taskData.project_id !== undefined) {
      data.project_id = taskData.projectId || taskData.project_id;
    }
    data.updated_at = new Date().toISOString();

    return await super.update(id, data);
  }

  /**
   * Count tasks by user (across all their projects)
   * @param {number} userId - User ID
   * @returns {Promise<number>} Task count
   */
  async countByUser(userId) {
    const sql = `
      SELECT COUNT(t.id) as count FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      LEFT JOIN project_collaborators pc ON p.id = pc.project_id
      WHERE p.owner_user_id = ? OR pc.user_id = ?
    `;
    const result = await this.queryOne(sql, [userId, userId]);
    return result.count;
  }

  /**
   * Get task statistics
   * @returns {Promise<Object>} Task statistics
   */
  async getStats() {
    const sql = `
      SELECT
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo_tasks,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN status = 'done' THEN 1 END) as done_tasks
      FROM tasks
    `;
    return await this.queryOne(sql);
  }
}

module.exports = TaskRepository;
