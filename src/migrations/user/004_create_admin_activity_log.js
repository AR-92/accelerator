const { db } = require('../../config/database');

async function up() {
  return new Promise((resolve, reject) => {
    // Create admin activity log table
    const sql = `
      CREATE TABLE IF NOT EXISTS admin_activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admin_id INTEGER NOT NULL,
        admin_email TEXT NOT NULL,
        action TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_id INTEGER,
        details TEXT,
        ip TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users (id)
      );
    `;

    db.run(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Created admin activity log table');
        resolve();
      }
    });
  });
}

async function down() {
  return new Promise((resolve, reject) => {
    // Drop table (if needed for rollback)
    const sql = 'DROP TABLE IF EXISTS admin_activity_log';
    db.run(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Dropped admin activity log table');
        resolve();
      }
    });
  });
}

module.exports = { up, down };
