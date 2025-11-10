/**
 * Migration: Create help articles table
 * Creates the help_articles table for storing help content
 */

module.exports = {
  up: async (db) => {
    // Create help articles table
    const createArticlesTable = `
      CREATE TABLE IF NOT EXISTS help_articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL,
        featured_image TEXT,
        read_time_minutes INTEGER DEFAULT 3,
        difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
        tags TEXT, -- JSON array of tags
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT TRUE,
        view_count INTEGER DEFAULT 0,
        helpful_count INTEGER DEFAULT 0,
        author_name TEXT,
        author_bio TEXT,
        author_image TEXT,
        seo_title TEXT,
        seo_description TEXT,
        seo_keywords TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES help_categories (id) ON DELETE CASCADE
      );
    `;

    try {
      await db.run(createArticlesTable);
      console.log('Help articles table created successfully');
    } catch (error) {
      console.error('Error creating help articles table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS help_articles');
      console.log('Help articles table dropped successfully');
    } catch (error) {
      console.error('Error dropping help articles table:', error);
      throw error;
    }
  },
};
