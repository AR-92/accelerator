// Database configuration
const sqlite3 = require('sqlite3').verbose();

// Create database instance
const db = new sqlite3.Database('./accelerator.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Initialize database tables
const initializeDatabase = async () => {
  const createIdeasTable = `
    CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      href TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      typeIcon TEXT NOT NULL,
      rating INTEGER NOT NULL,
      description TEXT,
      tags TEXT,
      isFavorite BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createPortfolioTable = `
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      tags TEXT,
      votes INTEGER DEFAULT 0,
      isPublic BOOLEAN DEFAULT TRUE,
      image TEXT,
      createdDate DATE,
      updatedDate DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createVotesTable = `
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ideaSlug TEXT NOT NULL,
      marketViability INTEGER NOT NULL,
      realWorldProblem INTEGER NOT NULL,
      innovation INTEGER NOT NULL,
      technicalFeasibility INTEGER NOT NULL,
      scalability INTEGER NOT NULL,
      marketSurvival INTEGER NOT NULL,
      userId TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await db.run(createIdeasTable);
    await db.run(createPortfolioTable);
    await db.run(createVotesTable);
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize tables on startup
initializeDatabase();

// Test connection function
const testConnection = async () => {
  return new Promise((resolve) => {
    db.get('SELECT 1', (err) => {
      if (err) {
        console.error('Database connection test failed:', err.message);
        resolve(false);
      } else {
        console.log('Database connection test successful.');
        resolve(true);
      }
    });
  });
};

module.exports = {
  db,
  testConnection,
};
