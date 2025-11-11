/**
 * Migration: Create payment_methods table
 */

module.exports = {
  up: async (db) => {
    const createPaymentMethodsTable = `
      CREATE TABLE IF NOT EXISTS payment_methods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        provider TEXT NOT NULL,
        provider_method_id TEXT NOT NULL,
        last4 TEXT,
        brand TEXT,
        exp_month INTEGER,
        exp_year INTEGER,
        is_default INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    try {
      await db.run(createPaymentMethodsTable);
      console.log('Payment methods table created successfully');
    } catch (error) {
      console.error('Error creating payment methods table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS payment_methods');
      console.log('Payment methods table dropped successfully');
    } catch (error) {
      console.error('Error dropping payment methods table:', error);
      throw error;
    }
  },
};
