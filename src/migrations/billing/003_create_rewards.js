/**
 * Migration: Create rewards table
 * Creates the rewards table for managing user rewards
 */

module.exports = {
  up: async (db) => {
    // Create rewards table
    const createRewardsTable = `
      CREATE TABLE IF NOT EXISTS rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        credits INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
        earned_at DATETIME,
        expires_at DATETIME,
        metadata TEXT, -- JSON metadata
        admin_id INTEGER, -- Admin who granted the reward
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES users (id) ON DELETE SET NULL
      );
    `;

    // Create indexes for better performance
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
      CREATE INDEX IF NOT EXISTS idx_packages_sort_order ON packages(sort_order);
      CREATE INDEX IF NOT EXISTS idx_billing_user_id ON billing(user_id);
      CREATE INDEX IF NOT EXISTS idx_billing_status ON billing(status);
      CREATE INDEX IF NOT EXISTS idx_billing_created_at ON billing(created_at);
      CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON rewards(user_id);
      CREATE INDEX IF NOT EXISTS idx_rewards_status ON rewards(status);
      CREATE INDEX IF NOT EXISTS idx_rewards_type ON rewards(type);
    `;

    try {
      await db.run(createRewardsTable);
      await db.run(createIndexes);
      console.log('Rewards table and indexes created successfully');
    } catch (error) {
      console.error('Error creating rewards table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_rewards_type');
      await db.run('DROP INDEX IF EXISTS idx_rewards_status');
      await db.run('DROP INDEX IF EXISTS idx_rewards_user_id');
      await db.run('DROP INDEX IF EXISTS idx_billing_created_at');
      await db.run('DROP INDEX IF EXISTS idx_billing_status');
      await db.run('DROP INDEX IF EXISTS idx_billing_user_id');
      await db.run('DROP INDEX IF EXISTS idx_packages_sort_order');
      await db.run('DROP INDEX IF EXISTS idx_packages_status');
      await db.run('DROP TABLE IF EXISTS rewards');
      console.log('Rewards table and indexes dropped successfully');
    } catch (error) {
      console.error('Error dropping rewards table:', error);
      throw error;
    }
  },
};
