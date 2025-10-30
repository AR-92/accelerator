// Supabase configuration
const { createClient } = require('@supabase/supabase-js');

// Create a single Supabase client for the entire project
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client only if credentials are provided
let supabase;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('Supabase credentials not provided. Database operations will not work.');
  supabase = null;
}

// Test the connection
const testConnection = async () => {
  try {
    if (!supabase) {
      console.warn('Supabase client not initialized');
      return false;
    }
    
    // Test with a simple query to check connection
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase connection failed:', err.message);
    return false;
  }
};

module.exports = {
  supabase,
  testConnection
};