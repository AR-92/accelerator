/**
 * Migration: Create Workflow_Executions table
 * Track each step execution in a workflow
 */

module.exports = {
  up: async (db) => {
    const createWorkflowExecutionsTable = `
      CREATE TABLE IF NOT EXISTS workflow_executions (
        execution_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workflow_id INTEGER NOT NULL,
        step_id INTEGER NOT NULL,
        input_data TEXT, -- JSON
        output_data TEXT, -- JSON
        status TEXT DEFAULT 'pending',
        executed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workflow_id) REFERENCES ai_workflows(workflow_id) ON DELETE CASCADE,
        FOREIGN KEY (step_id) REFERENCES workflow_steps(step_id) ON DELETE CASCADE
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow ON workflow_executions(workflow_id);
      CREATE INDEX IF NOT EXISTS idx_workflow_executions_step ON workflow_executions(step_id);
      CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
    `;

    try {
      await db.run(createWorkflowExecutionsTable);
      await db.run(createIndexes);
      console.log('Workflow Executions table created successfully');
    } catch (error) {
      console.error('Error creating Workflow Executions table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_workflow_executions_status');
      await db.run('DROP INDEX IF EXISTS idx_workflow_executions_step');
      await db.run('DROP INDEX IF EXISTS idx_workflow_executions_workflow');
      await db.run('DROP TABLE IF EXISTS workflow_executions');
      console.log('Workflow Executions table dropped successfully');
    } catch (error) {
      console.error('Error dropping Workflow Executions table:', error);
      throw error;
    }
  },
};
