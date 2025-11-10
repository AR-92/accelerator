/**
 * Migration: Create article likes table
 * Creates the article_likes table for tracking user likes on articles
 */

module.exports = {
  up: async (db) => {
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

    try {
      await db.run(createLikesTable);
      console.log('Article likes table created successfully');
    } catch (error) {
      console.error('Error creating article likes table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP TABLE IF EXISTS article_likes');
      console.log('Article likes table dropped successfully');
    } catch (error) {
      console.error('Error dropping article likes table:', error);
      throw error;
    }
  },
};
