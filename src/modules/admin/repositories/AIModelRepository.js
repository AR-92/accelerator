/**
 * AI Model Repository
 * Handles database operations for AI models and workflow templates
 */

class AIModelRepository {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get all AI models
   */
  async getAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM ai_models
        ORDER BY model_name ASC
      `;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Get AI model by ID
   */
  async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM ai_models WHERE model_id = ?';
      this.db.get(sql, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get AI model by name
   */
  async getByName(name) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM ai_models WHERE model_name = ?';
      this.db.get(sql, [name], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get AI models by output type
   */
  async getByOutputType(outputType) {
    return new Promise((resolve, reject) => {
      const sql =
        'SELECT * FROM ai_models WHERE output_type = ? ORDER BY model_name ASC';
      this.db.all(sql, [outputType], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  /**
   * Create new AI model
   */
  async create(modelData) {
    return new Promise((resolve, reject) => {
      const { model_name, description, estimated_credit_cost, output_type } =
        modelData;
      const sql = `
        INSERT INTO ai_models (model_name, description, estimated_credit_cost, output_type)
        VALUES (?, ?, ?, ?)
      `;
      this.db.run(
        sql,
        [model_name, description, estimated_credit_cost, output_type],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  /**
   * Update AI model
   */
  async update(id, modelData) {
    return new Promise((resolve, reject) => {
      const { model_name, description, estimated_credit_cost, output_type } =
        modelData;
      const sql = `
        UPDATE ai_models
        SET model_name = ?, description = ?, estimated_credit_cost = ?, output_type = ?
        WHERE model_id = ?
      `;
      this.db.run(
        sql,
        [model_name, description, estimated_credit_cost, output_type, id],
        function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }

  /**
   * Delete AI model
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM ai_models WHERE model_id = ?';
      this.db.run(sql, [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Get AI model usage statistics
   */
  async getUsageStats() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT
          am.model_id,
          am.model_name,
          COUNT(aw.workflow_id) as total_workflows,
          SUM(aw.credit_cost_actual) as total_credits_used,
          AVG(aw.credit_cost_actual) as avg_credits_per_workflow
        FROM ai_models am
        LEFT JOIN ai_workflows aw ON am.model_id = aw.model_id
        GROUP BY am.model_id, am.model_name
        ORDER BY total_workflows DESC
      `;
      this.db.all(sql, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = AIModelRepository;
