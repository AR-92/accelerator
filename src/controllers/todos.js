import Todo from '../models/Todo.js';
import databaseService from '../services/supabase.js';
import logger from '../utils/logger.js';
import { validateTodoCreation, validateTodoUpdate, validateTodoDeletion } from '../middleware/validation.js';
import { handlebarsHelpers } from '../helpers/handlebars.js';

// Helper function to check if request is HTMX
const isHtmxRequest = (req) => {
  return req.headers['hx-request'] || req.headers['HX-Request'] || req.get('HX-Request');
};

// Helper function to render todo HTML
const renderTodoHtml = (todo) => `
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 animate__animated animate__fadeInUp">
    <div class="flex items-center justify-between">
      <div class="flex-1 space-y-1">
        <h4 class="font-medium leading-none ${todo.completed ? 'line-through text-muted-foreground' : ''}">${todo.title}</h4>
        ${todo.description ? `<p class="text-sm text-muted-foreground ${todo.completed ? 'line-through' : ''}">${todo.description}</p>` : ''}
        <p class="text-xs text-muted-foreground">Created: ${new Date(todo.created_at).toLocaleDateString()}</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${todo.completed ? 'border-transparent bg-green-100 text-green-800' : 'border-transparent bg-yellow-100 text-yellow-800'}">
          ${todo.completed ? 'Completed' : 'Pending'}
        </span>
         <button hx-get="/api/todos/${todo.id}/edit"
                 hx-target="closest .rounded-lg"
                 hx-swap="outerHTML"
                 hx-trigger="click"
                 class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
           Edit
         </button>
         <button hx-put="/api/todos/${todo.id}?completed=${!todo.completed}"
                 hx-target="closest .rounded-lg"
                 hx-swap="outerHTML"
                 hx-trigger="click"
                 class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
           ${todo.completed ? 'Mark Pending' : 'Mark Complete'}
         </button>
         <button hx-delete="/api/todos/${todo.id}"
                 hx-target="closest .rounded-lg"
                 hx-swap="outerHTML"
                 hx-trigger="click"
                 class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-destructive hover:text-destructive">
           Delete
         </button>
      </div>
    </div>
  </div>
`;

// Helper function to render pagination HTML
const renderPagination = (page, limit, total, query) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return '';

  const search = query.search || '';
  const status = query.status || '';
  const params = `limit=${limit}&search=${encodeURIComponent(search)}&status=${status}`;

  let html = `<div class="flex items-center justify-between mt-4 pt-4 border-t">`;
  if (page > 1) {
    html += `<button hx-get="/api/todos?page=${page-1}&${params}" hx-target="#todosList" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">Previous</button>`;
  } else {
    html += `<span></span>`;
  }

  // Page number buttons and input
  html += `<div class="flex items-center space-x-2">
    <div class="flex items-center space-x-1">`;
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i === page) {
      html += `<span class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground h-9 w-9">${i}</span>`;
    } else {
      html += `<button hx-get="/api/todos?page=${i}&${params}" hx-target="#todosList" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9">${i}</button>`;
    }
  }
  html += `</div>
    <form hx-get="/api/todos" hx-target="#todosList" class="flex items-center space-x-1">
      <input type="hidden" name="limit" value="${limit}">
      <input type="hidden" name="search" value="${search}">
      <input type="hidden" name="status" value="${status}">
      <input type="number" name="page" min="1" max="${totalPages}" value="${page}" placeholder="Page" class="w-16 h-8 text-xs text-center rounded border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring">
      <button type="submit" class="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-2">Go</button>
    </form>
  </div>`;

  if (page < totalPages) {
    html += `<button hx-get="/api/todos?page=${page+1}&${params}" hx-target="#todosList" class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">Next</button>`;
  } else {
    html += `<span></span>`;
  }
  html += `</div>`;
  return html;
};

// Helper function to render alert HTML
const renderAlertHtml = (type, message, iconName) => {
  const iconHtml = handlebarsHelpers.icon(iconName, { hash: { size: 16, class: 'lucide lucide-' + iconName } });

  const styles = {
    success: 'bg-card text-card-foreground',
    error: 'text-destructive bg-card [&>svg]:text-current'
  };

  return `
    <div id="alert-container" class="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div data-slot="alert" role="alert" class="relative w-full rounded-lg border px-4 py-3 text-sm flex items-start gap-3 ${styles[type]}">
        ${iconHtml}
        <div data-slot="alert-title" class="flex-1 line-clamp-1 min-h-4 font-medium tracking-tight">${message}</div>
      </div>
    </div>
    <script>
      htmx.trigger('#todosList', 'todoCreated');
      document.getElementById('createTodoForm').reset();
      setTimeout(function() {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
          alertContainer.remove();
        }
      }, 5000);
    </script>
  `;
};

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
export default function todosRoutes(app) {
  app.get('/api/todos', getTodos);
  app.get('/api/todos/:id/edit', getEditTodo);
  app.get('/api/todos/:id/view', getTodoView);
  app.post('/api/todos', ...createTodo);
  app.put('/api/todos/:id', ...updateTodo);
  app.delete('/api/todos/:id', ...deleteTodo);
}