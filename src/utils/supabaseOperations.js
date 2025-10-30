const { supabase } = require('../../config/database');

// Check if supabase is available
const isSupabaseAvailable = !!supabase;

// Example user operations
const userOperations = {
  // Create a new user
  createUser: async (userData) => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user:', error.message);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async () => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting users:', error.message);
      throw error;
    }
  },

  // Update user
  updateUser: async (id, updates) => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw error;
    }
  }
};

// Example product operations
const productOperations = {
  // Create a new product
  createProduct: async (productData) => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error.message);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting product:', error.message);
      throw error;
    }
  },

  // Get all products
  getAllProducts: async () => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting products:', error.message);
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, updates) => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error.message);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting product:', error.message);
      throw error;
    }
  }
};

// Example auth operations
const authOperations = {
  // Sign up
  signUp: async (email, password) => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  },

  // Sign in
  signIn: async (email, password) => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error.message);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error signing out:', error.message);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    if (!isSupabaseAvailable) {
      throw new Error('Database not available. Please configure Supabase credentials.');
    }
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error.message);
      throw error;
    }
  }
};

module.exports = {
  userOperations,
  productOperations,
  authOperations
};