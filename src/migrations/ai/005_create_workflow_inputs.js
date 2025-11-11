/**
 * Migration: Create Workflow_Inputs table
 * Data sources for workflow execution
 */

module.exports = {
  up: async (db) => {
    const createWorkflowInputsTable = `
      CREATE TABLE IF NOT EXISTS workflow_inputs (
        input_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workflow_id INTEGER NOT NULL,
        source_type TEXT NOT NULL,
        source_id INTEGER,
        input_data TEXT, -- JSON
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workflow_id) REFERENCES ai_workflows(workflow_id) ON DELETE CASCADE
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_workflow_inputs_workflow ON workflow_inputs(workflow_id);
      CREATE INDEX IF NOT EXISTS idx_workflow_inputs_source ON workflow_inputs(source_type, source_id);
    `;

    try {
      await db.run(createWorkflowInputsTable);
      await db.run(createIndexes);
      console.log('Workflow Inputs table created successfully');
    } catch (error) {
      console.error('Error creating Workflow Inputs table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_workflow_inputs_source');
      await db.run('DROP INDEX IF EXISTS idx_workflow_inputs_workflow');
      await db.run('DROP TABLE IF EXISTS workflow_inputs');
      console.log('Workflow Inputs table dropped successfully');
    } catch (error) {
      console.error('Error dropping Workflow Inputs table:', error);
      throw error;
    }
  },
};
