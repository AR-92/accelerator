/**
 * Workflow Step Repository
 * Handles database operations for workflow step definitions
 */

class WorkflowStepRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get all steps for a model
   */
  async getByModelId(modelId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM workflow_steps
        WHERE model_id = ?
        ORDER BY step_number ASC
      `;
      this.db.all(sql, [modelId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get step by ID
   */
  async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM workflow_steps WHERE step_id = ?';
      this.db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get step by model and step number
   */
  async getByModelAndNumber(modelId, stepNumber) {
    return new Promise((resolve, reject) => {
      const sql =
        'SELECT * FROM workflow_steps WHERE model_id = ? AND step_number = ?';
      this.db.get(sql, [modelId, stepNumber], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Create new workflow step
   */
  async create(stepData) {
    return new Promise((resolve, reject) => {
      const {
        model_id,
        step_number,
        step_name,
        step_description,
        ai_prompt_template,
      } = stepData;
      const sql = `
        INSERT INTO workflow_steps (model_id, step_number, step_name, step_description, ai_prompt_template)
        VALUES (?, ?, ?, ?, ?)
      `;
      this.db.run(
        sql,
        [
          model_id,
          step_number,
          step_name,
          step_description,
          ai_prompt_template,
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  /**
   * Update workflow step
   */
  async update(id, stepData) {
    return new Promise((resolve, reject) => {
      const { step_name, step_description, ai_prompt_template } = stepData;
      const sql = `
        UPDATE workflow_steps
        SET step_name = ?, step_description = ?, ai_prompt_template = ?
        WHERE step_id = ?
      `;
      this.db.run(
        sql,
        [step_name, step_description, ai_prompt_template, id],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  /**
   * Delete workflow step
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM workflow_steps WHERE step_id = ?';
      this.db.run(sql, [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Get all workflow steps with model information
   */
  async getAllWithModels() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT ws.*, am.model_name
        FROM workflow_steps ws
        JOIN ai_models am ON ws.model_id = am.model_id
        ORDER BY am.model_name, ws.step_number
      `;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get step count by model
   */
  async getStepCountByModel() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT am.model_name, COUNT(ws.step_id) as step_count
        FROM ai_models am
        LEFT JOIN workflow_steps ws ON am.model_id = ws.model_id
        GROUP BY am.model_id, am.model_name
        ORDER BY am.model_name
      `;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = WorkflowStepRepository;
