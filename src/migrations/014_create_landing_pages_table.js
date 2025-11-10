/**
 * Migration: Create landing pages table
 * Creates table for managing landing page content sections
 */

module.exports = {
  up: async (db) => {
    const createLandingPagesTable = `
      CREATE TABLE IF NOT EXISTS landing_pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_type TEXT NOT NULL DEFAULT 'hero',
        title TEXT NOT NULL,
        subtitle TEXT,
        content TEXT,
        image_url TEXT,
        button_text TEXT,
        button_url TEXT,
        "order" INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        metadata TEXT, -- JSON string for additional data
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create indexes for better query performance
    const createIndexes = `
      CREATE INDEX IF NOT EXISTS idx_landing_pages_section_type ON landing_pages(section_type);
      CREATE INDEX IF NOT EXISTS idx_landing_pages_order ON landing_pages("order");
      CREATE INDEX IF NOT EXISTS idx_landing_pages_active ON landing_pages(is_active);
    `;

    try {
      await db.run(createLandingPagesTable);
      await db.run(createIndexes);

      console.log('Landing pages table created successfully');
    } catch (error) {
      console.error('Error creating landing pages table:', error);
      throw error;
    }
  },

  down: async (db) => {
    try {
      await db.run('DROP INDEX IF EXISTS idx_landing_pages_active');
      await db.run('DROP INDEX IF EXISTS idx_landing_pages_order');
      await db.run('DROP INDEX IF EXISTS idx_landing_pages_section_type');
      await db.run('DROP TABLE IF EXISTS landing_pages');

      console.log('Landing pages table dropped successfully');
    } catch (error) {
      console.error('Error dropping landing pages table:', error);
      throw error;
    }
  },
};
