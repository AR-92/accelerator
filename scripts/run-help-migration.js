/**
 * Script to run help content migrations
 */

const { db } = require('../config/database');

async function runMigrations() {
  try {
    console.log('Running help migrations...');

    // Create help categories table
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS help_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        icon TEXT,
        color TEXT DEFAULT '#10B981',
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await db.run(createCategoriesTable);
    console.log('Help categories table created successfully');

    // Create help content table
    const createContentTable = `
      CREATE TABLE IF NOT EXISTS help_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        tags TEXT,
        is_published BOOLEAN DEFAULT FALSE,
        published_at DATETIME,
        helpful_votes INTEGER DEFAULT 0,
        total_views INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES help_categories (id) ON DELETE CASCADE
      );
    `;

    await db.run(createContentTable);
    console.log('Help content table created successfully');

    console.log('✅ All help migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
