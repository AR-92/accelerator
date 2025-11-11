/**
 * Migration: Create Project_Stages table
 * Links projects to AI models and tracks progress
 */

module.exports = {
  up: async (db) => {
    const createProjectStagesTable = `
      CREATE TABLE IF NOT EXISTS project_stages (
        stage_id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        model_id INTEGER,
        completion_percentage INTEGER DEFAULT 0,
        active_workflow_id INTEGER,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (model_id) REFERENCES ai_models(model_id) ON DELETE SET NULL,
        FOREIGN KEY (active_workflow_id) REFERENCES ai_workflows(workflow_id) ON DELETE SET NULL
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_project_stages_model ON project_stages(model_id);
      CREATE INDEX IF NOT EXISTS idx_project_stages_workflow ON project_stages(active_workflow_id);
      CREATE INDEX IF NOT EXISTS idx_project_stages_project ON project_stages(project_id);
    `;

    try {
      await db.run(createProjectStagesTable);
      await db.run(createIndexes);
      console.log('Project Stages table created successfully');
    } catch (error) {
      console.error('Error creating Project Stages table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_project_stages_project');
      await db.run('DROP INDEX IF EXISTS idx_project_stages_workflow');
      await db.run('DROP INDEX IF EXISTS idx_project_stages_model');
      await db.run('DROP TABLE IF EXISTS project_stages');
      console.log('Project Stages table dropped successfully');
    } catch (error) {
      console.error('Error dropping Project Stages table:', error);
      throw error;
    }
  },
};
