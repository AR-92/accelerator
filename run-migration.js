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

    // Run user settings migration
    const userSettingsMigration = require('./src/migrations/006_add_user_settings');
    await userSettingsMigration.up(db);
    console.log('✅ User settings migration completed');

    // Run user credits migration
    const userCreditsMigration = require('./src/migrations/007_add_user_credits');
    await userCreditsMigration.up(db);
    console.log('✅ User credits migration completed');

    // Run user status and banned migration
    const userStatusBannedMigration = require('./src/migrations/008_add_user_status_and_banned');
    await userStatusBannedMigration.up(db);
    console.log('✅ User status and banned migration completed');

    // Run admin activity log migration
    const adminActivityLogMigration = require('./src/migrations/009_create_admin_activity_log');
    await adminActivityLogMigration.up(db);
    console.log('✅ Admin activity log migration completed');

    // Run startups table migration
    const startupsMigration = require('./src/migrations/010_create_startups_table');
    await startupsMigration.up(db);
    console.log('✅ Startups table migration completed');

    // Run enterprises table migration
    const enterprisesMigration = require('./src/migrations/011_create_enterprises_table');
    await enterprisesMigration.up(db);
    console.log('✅ Enterprises table migration completed');

    // Run corporates table migration
    const corporatesMigration = require('./src/migrations/012_create_corporates_table');
    await corporatesMigration.up(db);
    console.log('✅ Corporates table migration completed');

    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
