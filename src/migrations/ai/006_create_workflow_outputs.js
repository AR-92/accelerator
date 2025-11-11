/**
 * Migration: Create Workflow_Outputs table
 * Generated artifacts from AI workflows
 */

module.exports = {
  up: async (db) => {
    const createWorkflowOutputsTable = `
      CREATE TABLE IF NOT EXISTS workflow_outputs (
        output_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workflow_id INTEGER NOT NULL,
        output_type TEXT NOT NULL,
        file_id INTEGER,
        output_data TEXT, -- JSON
        version INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (workflow_id) REFERENCES ai_workflows(workflow_id) ON DELETE CASCADE,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_workflow_outputs_workflow ON workflow_outputs(workflow_id);
      CREATE INDEX IF NOT EXISTS idx_workflow_outputs_file ON workflow_outputs(file_id);
    `;

    try {
      await db.run(createWorkflowOutputsTable);
      await db.run(createIndexes);
      console.log('Workflow Outputs table created successfully');
    } catch (error) {
      console.error('Error creating Workflow Outputs table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_workflow_outputs_file');
      await db.run('DROP INDEX IF EXISTS idx_workflow_outputs_workflow');
      await db.run('DROP TABLE IF EXISTS workflow_outputs');
      console.log('Workflow Outputs table dropped successfully');
    } catch (error) {
      console.error('Error dropping Workflow Outputs table:', error);
      throw error;
    }
  },
};
