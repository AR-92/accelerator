/**
 * Migration: Rename collaborations table to messages
 */

module.exports = {
  up: async (db) => {
    try {
      // Create new messages table
      await db.run(`
        CREATE TABLE messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          body TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);

      // Copy data
      await db.run(`
        INSERT INTO messages (project_id, user_id, body, created_at)
        SELECT project_id, user_id, message, timestamp FROM collaborations;
      `);

      // Drop old table
      await db.run('DROP TABLE collaborations;');

      console.log('Collaborations table renamed to messages successfully');
    } catch (error) {
      console.error('Error renaming collaborations table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run(`
        CREATE TABLE collaborations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          project_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          message TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (project_id) REFERENCES projects (id)
        );
      `);

      await db.run(`
        INSERT INTO collaborations (project_id, user_id, message, timestamp)
        SELECT project_id, user_id, body, created_at FROM messages;
      `);

      await db.run('DROP TABLE messages;');
      console.log('Reverted messages back to collaborations');
    } catch (error) {
      console.error('Error reverting collaborations table:', error);
      throw error;
    }
  },
};
