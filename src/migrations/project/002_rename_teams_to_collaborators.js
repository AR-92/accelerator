/**
 * Migration: Rename teams table to project_collaborators
 */

module.exports = {
  up: async (db) => {
    try {
      // Create new table with composite primary key
      await db.run(`
        CREATE TABLE project_collaborators (
          project_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          role TEXT DEFAULT 'member',
          joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (project_id, user_id),
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Copy data from teams
      await db.run(`
        INSERT INTO project_collaborators (project_id, user_id, role, joined_at)
        SELECT project_id, user_id, role, joined_at FROM teams;
      `);

      // Drop old table
      await db.run('DROP TABLE teams;');

      // Create indexes
      await db.run(
        'CREATE INDEX IF NOT EXISTS idx_collab_user ON project_collaborators(user_id);'
      );

      console.log('Teams table renamed to project_collaborators successfully');
    } catch (error) {
      console.error('Error renaming teams table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run(`
        CREATE TABLE teams (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          role TEXT DEFAULT 'member',
          joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (project_id) REFERENCES projects (id)
        );
      `);

      await db.run(`
        INSERT INTO teams (project_id, user_id, role, joined_at)
        SELECT project_id, user_id, role, joined_at FROM project_collaborators;
      `);

      await db.run('DROP TABLE project_collaborators;');
      console.log('Reverted project_collaborators back to teams');
    } catch (error) {
      console.error('Error reverting teams table:', error);
      throw error;
    }
  },
};
