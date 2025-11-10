/**
 * Migration: Create user learning progress table
 * Creates the user_learning_progress table for tracking user progress through articles
 */

module.exports = {
  up: async (db) => {
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

    try {
      await db.run(createProgressTable);
      console.log('User learning progress table created successfully');
    } catch (error) {
      console.error('Error creating user learning progress table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS user_learning_progress');
      console.log('User learning progress table dropped successfully');
    } catch (error) {
      console.error('Error dropping user learning progress table:', error);
      throw error;
    }
  },
};
