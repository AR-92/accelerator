const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'accelerator_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

console.log('Resetting database...');

try {
  // Kill all connections to the database
  execSync(`psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${dbConfig.database}' AND pid <> pg_backend_pid();"`);

  // Drop and recreate the database
  execSync(`psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d postgres -c "DROP DATABASE IF EXISTS ${dbConfig.database};"`);
  execSync(`psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d postgres -c "CREATE DATABASE ${dbConfig.database};"`);

  console.log('Database dropped and recreated successfully');

  // Apply schema
  const schemaSQL = fs.readFileSync(path.join(__dirname, 'sql/database-schema.sql'), 'utf8');
  execSync(`psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} -c "${schemaSQL.replace(/"/g, '\\"')}"`);

  console.log('Database schema applied successfully');

  // Apply seed data if exists
  const seedPath = path.join(__dirname, 'src/database/seedData.sql');
  if (fs.existsSync(seedPath)) {
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    execSync(`psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} -c "${seedSQL.replace(/"/g, '\\"')}"`);
    console.log('Seed data loaded successfully');
  }

  console.log('Database reset completed successfully!');
} catch (error) {
  console.error('Error resetting database:', error.message);
  process.exit(1);
}