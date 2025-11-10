/**
 * Migration: Update users table to match new schema
 * Adds organization_id, deleted_at, renames columns, combines name
 */

module.exports = {
  up: async (db) => {
    try {
      // Enable foreign keys
      await db.run('PRAGMA foreign_keys = ON;');

      // Rename columns (SQLite 3.25+ supports RENAME COLUMN)
      await db.run('ALTER TABLE users RENAME COLUMN role TO user_type;');
      await db.run('ALTER TABLE users RENAME COLUMN credits TO wallet_credits;');

      // Add new columns
      await db.run('ALTER TABLE users ADD COLUMN organization_id INTEGER;');
      await db.run('ALTER TABLE users ADD COLUMN deleted_at DATETIME;');
      await db.run('ALTER TABLE users ADD COLUMN name TEXT;');

      // Combine first_name and last_name into name
      await db.run(`
        UPDATE users 
        SET name = COALESCE(first_name || ' ' || last_name, first_name, last_name, '')
        WHERE name IS NULL;
      `);

      // Add foreign key constraint (after adding column)
      await db.run(`
        CREATE TABLE users_temp (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT,
          name TEXT,
          user_type TEXT NOT NULL,
          organization_id INTEGER,
          wallet_credits INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME,
          deleted_at DATETIME,
          FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
        );
      `);

      // Copy data
      await db.run(`
        INSERT INTO users_temp (id, email, password_hash, name, user_type, organization_id, wallet_credits, created_at, updated_at, deleted_at)
        SELECT id, email, password_hash, name, user_type, organization_id, wallet_credits, created_at, updated_at, deleted_at
        FROM users;
      `);

      // Drop old table and rename
      await db.run('DROP TABLE users;');
      await db.run('ALTER TABLE users_temp RENAME TO users;');

      // Create indexes
      await db.run('CREATE INDEX IF NOT EXISTS idx_users_organization_id ON users(organization_id);');

      console.log('Users table updated successfully');
    } catch (error) {
      console.error('Error updating users table:', error);
      throw error;
    }
  },

  down: async (db) => {
    // Revert is complex, perhaps no-op or recreate old schema
    console.log('Rollback not implemented for users schema update');
  },
};
