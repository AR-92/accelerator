const { db } = require('../../config/database');

async function up() {
  return new Promise((resolve, reject) => {
    // Add theme and bio columns to users table
    const sql = `
      ALTER TABLE users ADD COLUMN theme TEXT DEFAULT 'system';
      ALTER TABLE users ADD COLUMN bio TEXT DEFAULT '';
    `;

    db.exec(sql, (err) => {
      if (err) {
        // Check if columns already exist (SQLite doesn't support IF NOT EXISTS for ALTER)
        if (err.message.includes('duplicate column name')) {
          console.log('User settings columns already exist');
          resolve();
        } else {
          reject(err);
        }
      } else {
        console.log('Added theme and bio columns to users table');
        resolve();
      }
    });
  });
}

async function down() {
  return new Promise((resolve, reject) => {
    // Remove theme and bio columns (if needed for rollback)
    // Note: SQLite doesn't support DROP COLUMN, so this is a no-op
    console.log('Rollback not supported for column additions in SQLite');
    resolve();
  });
}

module.exports = { up, down };
