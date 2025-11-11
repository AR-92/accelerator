/**
 * Migration: Update rewards table to match new schema
 */

module.exports = {
  up: async (db) => {
    try {
      // Check if the new rewards table with the correct schema already exists
      const newTableExists = await db.get(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='rewards' 
        AND sql LIKE '%giver_user_id%' AND sql LIKE '%recipient_user_id%' AND sql LIKE '%project_id%'
      `);

      if (newTableExists) {
        // If the table with the new schema already exists, skip the migration
        console.log('Rewards table already has the correct schema, skipping migration');
        return true;
      }

      // Check if rewards_old table doesn't exist (to avoid renaming issues)
      const oldTableExists = await db.get(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='rewards_old'
      `);

      if (!oldTableExists) {
        // Rename current rewards table to rewards_old
        await db.run('ALTER TABLE rewards RENAME TO rewards_old;');
      } else {
        console.log('rewards_old table already exists, proceeding with new table creation');
      }

      // Create new rewards table
      await db.run(`
        CREATE TABLE rewards_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          giver_user_id INTEGER NOT NULL,
          recipient_user_id INTEGER,
          project_id INTEGER,
          credits INTEGER NOT NULL,
          reason TEXT,
          transaction_id INTEGER,
          awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (giver_user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
        );
      `);

      // Create indexes
      await db.run(
        'CREATE INDEX IF NOT EXISTS idx_rewards_recipient ON rewards_new(recipient_user_id);'
      );
      await db.run(
        'CREATE INDEX IF NOT EXISTS idx_rewards_giver ON rewards_new(giver_user_id);'
      );
      await db.run(
        'CREATE INDEX IF NOT EXISTS idx_rewards_project ON rewards_new(project_id);'
      );

      // Now drop the old rewards table if it exists and rename the new one
      await db.run('DROP TABLE IF EXISTS rewards;');
      await db.run('ALTER TABLE rewards_new RENAME TO rewards;');

      console.log('Rewards table updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating rewards table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE rewards;');
      await db.run('ALTER TABLE rewards_old RENAME TO rewards;');
      console.log('Reverted rewards table');
      return true;
    } catch (error) {
      console.error('Error reverting rewards table:', error);
      throw error;
    }
  },
};
