/**
 * Migration: Create billing table
 * Creates the billing table for managing transactions
 */

module.exports = {
  up: async (db) => {
    // Create billing table for transactions
    const createBillingTable = `
      CREATE TABLE IF NOT EXISTS billing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        package_id INTEGER,
        transaction_id TEXT,
        amount REAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
        payment_method TEXT,
        description TEXT,
        metadata TEXT, -- JSON metadata
        processed_at DATETIME,
        invoice_url TEXT,
        refund_amount REAL DEFAULT 0,
        refund_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (package_id) REFERENCES packages (id) ON DELETE SET NULL
      );
    `;

    try {
      await db.run(createBillingTable);
      console.log('Billing table created successfully');
    } catch (error) {
      console.error('Error creating billing table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS billing');
      console.log('Billing table dropped successfully');
    } catch (error) {
      console.error('Error dropping billing table:', error);
      throw error;
    }
  },
};
