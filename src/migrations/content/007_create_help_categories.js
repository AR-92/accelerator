/**
 * Migration: Create help categories table
 * Creates the help_categories table for organizing help content
 */

module.exports = {
  up: async (db) => {
    // Create help categories table
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS help_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        color TEXT DEFAULT '#3B82F6',
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await db.run(createCategoriesTable);
      console.log('Help categories table created successfully');
    } catch (error) {
      console.error('Error creating help categories table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS help_categories');
      console.log('Help categories table dropped successfully');
    } catch (error) {
      console.error('Error dropping help categories table:', error);
      throw error;
    }
  },
};
