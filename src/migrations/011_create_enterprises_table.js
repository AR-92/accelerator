/**
 * Migration: Create enterprises table
 * Creates table for managing enterprise companies
 */

module.exports = {
  up: async (db) => {
    const createEnterprisesTable = `
      CREATE TABLE IF NOT EXISTS enterprises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        industry TEXT NOT NULL,
        founded_date DATE,
        website TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'acquired', 'failed')),
        company_size TEXT CHECK (company_size IN ('small', 'medium', 'large', 'enterprise')),
        revenue REAL,
        location TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `;

    // Create indexes for better query performance
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_enterprises_user_id ON enterprises(user_id);
      CREATE INDEX IF NOT EXISTS idx_enterprises_industry ON enterprises(industry);
      CREATE INDEX IF NOT EXISTS idx_enterprises_status ON enterprises(status);
      CREATE INDEX IF NOT EXISTS idx_enterprises_company_size ON enterprises(company_size);
      CREATE INDEX IF NOT EXISTS idx_enterprises_created_at ON enterprises(created_at);
    `;

    try {
      await db.run(createEnterprisesTable);
      await db.run(createIndexes);

      console.log('Enterprises table created successfully');
    } catch (error) {
      console.error('Error creating enterprises table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_enterprises_created_at');
      await db.run('DROP INDEX IF EXISTS idx_enterprises_company_size');
      await db.run('DROP INDEX IF EXISTS idx_enterprises_status');
      await db.run('DROP INDEX IF EXISTS idx_enterprises_industry');
      await db.run('DROP INDEX IF EXISTS idx_enterprises_user_id');
      await db.run('DROP TABLE IF EXISTS enterprises');

      console.log('Enterprises table dropped successfully');
    } catch (error) {
      console.error('Error dropping enterprises table:', error);
      throw error;
    }
  },
};
