/**
 * Migration: Update votes table for projects
 */

module.exports = {
  up: async (db) => {
    try {
      // Create new votes table for projects
      await db.run(`
        CREATE TABLE votes_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          project_id INTEGER NOT NULL,
          score INTEGER NOT NULL DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          UNIQUE (user_id, project_id)
        );
      `);

      // Keep old votes table for ideas, rename current to votes_ideas
      await db.run('ALTER TABLE votes RENAME TO votes_ideas;');

      // Rename new table to votes
      await db.run('ALTER TABLE votes_new RENAME TO votes;');

      // Create indexes
      await db.run(
        'CREATE INDEX IF NOT EXISTS idx_votes_project ON votes(project_id);'
      );

      console.log('Votes table updated for projects successfully');
    } catch (error) {
      console.error('Error updating votes table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE votes;');
      await db.run('ALTER TABLE votes_ideas RENAME TO votes;');
      console.log('Reverted votes table');
    } catch (error) {
      console.error('Error reverting votes table:', error);
      throw error;
    }
  },
};
