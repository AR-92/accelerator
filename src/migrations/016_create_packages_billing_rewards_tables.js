/**
 * Migration: Create packages, billing, and rewards tables
 * Creates tables for managing credit packages, billing transactions, and user rewards
 */

module.exports = {
  up: async (db) => {
    // Create packages table
    const createPackagesTable = `
      CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL DEFAULT 0,
        credits INTEGER DEFAULT 0,
        features TEXT, -- JSON array of features
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
        sort_order INTEGER DEFAULT 0,
        is_popular BOOLEAN DEFAULT FALSE,
        is_recommended BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

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

    // Insert some default packages
    const insertDefaultPackages = `
      INSERT OR IGNORE INTO packages (name, description, price, credits, features, status, sort_order, is_popular) VALUES
      ('Starter Pack', 'Perfect for getting started with basic features', 9.99, 100, '["Basic AI assistance", "Community access", "Email support"]', 'active', 1, false),
      ('Professional Pack', 'Advanced features for growing businesses', 29.99, 500, '["Advanced AI assistance", "Priority support", "Analytics dashboard", "API access"]', 'active', 2, true),
      ('Enterprise Pack', 'Complete solution for large organizations', 99.99, 2000, '["Unlimited AI assistance", "Dedicated support", "Custom integrations", "White-label options", "Advanced analytics"]', 'active', 3, false);
    `;

    try {
      await db.run(createPackagesTable);
      await db.run(createBillingTable);
      await db.run(createRewardsTable);
      await db.run(createIndexes);
      await db.run(insertDefaultPackages);

      console.log('Packages, billing, and rewards tables created successfully');
    } catch (error) {
      console.error(
        'Error creating packages, billing, and rewards tables:',
        error
      );
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS rewards');
      await db.run('DROP TABLE IF EXISTS billing');
      await db.run('DROP TABLE IF EXISTS packages');

      console.log('Packages, billing, and rewards tables dropped successfully');
    } catch (error) {
      console.error(
        'Error dropping packages, billing, and rewards tables:',
        error
      );
      throw error;
    }
  },
};
