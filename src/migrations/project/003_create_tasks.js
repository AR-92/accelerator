/**
 * Migration: Create tasks table
 */

module.exports = {
  up: async (db) => {
    const createTasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        assignee_user_id INTEGER,
        status TEXT DEFAULT 'todo',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_user_id);
    `;

    try {
      await db.run(createTasksTable);
      await db.run(createIndexes);
      console.log('Tasks table created successfully');
    } catch (error) {
      console.error('Error creating tasks table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_tasks_assignee');
      await db.run('DROP INDEX IF EXISTS idx_tasks_project');
      await db.run('DROP TABLE IF EXISTS tasks');
      console.log('Tasks table dropped successfully');
    } catch (error) {
      console.error('Error dropping tasks table:', error);
      throw error;
    }
  },
};
