import logger from '../../utils/logger.js';

class TodoService {
  constructor(databaseService) {
    this.db = databaseService;
  }

  async createTodo(todoData) {
    try {
      logger.debug('Creating todo:', todoData.title);
      const result = await this.db.create('todos', {
        ...todoData,
        completed: todoData.completed || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      logger.info(`✅ Created todo with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error('Error creating todo:', error);
      throw error;
    }
  }

  async getTodoById(id) {
    try {
      const todos = await this.db.read('todos', id);
      return todos[0] || null;
    } catch (error) {
      logger.error(`Error fetching todo ${id}:`, error);
      throw error;
    }
  }

  async getAllTodos(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.db.supabase
        .from('todos')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.completed !== undefined) query = query.eq('completed', filters.completed);
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, count, page, limit };
    } catch (error) {
      logger.error('Error fetching todos:', error);
      throw error;
    }
  }

  async updateTodo(id, updates) {
    try {
      logger.debug(`Updating todo ${id}:`, updates);
      const result = await this.db.update('todos', id, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      logger.info(`✅ Updated todo ${id}`);
      return result;
    } catch (error) {
      logger.error(`Error updating todo ${id}:`, error);
      throw error;
    }
  }

  async deleteTodo(id) {
    try {
      logger.debug(`Deleting todo ${id}`);
      await this.db.delete('todos', id);
      logger.info(`✅ Deleted todo ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting todo ${id}:`, error);
      throw error;
    }
  }

  async toggleTodoStatus(id) {
    try {
      logger.debug(`Toggling todo status ${id}`);
      const todo = await this.getTodoById(id);
      if (!todo) {
        throw new Error('Todo not found');
      }

      const result = await this.updateTodo(id, { completed: !todo.completed });
      logger.info(`✅ Toggled todo ${id} status to ${!todo.completed}`);
      return result;
    } catch (error) {
      logger.error(`Error toggling todo status ${id}:`, error);
      throw error;
    }
  }

  async getTodoStats() {
    try {
      const todos = await this.getAllTodos({}, { limit: 1000 }); // Get all for stats

      const stats = {
        total: todos.count || 0,
        completed: todos.data?.filter(t => t.completed).length || 0,
        pending: (todos.count || 0) - (todos.data?.filter(t => t.completed).length || 0),
        completionRate: todos.count > 0 ? Math.round((todos.data?.filter(t => t.completed).length || 0) / todos.count * 100) : 0
      };

      return stats;
    } catch (error) {
      logger.error('Error fetching todo stats:', error);
      throw error;
    }
  }

  // Bulk operations
  async bulkUpdateStatus(ids, completed) {
    try {
      logger.debug(`Bulk updating ${ids.length} todos to completed: ${completed}`);

      const updates = ids.map(id => this.updateTodo(id, { completed }));
      const results = await Promise.all(updates);

      logger.info(`✅ Bulk updated ${results.length} todos`);
      return results;
    } catch (error) {
      logger.error('Error bulk updating todos:', error);
      throw error;
    }
  }

  async bulkDelete(ids) {
    try {
      logger.debug(`Bulk deleting ${ids.length} todos`);

      const deletions = ids.map(id => this.deleteTodo(id));
      await Promise.all(deletions);

      logger.info(`✅ Bulk deleted ${ids.length} todos`);
      return { deleted: ids.length };
    } catch (error) {
      logger.error('Error bulk deleting todos:', error);
      throw error;
    }
  }
}

export { TodoService };
export default TodoService;