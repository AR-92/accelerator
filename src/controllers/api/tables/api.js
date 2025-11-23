import Todo from '../../../models/Todo.js';
import databaseService from '../../../services/supabase.js';
import logger from '../../../utils/logger.js';
import { validateTodoCreation, validateTodoUpdate, validateTodoDeletion } from '../../../middleware/validation/index.js';
import { isHtmxRequest } from '../../../helpers/http/index.js';
import { renderTodoHtml, renderPagination, renderAlertHtml } from '../../../helpers/render/index.js';

// Controller functions
export const getTodos = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build Supabase query with filters
    let query = databaseService.supabase
      .from('todos')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (status === 'pending') {
      query = query.eq('completed', false);
    } else if (status === 'completed') {
      query = query.eq('completed', true);
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: todos, error, count } = await query;

    if (error) throw error;

    const total = count || 0;
    const filters = [];
    if (search) filters.push(`search: "${search}"`);
    if (status) filters.push(`status: ${status}`);
    if (pageNum > 1) filters.push(`page: ${pageNum}`);
    logger.info(`Fetched ${todos.length} of ${total} todos${filters.length ? ` (filtered by ${filters.join(', ')})` : ''}`);

    if (isHtmxRequest(req)) {
      const todoHtml = todos.map(renderTodoHtml).join('') ||
        '<div class="flex items-center justify-center py-8"><div class="text-sm text-muted-foreground">No todos yet. Create your first todo above!</div></div>';
      const paginationHtml = renderPagination(pageNum, limitNum, total, req.query);
      res.send(todoHtml + paginationHtml);
    } else {
      res.json({ success: true, data: todos, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
    }
  } catch (error) {
    logger.error('Error fetching todos:', error);
    if (isHtmxRequest(req)) {
      res.status(500).send('<p class="text-red-500 animate__animated animate__shake">Error loading todos</p>');
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export const createTodo = [
  validateTodoCreation,
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const todo = await Todo.create({ title, description });
      logger.info(`Created todo with ID: ${todo.id}`);

      if (isHtmxRequest(req)) {
        res.send(renderAlertHtml('success', `Todo "${todo.title}" created successfully!`, 'plus-circle'));
      } else {
        res.status(201).json({ success: true, data: todo });
      }
    } catch (error) {
      logger.error('Error creating todo:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(renderAlertHtml('error', `Failed to create todo: ${error.message}`));
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
];

export const updateTodo = [
  validateTodoUpdate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const todoId = parseInt(id, 10);

      // Find existing todo
      const existingTodo = await Todo.findById(todoId);
      if (!existingTodo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }

      const { title, description } = req.body || {};
      let completed = req.body?.completed;

      // Check query parameter for completed status
      if (req.query.completed !== undefined) {
        completed = req.query.completed === 'true';
      }

      const updates = {};
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (completed !== undefined) updates.completed = completed;

      const updatedTodo = await existingTodo.update(updates);
      logger.info(`Updated todo with ID: ${todoId}`);

      if (isHtmxRequest(req)) {
        const todoHtml = renderTodoHtml(updatedTodo);
        const alertHtml = renderAlertHtml('success', `Todo "${updatedTodo.title}" updated successfully!`, 'edit');
        res.send(alertHtml + todoHtml);
      } else {
        res.json({ success: true, data: updatedTodo });
      }
    } catch (error) {
      logger.error('Error updating todo:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(renderAlertHtml('error', `Failed to update todo: ${error.message}`));
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
];

export const getEditTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todoId = parseInt(id, 10);
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).send('Todo not found');
    }

    const editHtml = `
      <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 animate__animated animate__fadeInUp">
        <form hx-put="/api/todos/${todo.id}" hx-target="closest .rounded-lg" hx-swap="outerHTML" class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Title</label>
            <input type="text" name="title" value="${todo.title}" required class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Description</label>
            <textarea name="description" rows="3" class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">${todo.description || ''}</textarea>
          </div>
          <div class="flex gap-2">
            <button type="submit" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Save</button>
            <button type="button" onclick="htmx.ajax('GET', '/api/todos/${todo.id}/view', {target: 'closest .rounded-lg', swap: 'outerHTML'})" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Cancel</button>
          </div>
        </form>
      </div>
    `;
    res.send(editHtml);
  } catch (error) {
    logger.error('Error getting edit form:', error);
    res.status(500).send('Error loading edit form');
  }
};

export const getTodoView = async (req, res) => {
  try {
    const { id } = req.params;
    const todoId = parseInt(id, 10);
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).send('Todo not found');
    }
    res.send(renderTodoHtml(todo));
  } catch (error) {
    logger.error('Error getting todo view:', error);
    res.status(500).send('Error loading todo');
  }
};

export const deleteTodo = [
  validateTodoDeletion,
  async (req, res) => {
    try {
      const { id } = req.params;
      const todoId = parseInt(id);

      // Check if todo exists
      const existingTodo = await Todo.findById(todoId);
      if (!existingTodo) {
        return res.status(404).json({ success: false, error: 'Todo not found' });
      }

      const title = existingTodo.title;
      await existingTodo.delete();
      logger.info(`Deleted todo with ID: ${todoId}`);

      if (isHtmxRequest(req)) {
        res.send(renderAlertHtml('error', `Todo "${title}" has been deleted!`, 'trash'));
      } else {
        res.json({ success: true, message: 'Todo deleted successfully' });
      }
    } catch (error) {
      logger.error('Error deleting todo:', error);
      if (isHtmxRequest(req)) {
        res.status(500).send(renderAlertHtml('error', `Failed to delete todo: ${error.message}`, 'circle-alert'));
      } else {
        res.status(500).json({ success: false, error: error.message });
      }
    }
  }
];

// Route setup function
export default function apiRoutes(app) {
  app.get('/api/todos', getTodos);
  app.get('/api/todos/:id/edit', getEditTodo);
  app.get('/api/todos/:id/view', getTodoView);
  app.post('/api/todos', ...createTodo);
  app.put('/api/todos/:id', ...updateTodo);
  app.delete('/api/todos/:id', ...deleteTodo);
}