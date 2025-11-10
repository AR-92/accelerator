const { db } = require('../../../config/database');

async function up() {
  return new Promise((resolve, reject) => {
    // Add status and banned columns to users table
    const sql = `
      ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active';
      ALTER TABLE users ADD COLUMN banned BOOLEAN DEFAULT FALSE;
      ALTER TABLE users ADD COLUMN banned_reason TEXT DEFAULT '';
      ALTER TABLE users ADD COLUMN banned_at DATETIME;
    `;

    db.exec(sql, (err) => {
      if (err) {
        // Check if columns already exist (SQLite doesn't support IF NOT EXISTS for ALTER)
        if (err.message.includes('duplicate column name')) {
          console.log('Status and banned columns already exist');
          resolve();
        } else {
          reject(err);
        }
      } else {
        console.log('Added status and banned columns to users table');
        resolve();
      }
    });
  });
}

async function down() {
  return new Promise((resolve, reject) => {
    // Remove columns (if needed for rollback)
    // Note: SQLite doesn't support DROP COLUMN, so this is a no-op
    console.log('Rollback not supported for column additions in SQLite');
    resolve();
  });
}

module.exports = { up, down };
