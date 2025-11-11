/**
 * Migration: Create AI_Workflows table
 * Instances of AI model executions
 */

module.exports = {
  up: async (db) => {
    const createAIWorkflowsTable = `
      CREATE TABLE IF NOT EXISTS ai_workflows (
        workflow_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        model_id INTEGER NOT NULL,
        status TEXT DEFAULT 'queued',
        initiated_by INTEGER NOT NULL,
        credit_cost_actual INTEGER DEFAULT 0,
        started_at DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (model_id) REFERENCES ai_models(model_id) ON DELETE CASCADE,
        FOREIGN KEY (initiated_by) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_ai_workflows_project ON ai_workflows(project_id);
      CREATE INDEX IF NOT EXISTS idx_ai_workflows_model ON ai_workflows(model_id);
      CREATE INDEX IF NOT EXISTS idx_ai_workflows_status ON ai_workflows(status);
    `;

    try {
      await db.run(createAIWorkflowsTable);
      await db.run(createIndexes);
      console.log('AI Workflows table created successfully');
    } catch (error) {
      console.error('Error creating AI Workflows table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_ai_workflows_status');
      await db.run('DROP INDEX IF EXISTS idx_ai_workflows_model');
      await db.run('DROP INDEX IF EXISTS idx_ai_workflows_project');
      await db.run('DROP TABLE IF EXISTS ai_workflows');
      console.log('AI Workflows table dropped successfully');
    } catch (error) {
      console.error('Error dropping AI Workflows table:', error);
      throw error;
    }
  },
};
