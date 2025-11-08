// Database configuration - Supabase removed
const { logger } = require('./logger');

// Supabase client removed
const supabase = null;

// Dummy test connection function
const testConnection = async () => {
  logger.warn('Database connection not available - Supabase removed');
  return false;
};

module.exports = {
  supabase,
  testConnection,
};
