import sql from '../../db.js';
import logger from '../utils/logger.js';

class DatabaseService {
  constructor() {
    this.sql = sql;
    this.tableName = 'todos'; // Default table, can be overridden
  }

  // Generic CRUD operations
  async create(table, data) {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map((_, i) => `$${i + 1}`);

      const query = `
        INSERT INTO ${table} (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *
      `;

      const result = await this.sql.unsafe(query, values);
      logger.debug(`Created record in ${table} with ID: ${result[0]?.id}`);
      return result[0];
    } catch (error) {
      logger.error(`Error creating record in ${table}:`, error);
      throw error;
    }
  }

  async read(table, id = null, filters = {}) {
    try {
      let query = `SELECT * FROM ${table}`;
      const conditions = [];
      const values = [];

      if (id) {
        conditions.push('id = $1');
        values.push(id);
      }

      // Apply additional filters
      Object.keys(filters).forEach(key => {
        conditions.push(`${key} = $${values.length + 1}`);
        values.push(filters[key]);
      });

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const result = await this.sql.unsafe(query, values);
      return result;
    } catch (error) {
      console.error(`Error reading from ${table}:`, error);
      throw error;
    }
  }

  async update(table, id, data) {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');

      const query = `
        UPDATE ${table}
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const result = await this.sql.unsafe(query, [id, ...values]);
      return result[0];
    } catch (error) {
      console.error(`Error updating record in ${table}:`, error);
      throw error;
    }
  }

  async delete(table, id) {
    try {
      const query = `DELETE FROM ${table} WHERE id = $1`;
      await this.sql.unsafe(query, [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting record from ${table}:`, error);
      throw error;
    }
  }

  // Todo-specific methods (since we're using this for todos)
  async getAllTodos() {
    try {
      const query = `
        SELECT * FROM todos
        ORDER BY created_at DESC
      `;
      return await this.sql.unsafe(query);
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  async createTodo(title, description = null) {
    try {
      const query = `
        INSERT INTO todos (title, description, completed, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *
      `;
      const result = await this.sql.unsafe(query, [title, description, false]);
      return result[0];
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  async updateTodo(id, updates) {
    try {
      const columns = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');

      const query = `
        UPDATE todos
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const result = await this.sql.unsafe(query, [id, ...values]);
      return result[0];
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  async deleteTodo(id) {
    try {
      const query = `DELETE FROM todos WHERE id = $1`;
      await this.sql.unsafe(query, [id]);
      return true;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  // Database health check
  async testConnection() {
    try {
      await this.sql`SELECT 1`;
      logger.debug('Database connection test successful');
      return true;
    } catch (error) {
      logger.error('Database connection test failed:', error);
      return false;
    }
  }

  // Close connection (optional - postgres handles this automatically)
  async close() {
    try {
      await this.sql.end();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  }
}

export default new DatabaseService();