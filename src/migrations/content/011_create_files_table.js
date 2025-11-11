/**
 * Migration: Create Files table
 * For storing file uploads and AI-generated content
 */

module.exports = {
  up: async (db) => {
    const createFilesTable = `
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        uploaded_by INTEGER,
        generated_by INTEGER,
        file_type TEXT DEFAULT 'user_uploaded',
        file_name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_format TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (generated_by) REFERENCES ai_workflows(workflow_id) ON DELETE SET NULL
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_files_project ON files(project_id);
      CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);
      CREATE INDEX IF NOT EXISTS idx_files_generated_by ON files(generated_by);
      CREATE INDEX IF NOT EXISTS idx_files_type ON files(file_type);
    `;

    try {
      await db.run(createFilesTable);
      await db.run(createIndexes);
      console.log('Files table created successfully');
    } catch (error) {
      console.error('Error creating Files table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_files_type');
      await db.run('DROP INDEX IF EXISTS idx_files_generated_by');
      await db.run('DROP INDEX IF EXISTS idx_files_uploaded_by');
      await db.run('DROP INDEX IF EXISTS idx_files_project');
      await db.run('DROP TABLE IF EXISTS files');
      console.log('Files table dropped successfully');
    } catch (error) {
      console.error('Error dropping Files table:', error);
      throw error;
    }
  },
};
