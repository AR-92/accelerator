/**
 * Migration: Create learning content tables
 * Creates tables for learning categories, articles, and user progress
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

    // Create learning articles table
    const createArticlesTable = `
      CREATE TABLE IF NOT EXISTS learning_articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT NOT NULL,
        featured_image TEXT,
        read_time_minutes INTEGER DEFAULT 5,
        difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
        tags TEXT, -- JSON array of tags
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT TRUE,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        author_name TEXT,
        author_bio TEXT,
        author_image TEXT,
        seo_title TEXT,
        seo_description TEXT,
        seo_keywords TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES learning_categories (id) ON DELETE CASCADE
      );
    `;

    // Create user learning progress table
    const createProgressTable = `
      CREATE TABLE IF NOT EXISTS user_learning_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        article_id INTEGER NOT NULL,
        progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
        is_completed BOOLEAN DEFAULT FALSE,
        time_spent_seconds INTEGER DEFAULT 0,
        last_read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (article_id) REFERENCES learning_articles (id) ON DELETE CASCADE,
        UNIQUE(user_id, article_id)
      );
    `;

    // Create article likes table
    const createLikesTable = `
      CREATE TABLE IF NOT EXISTS article_likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        article_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (article_id) REFERENCES learning_articles (id) ON DELETE CASCADE,
        UNIQUE(user_id, article_id)
      );
    `;

    // Insert default categories
    const insertCategories = `
      INSERT OR IGNORE INTO learning_categories (name, slug, description, icon, color, sort_order) VALUES
      ('Getting Started', 'getting-started', 'Learn the fundamentals of entrepreneurship', 'Rocket', '#10B981', 1),
      ('Courses', 'courses', 'Structured learning paths for entrepreneurs', 'BookOpen', '#8B5CF6', 2),
      ('Tutorials', 'tutorials', 'Step-by-step guides and video tutorials', 'PlayCircle', '#F59E0B', 3),
      ('Resources', 'resources', 'Additional materials and references', 'FileText', '#EF4444', 4);
    `;

    // Insert sample articles
    const insertArticles = `
      INSERT OR IGNORE INTO learning_articles (
        category_id, title, slug, excerpt, content, read_time_minutes,
        difficulty_level, tags, is_featured, author_name
      ) VALUES
      (1, 'From Idea to MVP', 'from-idea-to-mvp',
       'Building your first product from concept to launch',
       'This comprehensive guide walks you through the journey of transforming a business idea into a minimum viable product (MVP). Learn about idea validation, prototyping, and launching your first version.',
       8, 'beginner', '["startup", "mvp", "validation"]', 1, 'Sarah Johnson'),

      (1, 'Market Research Fundamentals', 'market-research-fundamentals',
       'Understanding your target market and customers',
       'Market research is crucial for startup success. This article covers various research methods, tools, and strategies to understand your target audience and validate your business idea.',
       6, 'beginner', '["market-research", "customers", "validation"]', 0, 'Mike Chen'),

      (2, 'Financial Planning for Startups', 'financial-planning-startups',
       'Budgeting, forecasting, and financial management',
       'Learn the essentials of financial planning for startups, including budgeting, cash flow management, financial forecasting, and key financial metrics to track.',
       12, 'intermediate', '["finance", "budgeting", "forecasting"]', 1, 'David Rodriguez'),

      (3, 'Creating a Compelling Pitch Deck', 'creating-pitch-deck',
       'Design and deliver an effective investor presentation',
       'A step-by-step guide to creating a pitch deck that captures investor attention. Learn about structure, design principles, and delivery techniques.',
       10, 'intermediate', '["pitch-deck", "investors", "presentation"]', 0, 'Lisa Wang'),

      (4, 'Legal Templates and Checklists', 'legal-templates-checklists',
       'Essential legal documents for startups',
       'Access to important legal templates including NDAs, term sheets, incorporation documents, and other essential legal paperwork for startups.',
       5, 'beginner', '["legal", "templates", "documentation"]', 0, 'Robert Kim');
    `;

    try {
      await db.run(createCategoriesTable);
      await db.run(createArticlesTable);
      await db.run(createProgressTable);
      await db.run(createLikesTable);
      await db.run(insertCategories);
      await db.run(insertArticles);

      console.log('Learning content tables created successfully');
    } catch (error) {
      console.error('Error creating learning content tables:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS article_likes');
      await db.run('DROP TABLE IF EXISTS user_learning_progress');
      await db.run('DROP TABLE IF EXISTS learning_articles');
      await db.run('DROP TABLE IF EXISTS learning_categories');

      console.log('Learning content tables dropped successfully');
    } catch (error) {
      console.error('Error dropping learning content tables:', error);
      throw error;
    }
  },
};
