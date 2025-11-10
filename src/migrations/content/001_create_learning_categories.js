/**
 * Migration: Create learning categories table
 * Creates the learning_categories table for organizing learning content
 */

module.exports = {
  up: async (db) => {
    // Create learning categories table
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS learning_categories (
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
      console.log('Learning categories table created successfully');
    } catch (error) {
      console.error('Error creating learning categories table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS learning_categories');
      console.log('Learning categories table dropped successfully');
    } catch (error) {
      console.error('Error dropping learning categories table:', error);
      throw error;
    }
  },
};
