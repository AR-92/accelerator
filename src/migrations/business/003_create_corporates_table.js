/**
 * Migration: Create corporates table
 * Creates table for managing corporate companies
 */

module.exports = {
  up: async (db) => {
    const createCorporatesTable = `
      CREATE TABLE IF NOT EXISTS corporates (
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
        headquarters TEXT,
        employee_count INTEGER,
        sector TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      );
    `;

    // Create indexes for better query performance
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_corporates_user_id ON corporates(user_id);
      CREATE INDEX IF NOT EXISTS idx_corporates_industry ON corporates(industry);
      CREATE INDEX IF NOT EXISTS idx_corporates_status ON corporates(status);
      CREATE INDEX IF NOT EXISTS idx_corporates_company_size ON corporates(company_size);
      CREATE INDEX IF NOT EXISTS idx_corporates_sector ON corporates(sector);
      CREATE INDEX IF NOT EXISTS idx_corporates_created_at ON corporates(created_at);
    `;

    try {
      await db.run(createCorporatesTable);
      await db.run(createIndexes);

      console.log('Corporates table created successfully');
    } catch (error) {
      console.error('Error creating corporates table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_corporates_created_at');
      await db.run('DROP INDEX IF EXISTS idx_corporates_sector');
      await db.run('DROP INDEX IF EXISTS idx_corporates_company_size');
      await db.run('DROP INDEX IF EXISTS idx_corporates_status');
      await db.run('DROP INDEX IF EXISTS idx_corporates_industry');
      await db.run('DROP INDEX IF EXISTS idx_corporates_user_id');
      await db.run('DROP TABLE IF EXISTS corporates');

      console.log('Corporates table dropped successfully');
    } catch (error) {
      console.error('Error dropping corporates table:', error);
      throw error;
    }
  },
};
