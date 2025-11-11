/**
 * Migration: Update projects table to match new schema
 */

module.exports = {
  up: async (db) => {
    try {
      // Add new columns
      await db.run('ALTER TABLE projects ADD COLUMN organization_id INTEGER;');
      await db.run(
        "ALTER TABLE projects ADD COLUMN visibility TEXT DEFAULT 'private';"
      );
      await db.run('ALTER TABLE projects ADD COLUMN deleted_at DATETIME;');

      // Rename user_id to owner_user_id (if supported)
      // Note: SQLite may not support RENAME COLUMN in all versions, so we'll add and update
      await db.run('ALTER TABLE projects ADD COLUMN owner_user_id INTEGER;');
      await db.run('UPDATE projects SET owner_user_id = user_id;');
      await db.run('ALTER TABLE projects DROP COLUMN user_id;'); // If supported

      // Add foreign keys (recreate table for proper constraints)
      await db.run(`
        CREATE TABLE projects_temp (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          owner_user_id INTEGER NOT NULL,
          organization_id INTEGER,
          title TEXT NOT NULL,
          description TEXT,
          visibility TEXT DEFAULT 'private',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME,
          deleted_at DATETIME,
          FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
        );
      `);

      // Copy data
      await db.run(`
        INSERT INTO projects_temp (id, owner_user_id, organization_id, title, description, visibility, created_at, updated_at, deleted_at)
        SELECT id, owner_user_id, organization_id, title, description, visibility, created_at, updated_at, deleted_at
        FROM projects;
      `);

      // Drop and rename
      await db.run('DROP TABLE projects;');
      await db.run('ALTER TABLE projects_temp RENAME TO projects;');

      // Create indexes
      await db.run(
        'CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_user_id);'
      );
      await db.run(
        'CREATE INDEX IF NOT EXISTS idx_projects_organization ON projects(organization_id);'
      );

      console.log('Projects table updated successfully');
    } catch (error) {
      console.error('Error updating projects table:', error);
      throw error;
    }
  },

  down: async (db) => {
    console.log('Rollback not implemented for projects schema update');
  },
};
