import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

class DatabaseService {
  constructor() {
    // Require Supabase credentials
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_KEY are required. Please set them in your .env file.'
      );
    }

    // Use Supabase
    this.supabase = createClient(supabaseUrl, supabaseKey);
    logger.info('Using Supabase database connection');
  }

  // Generic CRUD operations
  async create(table, data) {
    try {
      logger.debug(`Creating record in Supabase table ${table}:`, data);
      const { data: result, error } = await this.supabase
        .from(table)
        .insert([data])
        .select()
        .single();

      if (error) {
        logger.error(`Failed to create record in Supabase table ${table}:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          data,
        });
        throw error;
      }
      logger.debug(
        `Created record in Supabase table ${table} with ID: ${result?.id}`
      );
      return result;
    } catch (error) {
      logger.error(`Error creating record in ${table}:`, {
        message: error.message,
        stack: error.stack,
        table,
        data,
      });
      throw error;
    }
  }

  // Generic CRUD operations
  async create(table, data) {
    try {
      logger.debug(`Creating record in Supabase table ${table}:`, data);
      const { data: result, error } = await this.supabase
        .from(table)
        .insert([data])
        .select()
        .single();

      if (error) {
        logger.error(`Failed to create record in Supabase table ${table}:`, {
          code: error.code,
          message: error.message,
          details: error.details,
          data,
        });
        throw error;
      }
      logger.debug(
        `Created record in Supabase table ${table} with ID: ${result?.id}`
      );
      return result;
    } catch (error) {
      logger.error(`Error creating record in ${table}:`, {
        message: error.message,
        stack: error.stack,
        table,
        data,
      });
      throw error;
    }
  }

  async read(table, id = null, filters = {}) {
    try {
      let query = this.supabase.from(table).select('*');

      if (id) {
        query = query.eq('id', id);
      }

      // Apply additional filters
      Object.keys(filters).forEach((key) => {
        query = query.eq(key, filters[key]);
      });

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error reading from ${table}:`, error);
      throw error;
    }
  }

  async update(table, id, data) {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      logger.error(`Error updating record in ${table}:`, error);
      throw error;
    }
  }

  async delete(table, id) {
    try {
      const { error } = await this.supabase.from(table).delete().eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error(`Error deleting record from ${table}:`, error);
      throw error;
    }
  }

  // Upsert user setting
  async upsertUserSetting(userId, category, key, value, type = 'string') {
    try {
      logger.debug(
        `Upserting user setting: ${userId}, ${category}, ${key}, ${value}, ${type}`
      );
      const { data, error } = await this.supabase
        .from('user_settings')
        .upsert(
          {
            user_id: userId,
            category,
            key,
            value: String(value),
            type,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,category,key',
          }
        )
        .select()
        .single();

      if (error) {
        logger.error(`Supabase error upserting user setting:`, error);
        throw error;
      }

      logger.debug(`Successfully upserted user setting:`, data);
      return data;
    } catch (error) {
      logger.error(`Error upserting user setting:`, error);
      throw error;
    }
  }

  // Get user setting
  async getUserSetting(userId, category, key) {
    try {
      logger.debug(`Getting user setting: ${userId}, ${category}, ${key}`);
      const { data, error } = await this.supabase
        .from('user_settings')
        .select('value, type')
        .eq('user_id', userId)
        .eq('category', category)
        .eq('key', key)
        .single();

      if (error && error.code !== 'PGRST116') {
        logger.error(`Supabase error getting user setting:`, error);
        throw error;
      }

      if (!data) {
        logger.debug(
          `No user setting found for ${userId}, ${category}, ${key}`
        );
        return null;
      }

      let parsedValue = data.value;
      if (data.type === 'boolean') parsedValue = Boolean(data.value);
      else if (data.type === 'number') parsedValue = Number(data.value);
      else if (data.type === 'array' || data.type === 'object')
        parsedValue = JSON.parse(data.value);

      logger.debug(`Retrieved user setting: ${parsedValue}`);
      return parsedValue;
    } catch (error) {
      logger.error(`Error getting user setting:`, error);
      throw error;
    }
  }

  // Close connection (optional - Supabase handles this automatically)
  async close() {
    // Supabase client handles connection cleanup automatically
  }
}

export { DatabaseService };
export default new DatabaseService();
