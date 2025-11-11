/**
 * Complete database reset and repopulation script
 * Cleans all data, runs migrations, and populates with consistent sample data
 */

// Set environment variable to skip database initialization
process.env.SKIP_DB_INIT = 'true';

// Use the same database connection as the application
const { db, dbRun, dbAll, dbGet } = require('../config/database');

// Create a promisified db object for migrations
const promisifiedDb = {
  run: dbRun,
  all: dbAll,
  get: dbGet,
};

// Override the initializeDatabase function to prevent automatic initialization
const originalInitializeDatabase = global.initializeDatabase;
global.initializeDatabase = () => {
  console.log('Skipping automatic database initialization...');
};

const fs = require('fs');
const path = require('path');

// Database operations are now imported from config/database.js

async function cleanDatabase() {
  console.log('🧹 Cleaning database...');

  // Get all table names
  const tables = await dbAll(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
  );

  // Drop all tables
  for (const table of tables) {
    try {
      await dbRun(`DROP TABLE IF EXISTS ${table.name}`);
      console.log(`✅ Dropped table: ${table.name}`);
    } catch (error) {
      console.error(`❌ Error dropping table ${table.name}:`, error.message);
    }
  }

  console.log('✅ Database cleaned successfully!');
}

async function runMigrations() {
  console.log('🚀 Running all migrations...');

  // First, create the basic users table that other migrations depend on
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      role TEXT DEFAULT 'startup',
      theme TEXT DEFAULT 'system',
      bio TEXT DEFAULT '',
      credits INTEGER DEFAULT 0,
      organization_id INTEGER,
      wallet_credits INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      banned BOOLEAN DEFAULT FALSE,
      ban_reason TEXT,
      deleted_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await dbRun(createUsersTable);
    console.log('✅ Base users table created');
  } catch (error) {
    console.error('❌ Error creating base users table:', error.message);
  }

  const migrationsDir = path.join(__dirname, '../src/migrations');

  // Define migration order based on dependencies
  const migrationOrder = [
    // User updates
    'user/001_add_user_settings.js',
    'user/002_add_user_credits.js',
    'user/003_add_user_status_and_banned.js',
    'user/004_create_admin_activity_log.js',
    'user/005_update_users_schema.js',

    // Content tables
    'content/001_create_learning_categories.js',
    'content/002_create_learning_articles.js',
    'content/007_create_help_categories.js',
    'content/011_create_files_table.js',

    // Business tables
    'business/001_create_startups_table.js',
    'business/002_create_enterprises_table.js',
    'business/003_create_corporates_table.js',
    'business/005_create_organizations_table.js',

    // Project tables
    'project/001_update_projects_schema.js',
    'project/002_rename_teams_to_collaborators.js',
    'project/003_create_tasks.js',
    'project/004_rename_collaborations_to_messages.js',
    'project/005_create_project_stages.js',

    // Idea tables
    'idea/001_update_votes_schema.js',

    // Billing tables
    'billing/001_create_packages.js',
    'billing/002_create_billing.js',
    'billing/003_create_rewards.js',
    'billing/004_create_rewards.js',
    'billing/005_create_transactions.js',
    'billing/006_create_payment_methods.js',

    // AI tables
    'ai/001_create_ai_models.js',
    'ai/002_create_ai_workflows.js',
    'ai/003_create_workflow_steps.js',
    'ai/004_create_workflow_executions.js',
    'ai/005_create_workflow_inputs.js',
    'ai/006_create_workflow_outputs.js',
    'ai/007_create_workflow_feedback.js',

    // Landing pages
    'landing/001_create_landing_pages_table.js',
    'landing/002_populate_landing_pages.js',
  ];

  for (const migrationFile of migrationOrder) {
    const migrationPath = path.join(migrationsDir, migrationFile);

    if (fs.existsSync(migrationPath)) {
      try {
        const migration = require(migrationPath);
        if (migration.up) {
          await migration.up(promisifiedDb);
          console.log(`✅ Migration completed: ${migrationFile}`);
        }
      } catch (error) {
        console.error(`❌ Migration failed: ${migrationFile}`, error.message);
        // Continue with other migrations
      }
    } else {
      console.log(`⚠️  Migration file not found: ${migrationFile}`);
    }
  }

  console.log('✅ All migrations completed!');
}

async function populateData() {
  console.log('📝 Populating sample data...');

  const populateScripts = [
    'create-admin.js',
    'populate-users.js',
    'populate-sample-organizations.js',
    'populate-startups.js',
    'populate-enterprises.js',
    'populate-corporates.js',
    'populate-ideas.js',
    'populate-projects.js',
    'populate-sample-projects.js',
    'populate-collaborations.js',
    'populate-portfolio.js',
    'populate-workflow-steps.js',
    'setup-ai-workflows.js',
    'populate-sample-data.js',
  ];

  for (const scriptFile of populateScripts) {
    const scriptPath = path.join(__dirname, scriptFile);

    if (fs.existsSync(scriptPath)) {
      try {
        console.log(`Running ${scriptFile}...`);
        const script = require(scriptPath);

        // If it's a function, call it
        if (typeof script === 'function') {
          await script();
        } else if (script.populateSampleData) {
          await script.populateSampleData();
        } else if (script.default && typeof script.default === 'function') {
          await script.default();
        }

        console.log(`✅ Script completed: ${scriptFile}`);
      } catch (error) {
        console.error(`❌ Script failed: ${scriptFile}`, error.message);
        // Continue with other scripts
      }
    } else {
      console.log(`⚠️  Script file not found: ${scriptFile}`);
    }
  }

  console.log('✅ All data population completed!');
}

async function createBasicTables() {
  console.log('🏗️  Creating basic application tables...');

  // Users table should already exist from migrations, just ensure sessions and ideas tables exist

  // Create sessions table
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS sessions (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expire INTEGER NOT NULL
      );
    `);
    console.log('✅ Sessions table ready');
  } catch (error) {
    console.error('❌ Error creating sessions table:', error.message);
  }

  // Create ideas table if it doesn't exist
  try {
    await dbRun(`
      CREATE TABLE IF NOT EXISTS ideas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        href TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        typeIcon TEXT NOT NULL,
        rating INTEGER NOT NULL,
        description TEXT,
        tags TEXT,
        isFavorite BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);
    console.log('✅ Ideas table ready');
  } catch (error) {
    console.error('❌ Error creating ideas table:', error.message);
  }

  console.log('✅ Basic tables created!');
}

async function verifyData() {
  console.log('🔍 Verifying data integrity...');

  const tables = [
    'users',
    'organizations',
    'startups',
    'enterprises',
    'corporates',
    'projects',
    'ideas',
    'ai_models',
    'ai_workflows',
    'workflow_steps',
    'transactions',
    'payment_methods',
    'packages',
    'billing',
    'rewards',
    'votes',
    'admin_activity_log',
  ];

  for (const table of tables) {
    try {
      const result = await dbAll(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`📊 ${table}: ${result[0].count} records`);
    } catch (error) {
      console.log(
        `📊 ${table}: Table doesn't exist or error - ${error.message}`
      );
    }
  }

  console.log('✅ Data verification completed!');
}

async function resetAndPopulate() {
  try {
    console.log('🔄 Starting complete database reset and repopulation...\n');

    await cleanDatabase();
    console.log('');

    await runMigrations();
    console.log('');

    await populateData();
    console.log('');

    console.log('🎉 Database reset and repopulation completed successfully!');
    console.log('📋 Summary:');
    console.log('   - All old data cleaned');
    console.log('   - Schema migrated to latest version');
    console.log('   - Consistent sample data populated');
    console.log('   - Ready for use!');
  } catch (error) {
    console.error('❌ Reset and repopulation failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the script
resetAndPopulate();
