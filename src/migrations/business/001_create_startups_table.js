/**
 * Migration: Create startups table
 * Creates table for managing startup companies
 */

module.exports = {
  up: async (db) => {
    const createStartupsTable = `
      CREATE TABLE IF NOT EXISTS startups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        industry TEXT NOT NULL,
        founded_date DATE,
        website TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'acquired', 'failed')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `;

    // Create indexes for better query performance
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_startups_user_id ON startups(user_id);
      CREATE INDEX IF NOT EXISTS idx_startups_industry ON startups(industry);
      CREATE INDEX IF NOT EXISTS idx_startups_status ON startups(status);
      CREATE INDEX IF NOT EXISTS idx_startups_created_at ON startups(created_at);
    `;

    try {
      await db.run(createStartupsTable);
      await db.run(createIndexes);

      console.log('Startups table created successfully');
    } catch (error) {
      console.error('Error creating startups table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_startups_created_at');
      await db.run('DROP INDEX IF EXISTS idx_startups_status');
      await db.run('DROP INDEX IF EXISTS idx_startups_industry');
      await db.run('DROP INDEX IF EXISTS idx_startups_user_id');
      await db.run('DROP TABLE IF EXISTS startups');

      console.log('Startups table dropped successfully');
    } catch (error) {
      console.error('Error dropping startups table:', error);
      throw error;
    }
  },
};
