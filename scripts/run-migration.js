/**
 * Migration runner script
 * Runs database migrations for the application
 */

const { db } = require('../config/database');

async function runMigration() {
  try {
    console.log('Running migrations...');

    // Run learning content migration
    const learningMigration = require('../src/migrations/content/001_create_learning_categories');
    await learningMigration.up(db);
    console.log('✅ Learning content migration completed');

    // Run help content migration
    const helpMigration = require('../src/migrations/content/007_create_help_categories');
    await helpMigration.up(db);
    console.log('✅ Help content migration completed');

    // Run user settings migration
    const userSettingsMigration = require('../src/migrations/user/001_add_user_settings');
    await userSettingsMigration.up(db);
    console.log('✅ User settings migration completed');

    // Run user credits migration
    const userCreditsMigration = require('../src/migrations/user/002_add_user_credits');
    await userCreditsMigration.up(db);
    console.log('✅ User credits migration completed');

    // Run user status and banned migration
    const userStatusBannedMigration = require('../src/migrations/user/003_add_user_status_and_banned');
    await userStatusBannedMigration.up(db);
    console.log('✅ User status and banned migration completed');

    // Run admin activity log migration
    const adminActivityLogMigration = require('../src/migrations/user/004_create_admin_activity_log');
    await adminActivityLogMigration.up(db);
    console.log('✅ Admin activity log migration completed');

    // Run startups table migration
    const startupsMigration = require('../src/migrations/business/001_create_startups_table');
    await startupsMigration.up(db);
    console.log('✅ Startups table migration completed');

    // Run enterprises table migration
    const enterprisesMigration = require('../src/migrations/business/002_create_enterprises_table');
    await enterprisesMigration.up(db);
    console.log('✅ Enterprises table migration completed');

    // Run corporates table migration
    const corporatesMigration = require('../src/migrations/business/003_create_corporates_table');
    await corporatesMigration.up(db);
    console.log('✅ Corporates table migration completed');

    // Run landing pages table migration
    const landingPagesMigration = require('../src/migrations/landing/001_create_landing_pages_table');
    await landingPagesMigration.up(db);
    console.log('✅ Landing pages table migration completed');

    // Run landing pages sample data migration
    const landingPagesDataMigration = require('../src/migrations/landing/002_populate_landing_pages');
    await landingPagesDataMigration.up(db);
    console.log('✅ Landing pages sample data migration completed');

    // Run packages, billing, and rewards migration
    const packagesBillingRewardsMigration = require('../src/migrations/billing/001_create_packages');
    await packagesBillingRewardsMigration.up(db);
    const billingMigration = require('../src/migrations/billing/002_create_billing');
    await billingMigration.up(db);
    const rewardsMigration = require('../src/migrations/billing/003_create_rewards');
    await rewardsMigration.up(db);
    console.log('✅ Packages, billing, and rewards tables migration completed');

    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
