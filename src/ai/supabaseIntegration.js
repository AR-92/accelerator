const { supabase } = require('../config/database');
const { aiConfig } = require('./config');

class SupabaseAIService {
  constructor() {
    this.supabase = supabase;
  }

  // Method to fetch user data based on query
  async fetchUserData(query) {
    try {
      // Extract potential user identifiers from the query
      const userIdMatch = query.match(/user id[:\s]+(\w+)/i);
      const emailMatch = query.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      const nameMatch = query.match(/(?:named|name[:\s]+)([A-Za-z\s]+)/i);

      let user = null;

      if (userIdMatch) {
        const userId = userIdMatch[1];
        const { data, error } = await this.supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        user = data;
      } else if (emailMatch) {
        const email = emailMatch[0];
        const { data, error } = await this.supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (error) throw error;
        user = data;
      } else if (nameMatch) {
        const name = nameMatch[1].trim();
        const { data, error } = await this.supabase
          .from('users')
          .select('*')
          .ilike('name', `%${name}%`)
          .single();

        if (error) throw error;
        user = data;
      }

      return user ? { userData: user } : {};
    } catch (error) {
      console.error('Error fetching user data:', error.message);
      return {};
    }
  }

  // Method to fetch product data based on query
  async fetchProductData(query) {
    try {
      // Extract potential product identifiers from the query
      const productIdMatch = query.match(/product id[:\s]+(\w+)/i);
      const productNameMatch = query.match(/(?:product|item)[:\s]+([A-Za-z0-9\s-]+)/i);

      let products = [];

      if (productIdMatch) {
        const productId = productIdMatch[1];
        const { data, error } = await this.supabase
          .from('products')
          .select('*')
          .eq('id', productId);

        if (error) throw error;
        products = data;
      } else if (productNameMatch) {
        const productName = productNameMatch[1].trim();
        const { data, error } = await this.supabase
          .from('products')
          .select('*')
          .ilike('name', `%${productName}%`);

        if (error) throw error;
        products = data;
      }

      return products.length > 0 ? { productData: products } : {};
    } catch (error) {
      console.error('Error fetching product data:', error.message);
      return {};
    }
  }

  // Method to save conversation history to Supabase
  async saveConversation(userId, query, response, context = {}) {
    try {
      const { data, error } = await this.supabase
        .from('conversations')
        .insert([{
          user_id: userId,
          query: query,
          response: response,
          context: context,
          timestamp: new Date().toISOString()
        }]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving conversation:', error.message);
      throw error;
    }
  }

  // Method to get conversation history for a user
  async getConversationHistory(userId, limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting conversation history:', error.message);
      return [];
    }
  }

  // Method to save agent state to Supabase (for long-running agents)
  async saveAgentState(agentId, state) {
    try {
      const { data, error } = await this.supabase
        .from('agent_states')
        .upsert([{
          id: agentId,
          state: state,
          updated_at: new Date().toISOString()
        }], { onConflict: 'id' });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving agent state:', error.message);
      throw error;
    }
  }

  // Method to load agent state from Supabase
  async loadAgentState(agentId) {
    try {
      const { data, error } = await this.supabase
        .from('agent_states')
        .select('state')
        .eq('id', agentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return null;
        }
        throw error;
      }

      return data.state;
    } catch (error) {
      console.error('Error loading agent state:', error.message);
      return null;
    }
  }

  // Method to fetch data based on query (general method)
  async fetchContextData(query) {
    const userData = await this.fetchUserData(query);
    const productData = await this.fetchProductData(query);

    return {
      ...userData,
      ...productData
    };
  }
}

// Initialize the service
const supabaseAIService = new SupabaseAIService();

module.exports = {
  SupabaseAIService,
  supabaseAIService
};