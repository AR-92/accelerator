/**
 * AI Workflow Repository
 * Handles database operations for AI workflow instances
 */

class AIWorkflowRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get all workflows with related data
   */
  async getAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          aw.*,
          am.model_name,
          p.title as project_title,
          u.name as initiated_by_name
        FROM ai_workflows aw
        JOIN ai_models am ON aw.model_id = am.model_id
        JOIN projects p ON aw.project_id = p.id
        JOIN users u ON aw.initiated_by = u.id
        ORDER BY aw.created_at DESC
      `;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get workflow by ID with full details
   */
  async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          aw.*,
          am.model_name,
          am.description as model_description,
          p.title as project_title,
          u.name as initiated_by_name,
          u.email as initiated_by_email
        FROM ai_workflows aw
        JOIN ai_models am ON aw.model_id = am.model_id
        JOIN projects p ON aw.project_id = p.id
        JOIN users u ON aw.initiated_by = u.id
        WHERE aw.workflow_id = ?
      `;
      this.db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get workflows by project ID
   */
  async getByProjectId(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          aw.*,
          am.model_name,
          u.name as initiated_by_name
        FROM ai_workflows aw
        JOIN ai_models am ON aw.model_id = am.model_id
        JOIN users u ON aw.initiated_by = u.id
        WHERE aw.project_id = ?
        ORDER BY aw.created_at DESC
      `;
      this.db.all(sql, [projectId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get workflows by user ID
   */
  async getByUserId(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          aw.*,
          am.model_name,
          p.title as project_title
        FROM ai_workflows aw
        JOIN ai_models am ON aw.model_id = am.model_id
        JOIN projects p ON aw.project_id = p.id
        WHERE aw.initiated_by = ?
        ORDER BY aw.created_at DESC
      `;
      this.db.all(sql, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get workflows by status
   */
  async getByStatus(status) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          aw.*,
          am.model_name,
          p.title as project_title,
          u.name as initiated_by_name
        FROM ai_workflows aw
        JOIN ai_models am ON aw.model_id = am.model_id
        JOIN projects p ON aw.project_id = p.id
        JOIN users u ON aw.initiated_by = u.id
        WHERE aw.status = ?
        ORDER BY aw.created_at DESC
      `;
      this.db.all(sql, [status], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Create new workflow
   */
  async create(workflowData) {
    return new Promise((resolve, reject) => {
      const { project_id, model_id, initiated_by, credit_cost_actual } =
        workflowData;
      const sql = `
        INSERT INTO ai_workflows (project_id, model_id, initiated_by, credit_cost_actual)
        VALUES (?, ?, ?, ?)
      `;
      this.db.run(
        sql,
        [project_id, model_id, initiated_by, credit_cost_actual || 0],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  /**
   * Update workflow status
   */
  async updateStatus(id, status, creditCost = null) {
    return new Promise((resolve, reject) => {
      let sql, params;
      if (creditCost !== null) {
        sql =
          'UPDATE ai_workflows SET status = ?, credit_cost_actual = ? WHERE workflow_id = ?';
        params = [status, creditCost, id];
      } else {
        sql = 'UPDATE ai_workflows SET status = ? WHERE workflow_id = ?';
        params = [status, id];
      }

      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Update workflow timestamps
   */
  async updateTimestamps(id, startedAt = null, completedAt = null) {
    return new Promise((resolve, reject) => {
      let sql, params;
      if (startedAt && completedAt) {
        sql =
          'UPDATE ai_workflows SET started_at = ?, completed_at = ? WHERE workflow_id = ?';
        params = [startedAt, completedAt, id];
      } else if (startedAt) {
        sql = 'UPDATE ai_workflows SET started_at = ? WHERE workflow_id = ?';
        params = [startedAt, id];
      } else if (completedAt) {
        sql = 'UPDATE ai_workflows SET completed_at = ? WHERE workflow_id = ?';
        params = [completedAt, id];
      } else {
        return resolve(0);
      }

      this.db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Delete workflow
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM ai_workflows WHERE workflow_id = ?';
      this.db.run(sql, [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Get workflow statistics
   */
  async getStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          COUNT(*) as total_workflows,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_workflows,
          SUM(CASE WHEN status = 'running' THEN 1 ELSE 0 END) as running_workflows,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_workflows,
          SUM(credit_cost_actual) as total_credits_used,
          AVG(credit_cost_actual) as avg_credits_per_workflow
        FROM ai_workflows
        WHERE credit_cost_actual > 0
      `;
      this.db.get(sql, [], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
}

module.exports = AIWorkflowRepository;
