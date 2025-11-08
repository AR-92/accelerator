// Database configuration - Supabase removed

// Supabase client removed
const supabase = null;

// Dummy test connection function
const testConnection = async () => {
  console.warn('Database connection not available - Supabase removed');
  return false;
};

module.exports = {
  supabase,
  testConnection,
};
