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

    this.tableName = 'todos'; // Default table, can be overridden
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

  // Todo-specific methods (since we're using this for todos)
  async getAllTodos() {
    try {
      logger.debug('Fetching all todos from Supabase...');
      const { data, error } = await this.supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch todos from Supabase:', {
          code: error.code,
          message: error.message,
          details: error.details,
        });
        throw error;
      }
      logger.debug(`Successfully fetched ${data.length} todos from Supabase`);
      return data;
    } catch (error) {
      logger.error('Error fetching todos:', {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async createTodo(title, description = null) {
    try {
      logger.debug(`Creating todo in Supabase: "${title}"`);
      const { data, error } = await this.supabase
        .from('todos')
        .insert([{ title, description, completed: false }])
        .select()
        .single();

      if (error) {
        logger.error('Failed to create todo in Supabase:', {
          code: error.code,
          message: error.message,
          details: error.details,
          title,
          description,
        });
        throw error;
      }
      logger.info(`Created todo in Supabase with ID: ${data.id}`);
      return data;
    } catch (error) {
      logger.error('Error creating todo:', {
        message: error.message,
        stack: error.stack,
        title,
        description,
      });
      throw error;
    }
  }

  async updateTodo(id, updates) {
    try {
      logger.debug(`Updating todo ${id} in Supabase:`, updates);
      const { data, error } = await this.supabase
        .from('todos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update todo in Supabase:', {
          code: error.code,
          message: error.message,
          details: error.details,
          id,
          updates,
        });
        throw error;
      }
      logger.info(`Updated todo ${id} in Supabase`);
      return data;
    } catch (error) {
      logger.error('Error updating todo:', {
        message: error.message,
        stack: error.stack,
        id,
        updates,
      });
      throw error;
    }
  }

  async deleteTodo(id) {
    try {
      logger.debug(`Deleting todo ${id} from Supabase`);
      const { error } = await this.supabase.from('todos').delete().eq('id', id);

      if (error) {
        logger.error('Failed to delete todo from Supabase:', {
          code: error.code,
          message: error.message,
          details: error.details,
          id,
        });
        throw error;
      }
      logger.info(`Deleted todo ${id} from Supabase`);
      return true;
    } catch (error) {
      logger.error('Error deleting todo:', {
        message: error.message,
        stack: error.stack,
        id,
      });
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
