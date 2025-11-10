/**
 * Script to run learning content migrations
 */

const { db } = require('../config/database');

async function runMigrations() {
  try {
    console.log('Running learning migrations...');

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

    await db.run(createCategoriesTable);
    console.log('Learning categories table created successfully');

    // Create learning content table
    const createContentTable = `
      CREATE TABLE IF NOT EXISTS learning_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
        estimated_read_time INTEGER DEFAULT 5,
        tags TEXT,
        is_published BOOLEAN DEFAULT FALSE,
        published_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES learning_categories (id) ON DELETE CASCADE
      );
    `;

    await db.run(createContentTable);
    console.log('Learning content table created successfully');

    // Create user learning progress table
    const createProgressTable = `
      CREATE TABLE IF NOT EXISTS user_learning_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        progress_percentage INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at DATETIME,
        last_accessed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (content_id) REFERENCES learning_content (id) ON DELETE CASCADE,
        UNIQUE(user_id, content_id)
      );
    `;

    await db.run(createProgressTable);
    console.log('User learning progress table created successfully');

    // Create article likes table
    const createLikesTable = `
      CREATE TABLE IF NOT EXISTS article_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        content_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (content_id) REFERENCES learning_content (id) ON DELETE CASCADE,
        UNIQUE(user_id, content_id)
      );
    `;

    await db.run(createLikesTable);
    console.log('Article likes table created successfully');

    console.log('✅ All learning migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
