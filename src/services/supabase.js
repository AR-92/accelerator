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
        `✅ Created record in Supabase table ${table} with ID: ${result?.id}`
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

  // Get todos with pagination and filters (for advanced queries)
  async getTodosWithFilters(filters = {}, pagination = {}) {
    try {
      const { search, status } = filters;
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.supabase.from('todos').select('*', { count: 'exact' });

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }
      if (status === 'pending') {
        query = query.eq('completed', false);
      } else if (status === 'completed') {
        query = query.eq('completed', true);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { data, count };
    } catch (error) {
      logger.error('Error fetching todos with filters:', error);
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
      logger.info(`✅ Created todo in Supabase with ID: ${data.id}`);
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
      logger.info(`✅ Updated todo ${id} in Supabase`);
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
      logger.info(`✅ Deleted todo ${id} from Supabase`);
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

  // List all tables in the database
  async getAllTables() {
    try {
      logger.debug('Fetching all tables from Supabase...');

      // Try RPC function first (requires creation in Supabase)
      const { data, error } = await this.supabase.rpc('get_table_list');

      if (!error && data) {
        const tables = data.map((row) => row.name || row).sort();
        logger.debug(
          `Successfully fetched ${tables.length} tables from Supabase via RPC: ${tables.join(', ')}`
        );
        return tables;
      }

      // Fallback: try direct query (may be restricted)
      logger.warn('RPC not available, trying direct query...');
      try {
        const { data: altData, error: altError } = await this.supabase
          .from('pg_catalog.pg_tables')
          .select('tablename')
          .eq('schemaname', 'public');

        if (!altError && altData) {
          const tables = altData
            .map((row) => row.tablename)
            .filter((name) => !name.startsWith('_'))
            .sort();
          logger.debug(
            `Successfully fetched ${tables.length} tables from Supabase via pg_catalog: ${tables.join(', ')}`
          );
          return tables;
        }
      } catch (altError) {
        logger.warn('Direct query failed:', altError.message);
      }

      // Final fallback: return known tables
      logger.warn(
        'Using fallback table list. To get full list, create RPC function in Supabase SQL Editor:'
      );
      logger.warn(`
CREATE OR REPLACE FUNCTION get_table_list()
RETURNS TABLE(name text)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT tablename::text
  FROM pg_catalog.pg_tables
  WHERE schemaname = 'public'
  AND tablename NOT LIKE '\\_%'
  ORDER BY tablename;
END;
$$;
      `);
      return ['todos']; // Known table
    } catch (error) {
      logger.error('Error fetching tables:', {
        message: error.message,
        stack: error.stack,
      });
      return ['todos'];
    }
  }

  // Database health check
  async testConnection() {
    try {
      logger.info('Testing Supabase connection...');

      // First test basic connectivity
      logger.debug('Testing Supabase client initialization...');
      if (!this.supabase) {
        logger.error('❌ Supabase client not initialized');
        return false;
      }

      logger.debug('Testing Supabase authentication...');
      const { data: authData, error: authError } =
        await this.supabase.auth.getSession();
      if (authError) {
        logger.error('❌ Supabase authentication failed:', {
          message: authError.message,
          status: authError.status,
          fullError: authError,
        });
        return false;
      }

      // Then test table access
      logger.debug('Testing Supabase table access...');
      const { data, error } = await this.supabase
        .from('todos')
        .select('id', { count: 'exact' })
        .limit(1);

      if (error) {
        console.log(
          '🔍 Full Supabase table access error:',
          JSON.stringify(error, null, 2)
        );
        logger.error('❌ Supabase table access failed:', {
          code: error.code,
          message: error.message || 'Empty error message',
          details: error.details,
          hint: error.hint,
          status: error.status,
          fullError: JSON.stringify(error),
        });

        // If table doesn't exist, provide clear instructions
        if (
          error.code === 'PGRST116' ||
          error.message?.includes('relation "public.todos" does not exist')
        ) {
          logger.error(
            '❌ SOLUTION: Create the todos table in Supabase SQL Editor'
          );
          logger.error('📋 SQL to run in Supabase Dashboard → SQL Editor:');
          logger.error(`
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);

-- Optional: Insert sample data
INSERT INTO todos (title, description, completed) VALUES
  ('Welcome to Accelerator', 'This is your first todo item!', false),
  ('Explore the features', 'Check out the HTMX interactions', false);
          `);
        }
        return false;
      }

      logger.info('✅ Supabase connection successful - todos table accessible');
      return true;
    } catch (error) {
      logger.error('❌ Database connection test failed:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      return false;
    }
  }

  // Close connection (optional - Supabase handles this automatically)
  async close() {
    // Supabase client handles connection cleanup automatically
  }
}

export { DatabaseService };
export default new DatabaseService();
