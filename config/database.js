// PostgreSQL Database configuration
const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'accelerator_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? true : false,
  // Connection pool settings
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
});

// PostgreSQL database interface
class MigrationDBInterface {
  constructor(pool) {
    this.pool = pool;
  }

  async run(sql, params = []) {
    const client = await this.pool.connect();
    try {
      // Convert parameters from ? to $1, $2, etc.
      let paramIndex = 1;
      const convertedSql = sql.replace(/\?/g, () => {
        return '$' + paramIndex++;
      });

      // Convert SQLite syntax to PostgreSQL
      let finalSql = convertedSql
        .replace(
          /INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi,
          'SERIAL PRIMARY KEY'
        )
        .replace(/\bDATETIME/g, 'TIMESTAMP');

      // Convert INSERT OR IGNORE to ON CONFLICT
      if (finalSql.toUpperCase().includes('INSERT OR IGNORE')) {
        finalSql = finalSql.replace(
          /INSERT\s+OR\s+IGNORE\s+INTO/gi,
          'INSERT INTO'
        );
        if (!finalSql.toUpperCase().includes('ON CONFLICT')) {
          finalSql += ' ON CONFLICT DO NOTHING';
        }
      }

      // Remove backticks and replace with double quotes
      finalSql = finalSql.replace(/`/g, '"');

      const result = await client.query(finalSql, params);
      return {
        lastID: result.rows && result.rows[0] ? result.rows[0].id : undefined,
        changes: result.rowCount || 0,
      };
    } finally {
      client.release();
    }
  }

  async exec(sql, callback) {
    const client = await this.pool.connect();
    try {
      // Convert parameters from ? to $1, $2, etc.
      let paramIndex = 1;
      const convertedSql = sql.replace(/\?/g, () => {
        return '$' + paramIndex++;
      });

      // Convert SQLite syntax to PostgreSQL
      let finalSql = convertedSql
        .replace(
          /INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi,
          'SERIAL PRIMARY KEY'
        )
        .replace(/\bDATETIME/g, 'TIMESTAMP');

      // Convert INSERT OR IGNORE to ON CONFLICT
      if (finalSql.toUpperCase().includes('INSERT OR IGNORE')) {
        finalSql = finalSql.replace(
          /INSERT\s+OR\s+IGNORE\s+INTO/gi,
          'INSERT INTO'
        );
        if (!finalSql.toUpperCase().includes('ON CONFLICT')) {
          finalSql += ' ON CONFLICT DO NOTHING';
        }
      }

      // Remove backticks and replace with double quotes
      finalSql = finalSql.replace(/`/g, '"');

      await client.query(finalSql);
      callback(null); // No error
    } catch (error) {
      callback(error);
    } finally {
      client.release();
    }
  }

  async all(sql, params = []) {
    const client = await this.pool.connect();
    try {
      // Convert parameters from ? to $1, $2, etc.
      let paramIndex = 1;
      const convertedSql = sql.replace(/\?/g, () => {
        return '$' + paramIndex++;
      });

      // Remove backticks and replace with double quotes
      const finalSql = convertedSql.replace(/`/g, '"');

      const result = await client.query(finalSql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async get(sql, params = []) {
    const client = await this.pool.connect();
    try {
      // Convert parameters from ? to $1, $2, etc.
      let paramIndex = 1;
      const convertedSql = sql.replace(/\?/g, () => {
        return '$' + paramIndex++;
      });

      // Remove backticks and replace with double quotes
      const finalSql = convertedSql.replace(/`/g, '"');

      const result = await client.query(finalSql, params);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}

// Create a special instance of the migration database interface
const migrationDB = new MigrationDBInterface(pool);

// Additional promisified database methods for async/await usage
const dbRun = async (sql, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return {
      id: result.rows[0] ? result.rows[0].id : null,
      changes: result.rowCount,
    };
  } finally {
    client.release();
  }
};

const dbAll = async (sql, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows;
  } finally {
    client.release();
  }
};

const dbGet = async (sql, params = []) => {
  const client = await pool.connect();
  try {
    // Convert parameters from ? to $1, $2, etc.
    let paramIndex = 1;
    const convertedSql = sql.replace(/\?/g, () => {
      return '$' + paramIndex++;
    });

    // Remove backticks and replace with double quotes
    const finalSql = convertedSql.replace(/`/g, '"');

    const result = await client.query(finalSql, params);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

// Test connection function
const testConnection = async () => {
  const { Logger } = require('../src/utils/logger');
  const dbLogger = new Logger('Database');

  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    dbLogger.info('PostgreSQL connection established successfully');
    return true;
  } catch (error) {
    dbLogger.error('PostgreSQL connection test failed', error);
    return false;
  }
};

// Run migrations function
const runMigrations = async () => {
  const { Logger } = require('../src/utils/logger');
  const dbLogger = new Logger('Database');

  try {
    // Check if the main tables already exist (indicating the complete schema is in place)
    // If the users table exists, we assume the complete schema is already set up
    const client = await pool.connect();
    try {
      // Check if a key table (users) from our complete schema exists
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);

      if (result.rows[0].exists) {
        dbLogger.info(
          'Complete database schema already exists, skipping migrations'
        );
        return;
      }
    } finally {
      client.release();
    }

    // If the complete schema doesn't exist, apply the schema from SQL file
    dbLogger.info('Applying database schema from SQL file');
    
    const fs = require('fs');
    const path = require('path');
    const schemaFile = path.join(__dirname, '..', 'sql', 'database-schema.sql');
    
    if (!fs.existsSync(schemaFile)) {
      throw new Error(`Schema file not found: ${schemaFile}`);
    }
    
    const schemaSql = fs.readFileSync(schemaFile, 'utf8');
    const schemaClient = await pool.connect();
    try {
      await schemaClient.query(schemaSql);
      dbLogger.info('Database schema applied successfully');
    } finally {
      schemaClient.release();
    }
    
    // Optionally load seed data if needed
    const seedFile = path.join(__dirname, '..', 'src', 'database', 'seedData.sql');
    if (fs.existsSync(seedFile)) {
      dbLogger.info('Loading seed data from SQL file');
      const seedSql = fs.readFileSync(seedFile, 'utf8');
      const seedClient = await pool.connect();
      try {
        await seedClient.query(seedSql);
        dbLogger.info('Seed data loaded successfully');
      } finally {
        seedClient.release();
      }
    }
  } catch (error) {
    dbLogger.error('Error running migrations', error);
    throw error;
  }
};

module.exports = {
  pool,
  db: migrationDB, // Export the migration-compatible interface
  dbRun,
  dbAll,
  dbGet,
  testConnection,
  runMigrations,
};
