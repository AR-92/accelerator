/**
 * Database Migration Runner
 * Executes migrations in the correct order from organized feature directories
 */

const fs = require('fs');
const path = require('path');

class MigrationRunner {
  constructor(db) {
    this.db = db;
    // Use the organized migrations directory
    this.migrationsRootDir = path.join(__dirname, '..', 'migrations');
  }

  async runMigrations() {
    console.log('Starting database migration process...');

    try {
      // Create or update migrations table to ensure it has the feature column
      await this.ensureMigrationsTable();

      // Get all migration files from organized feature directories
      const migrationFiles = await this.getAllMigrationFiles();

      console.log(`Found ${migrationFiles.length} migration files across all features`);

      // Get already executed migrations
      const executedMigrations = await this.getExecutedMigrations();

      // Execute pending migrations
      for (const migrationFile of migrationFiles) {
        const { filePath, fileName, feature, migrationName } = migrationFile;
        const fullMigrationName = `${feature}/${migrationName}`;

        if (!executedMigrations.some(m => m.name === migrationName && m.feature === feature)) {
          console.log(`Executing migration: ${fullMigrationName} from ${filePath}`);

          try {
            const MigrationClass = require(filePath);
            const success = await MigrationClass.up(this.db);

            if (success !== undefined ? success : true) {
              await this.recordMigration(migrationName, feature);
              console.log(`Migration ${fullMigrationName} completed successfully`);
            } else {
              throw new Error(`Migration ${fullMigrationName} failed to complete`);
            }
          } catch (error) {
            console.error(`Error executing migration ${fullMigrationName}:`, error);
            throw error;
          }
        } else {
          console.log(`Migration ${fullMigrationName} already executed, skipping...`);
        }
      }

      console.log('All migrations completed successfully!');
      return true;
    } catch (error) {
      console.error('Migration process failed:', error);
      throw error;
    }
  }

  async ensureMigrationsTable() {
    // First create the table with the new structure (if it doesn't exist)
    await this.db.run(`
      CREATE TABLE IF NOT EXISTS migrations_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        feature TEXT DEFAULT 'general',
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if the old table exists and has records
    const hasOldTable = await this.db.get(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='migrations' AND sql LIKE '%executed_at%'
    `);

    if (hasOldTable) {
      // Check if the old table has the feature column
      const tableInfo = await this.db.all("PRAGMA table_info(migrations)");
      const hasFeatureColumn = tableInfo.some(col => col.name === 'feature');

      if (!hasFeatureColumn) {
        // Migrate data from old table to new table, defaulting feature to 'general'
        await this.db.run(`
          INSERT OR IGNORE INTO migrations_new (name, feature, executed_at)
          SELECT name, 'general', executed_at FROM migrations
        `);
        
        // Drop the old table and rename the new one
        await this.db.run('DROP TABLE migrations;');
        await this.db.run('ALTER TABLE migrations_new RENAME TO migrations;');
      } else {
        // If the table already has the feature column, just drop the temp table
        await this.db.run('DROP TABLE migrations_new;');
      }
    } else {
      // If there was no old table, just rename the new one
      await this.db.run('ALTER TABLE migrations_new RENAME TO migrations;');
    }
  }

  async getAllMigrationFiles() {
    const featureDirs = fs.readdirSync(this.migrationsRootDir);
    let allMigrations = [];

    for (const featureDir of featureDirs) {
      const featurePath = path.join(this.migrationsRootDir, featureDir);
      
      // Skip if not a directory
      if (!fs.statSync(featurePath).isDirectory()) continue;

      // Read migration files in this feature directory
      const featureMigrations = fs
        .readdirSync(featurePath)
        .filter(file => file.endsWith('.js') && file.match(/^\d+_.+\.js$/))  // Changed from ^\d+- to ^\d+_
        .map(file => ({
          fileName: file,
          migrationName: path.basename(file, '.js'),
          feature: featureDir,
          filePath: path.join(featurePath, file)
        }))
        .sort((a, b) => {
          // Sort by numeric prefix (e.g., 001_ before 002_)
          const numA = parseInt(a.fileName.split('_')[0]);
          const numB = parseInt(b.fileName.split('_')[0]);
          return numA - numB;
        });

      allMigrations = allMigrations.concat(featureMigrations);
    }

    // Sort all migrations by feature first, then by number within each feature
    return allMigrations.sort((a, b) => {
      if (a.feature !== b.feature) {
        return a.feature.localeCompare(b.feature);
      }
      const numA = parseInt(a.fileName.split('_')[0]);
      const numB = parseInt(b.fileName.split('_')[0]);
      return numA - numB;
    });
  }

  async getExecutedMigrations() {
    const rows = await this.db.all('SELECT name, feature FROM migrations ORDER BY id');
    return rows;
  }

  async recordMigration(migrationName, feature) {
    await this.db.run('INSERT INTO migrations (name, feature) VALUES (?, ?)', [migrationName, feature]);
  }

  async rollbackLastMigration() {
    const lastMigration = await this.db.get(
      'SELECT name, feature FROM migrations ORDER BY id DESC LIMIT 1'
    );

    if (lastMigration) {
      console.log(`Rolling back migration: ${lastMigration.feature}/${lastMigration.name}`);

      // Use the organized migrations directory
      const migrationsRootDir = path.join(__dirname, '..', 'migrations');
      const featurePath = path.join(migrationsRootDir, lastMigration.feature);
      const migrationPath = path.join(featurePath, `${lastMigration.name}.js`);

      if (fs.existsSync(migrationPath)) {
        const MigrationClass = require(migrationPath);
        await MigrationClass.down(this.db);

        // Remove from executed migrations
        await this.db.run(
          'DELETE FROM migrations WHERE name = ? AND feature = ?',
          [lastMigration.name, lastMigration.feature]
        );
        console.log(`Migration ${lastMigration.feature}/${lastMigration.name} rolled back successfully`);
      } else {
        throw new Error(`Migration file not found: ${migrationPath}`);
      }
    } else {
      console.log('No migrations to rollback');
    }
  }
}

module.exports = MigrationRunner;