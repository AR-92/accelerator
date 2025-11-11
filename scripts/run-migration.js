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

    // Run new schema migrations
    console.log('Running new schema migrations...');

    // Update users schema
    const updateUsersSchemaMigration = require('../src/migrations/user/005_update_users_schema');
    await updateUsersSchemaMigration.up(db);
    console.log('✅ Update users schema migration completed');

    // Create organizations
    const organizationsMigration = require('../src/migrations/business/005_create_organizations_table');
    await organizationsMigration.up(db);
    console.log('✅ Organizations table migration completed');

    // Update projects
    const updateProjectsMigration = require('../src/migrations/project/001_update_projects_schema');
    await updateProjectsMigration.up(db);
    console.log('✅ Update projects schema migration completed');

    // Rename teams to collaborators
    const renameTeamsMigration = require('../src/migrations/project/002_rename_teams_to_collaborators');
    await renameTeamsMigration.up(db);
    console.log('✅ Rename teams to collaborators migration completed');

    // Update votes
    const updateVotesMigration = require('../src/migrations/idea/001_update_votes_schema');
    await updateVotesMigration.up(db);
    console.log('✅ Update votes schema migration completed');

    // Update rewards
    const updateRewardsMigration = require('../src/migrations/billing/004_create_rewards');
    await updateRewardsMigration.up(db);
    console.log('✅ Update rewards table migration completed');

    // Create transactions
    const transactionsMigration = require('../src/migrations/billing/005_create_transactions');
    await transactionsMigration.up(db);
    console.log('✅ Transactions table migration completed');

    // Create payment methods
    const paymentMethodsMigration = require('../src/migrations/billing/006_create_payment_methods');
    await paymentMethodsMigration.up(db);
    console.log('✅ Payment methods table migration completed');

    // Create tasks
    const tasksMigration = require('../src/migrations/project/003_create_tasks');
    await tasksMigration.up(db);
    console.log('✅ Tasks table migration completed');

    // Rename collaborations to messages
    const renameMessagesMigration = require('../src/migrations/project/004_rename_collaborations_to_messages');
    await renameMessagesMigration.up(db);
    console.log('✅ Rename collaborations to messages migration completed');

    // Create files table
    const filesMigration = require('../src/migrations/content/011_create_files_table');
    await filesMigration.up(db);
    console.log('✅ Files table migration completed');

    // Create project stages
    const projectStagesMigration = require('../src/migrations/project/005_create_project_stages');
    await projectStagesMigration.up(db);
    console.log('✅ Project stages table migration completed');

    // AI Workflow migrations
    const aiModelsMigration = require('../src/migrations/ai/001_create_ai_models');
    await aiModelsMigration.up(db);
    console.log('✅ AI Models table migration completed');

    const aiWorkflowsMigration = require('../src/migrations/ai/002_create_ai_workflows');
    await aiWorkflowsMigration.up(db);
    console.log('✅ AI Workflows table migration completed');

    const workflowStepsMigration = require('../src/migrations/ai/003_create_workflow_steps');
    await workflowStepsMigration.up(db);
    console.log('✅ Workflow Steps table migration completed');

    const workflowExecutionsMigration = require('../src/migrations/ai/004_create_workflow_executions');
    await workflowExecutionsMigration.up(db);
    console.log('✅ Workflow Executions table migration completed');

    const workflowInputsMigration = require('../src/migrations/ai/005_create_workflow_inputs');
    await workflowInputsMigration.up(db);
    console.log('✅ Workflow Inputs table migration completed');

    const workflowOutputsMigration = require('../src/migrations/ai/006_create_workflow_outputs');
    await workflowOutputsMigration.up(db);
    console.log('✅ Workflow Outputs table migration completed');

    const workflowFeedbackMigration = require('../src/migrations/ai/007_create_workflow_feedback');
    await workflowFeedbackMigration.up(db);
    console.log('✅ Workflow Feedback table migration completed');

    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
