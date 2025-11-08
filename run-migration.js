/**
 * Migration runner script
 * Runs database migrations for the application
 */

const { db } = require('./config/database');

async function runMigration() {
  try {
    console.log('Running migrations...');

    // Run learning content migration
    const learningMigration = require('./src/migrations/001_create_learning_content_tables');
    await learningMigration.up(db);
    console.log('✅ Learning content migration completed');

    // Run help content migration
    const helpMigration = require('./src/migrations/003_create_help_content_tables');
    await helpMigration.up(db);
    console.log('✅ Help content migration completed');

    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
