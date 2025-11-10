/**
 * Migration: Create packages table
 * Creates the packages table for managing credit packages
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

    try {
      await db.run(createPackagesTable);
      console.log('Packages table created successfully');
    } catch (error) {
      console.error('Error creating packages table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS packages');
      console.log('Packages table dropped successfully');
    } catch (error) {
      console.error('Error dropping packages table:', error);
      throw error;
    }
  },
};
