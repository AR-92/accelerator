/**
 * Migration: Create organizations table
 * Creates table for corporate/enterprise/startup organizations
 */

module.exports = {
  up: async (db) => {
    const createOrganizationsTable = `
      CREATE TABLE IF NOT EXISTS organizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        org_type TEXT NOT NULL,        -- 'corporate'|'enterprise'|'startup'
        owner_user_id INTEGER,         -- who created/owns the org
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `;

    // Create indexes
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_organizations_owner_user_id ON organizations(owner_user_id);
      CREATE INDEX IF NOT EXISTS idx_organizations_org_type ON organizations(org_type);
    `;

    try {
      await db.run(createOrganizationsTable);
      await db.run(createIndexes);
      console.log('Organizations table created successfully');
    } catch (error) {
      console.error('Error creating organizations table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_organizations_org_type');
      await db.run('DROP INDEX IF EXISTS idx_organizations_owner_user_id');
      await db.run('DROP TABLE IF EXISTS organizations');
      console.log('Organizations table dropped successfully');
    } catch (error) {
      console.error('Error dropping organizations table:', error);
      throw error;
    }
  },
};
