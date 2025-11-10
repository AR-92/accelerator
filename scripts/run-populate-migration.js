/**
 * Migration runner script for populating articles
 */

const { db } = require('../config/database');

async function runMigration() {
  try {
    console.log('Running articles population migrations...');

    // Run learning articles population
    const learningMigration = require('./src/migrations/002_populate_learning_articles');
    await learningMigration.up(db);
    console.log('✅ Learning articles populated');

    // Run help articles population
    const helpMigration = require('./src/migrations/004_populate_help_articles');
    await helpMigration.up(db);
    console.log('✅ Help articles populated');

    // Run corporates population
    const corporatesMigration = require('./src/migrations/013_populate_corporates');
    await corporatesMigration.up(db);
    console.log('✅ Corporates populated');

    console.log('✅ All data populated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
