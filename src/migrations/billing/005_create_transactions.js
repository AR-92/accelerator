/**
 * Migration: Create transactions table
 */

module.exports = {
  up: async (db) => {
    const createTransactionsTable = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        tx_type TEXT NOT NULL,
        amount_cents INTEGER NOT NULL,
        credits INTEGER DEFAULT 0,
        currency TEXT DEFAULT 'USD',
        provider TEXT,
        provider_tx_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(tx_type);
    `;

    try {
      await db.run(createTransactionsTable);
      await db.run(createIndexes);
      console.log('Transactions table created successfully');
    } catch (error) {
      console.error('Error creating transactions table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_transactions_type');
      await db.run('DROP INDEX IF EXISTS idx_transactions_user');
      await db.run('DROP TABLE IF EXISTS transactions');
      console.log('Transactions table dropped successfully');
    } catch (error) {
      console.error('Error dropping transactions table:', error);
      throw error;
    }
  },
};
