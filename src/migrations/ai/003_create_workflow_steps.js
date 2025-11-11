/**
 * Migration: Create Workflow_Steps table
 * Predefined steps for each AI model
 */

module.exports = {
  up: async (db) => {
    const createWorkflowStepsTable = `
      CREATE TABLE IF NOT EXISTS workflow_steps (
        step_id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_id INTEGER NOT NULL,
        step_number INTEGER NOT NULL,
        step_name TEXT NOT NULL,
        step_description TEXT,
        ai_prompt_template TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (model_id) REFERENCES ai_models(model_id) ON DELETE CASCADE,
        UNIQUE (model_id, step_number)
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_workflow_steps_model ON workflow_steps(model_id);
    `;

    try {
      await db.run(createWorkflowStepsTable);
      await db.run(createIndexes);
      console.log('Workflow Steps table created successfully');
    } catch (error) {
      console.error('Error creating Workflow Steps table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_workflow_steps_model');
      await db.run('DROP TABLE IF EXISTS workflow_steps');
      console.log('Workflow Steps table dropped successfully');
    } catch (error) {
      console.error('Error dropping Workflow Steps table:', error);
      throw error;
    }
  },
};
