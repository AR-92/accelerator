const { db } = require('../../../config/database');

async function up() {
  return new Promise((resolve, reject) => {
    // Add credits column to users table
    const sql = `
      ALTER TABLE users ADD COLUMN credits INTEGER DEFAULT 0;
    `;

    db.exec(sql, (err) => {
      if (err) {
        // Check if column already exists (SQLite doesn't support IF NOT EXISTS for ALTER)
        if (err.message.includes('duplicate column name')) {
          console.log('Credits column already exists');
          resolve();
        } else {
          reject(err);
        }
      } else {
        console.log('Added credits column to users table');
        resolve();
      }
    });
  });
}

async function down() {
  return new Promise((resolve, reject) => {
    // Remove credits column (if needed for rollback)
    // Note: SQLite doesn't support DROP COLUMN, so this is a no-op
    console.log('Rollback not supported for column additions in SQLite');
    resolve();
  });
}

module.exports = { up, down };
