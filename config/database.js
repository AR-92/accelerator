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
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      role TEXT DEFAULT 'startup',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createSessionsTable = `
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      sess TEXT NOT NULL,
      expire INTEGER NOT NULL
    );
  `;

  const createIdeasTable = `
    CREATE TABLE IF NOT EXISTS ideas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      href TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      typeIcon TEXT NOT NULL,
      rating INTEGER NOT NULL,
      description TEXT,
      tags TEXT,
      isFavorite BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  const createPortfolioTable = `
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
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
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  const createVotesTable = `
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      ideaSlug TEXT NOT NULL,
      marketViability INTEGER NOT NULL,
      realWorldProblem INTEGER NOT NULL,
      innovation INTEGER NOT NULL,
      technicalFeasibility INTEGER NOT NULL,
      scalability INTEGER NOT NULL,
      marketSurvival INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  const createProjectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  const createTeamsTable = `
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT DEFAULT 'member',
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  const createCollaborationsTable = `
    CREATE TABLE IF NOT EXISTS collaborations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      project_id INTEGER,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (project_id) REFERENCES projects (id)
    );
  `;

  const createAiInteractionsTable = `
    CREATE TABLE IF NOT EXISTS ai_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      model_type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      response TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  const createReportsTable = `
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  const createSubscriptionsTable = `
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      plan TEXT NOT NULL,
      credits INTEGER DEFAULT 0,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  const createNotificationsTable = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      read_status BOOLEAN DEFAULT FALSE,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `;

  try {
    await db.run(createUsersTable);
    await db.run(createSessionsTable);
    await db.run(createIdeasTable);
    await db.run(createPortfolioTable);
    await db.run(createVotesTable);
    await db.run(createProjectsTable);
    await db.run(createTeamsTable);
    await db.run(createCollaborationsTable);
    await db.run(createAiInteractionsTable);
    await db.run(createReportsTable);
    await db.run(createSubscriptionsTable);
    await db.run(createNotificationsTable);
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
