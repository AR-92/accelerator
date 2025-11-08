/**
 * Migration runner script
 * Runs database migrations for the application
 */

const { db } = require('./config/database');
const migration = require('./src/migrations/001_create_learning_content_tables');

async function runMigration() {
  try {
    console.log('Running learning content migration...');

    await migration.up(db);

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
