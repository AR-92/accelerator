// Database configuration
const sqlite3 = require('sqlite3').verbose();
const MigrationRunner = require('../src/database/MigrationRunner');

// Create database instance
const dbPath = require('path').resolve(__dirname, '../accelerator.db');
console.log('Database path:', dbPath);
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Promisified database methods for migrations
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

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

// Run migrations function
const runMigrations = async () => {
  try {
    const migrationRunner = new MigrationRunner({ 
      run: (sql, params) => {
        return new Promise((resolve, reject) => {
          db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
          });
        });
      },
      all: (sql, params) => {
        return new Promise((resolve, reject) => {
          db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          });
        });
      },
      get: (sql, params) => {
        return new Promise((resolve, reject) => {
          db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
      }
    });
    
    await migrationRunner.runMigrations();
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
};

module.exports = {
  db,
  dbRun,
  dbAll,
  dbGet,
  testConnection,
  runMigrations,
};
