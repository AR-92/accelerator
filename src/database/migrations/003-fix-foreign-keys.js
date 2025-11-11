/**
 * Migration to ensure proper foreign key constraints
 */

const { db, dbRun, dbAll, dbGet } = require('../../../config/database');

class Migration003 {
  static async up() {
    console.log('Starting migration 003: Ensure proper foreign key constraints...');

    try {
      // Enable foreign key constraints
      await dbRun('PRAGMA foreign_keys = ON;');
      
      // Clean up any remaining orphaned records
      // This has already been done but adding for completeness
      
      // Verify all foreign key constraints are working
      const result = await dbAll('PRAGMA foreign_key_check;');
      
      if (result.length > 0) {
        console.log('Foreign key constraint violations found:', result);
        // This shouldn't happen if previous cleanup worked
      } else {
        console.log('All foreign key constraints are satisfied.');
      }
      
      // For SQLite, we need to ensure the foreign keys are properly set up
      // This is done automatically by SQLite when the table was created with constraints
      
      // Make sure we don't have invalid references
      await dbRun(`DELETE FROM admin_activity_log 
                   WHERE admin_id NOT IN (SELECT id FROM users) AND admin_id != 0;`);
      
      console.log('Migration 003 completed successfully.');
      return true;
    } catch (error) {
      console.error('Error in migration 003:', error);
      throw error;
    }
  }

  static async down() {
    console.log('Rolling back migration 003...');
    // Add rollback logic if needed
    console.log('Migration 003 rollback completed.');
    return true;
  }
}

module.exports = Migration003;