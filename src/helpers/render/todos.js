import { handlebarsHelpers } from '../handlebars.js';

/**
 * Render a single todo item as HTML
 * @param {Object} todo - Todo object
 * @returns {string} - HTML string for the todo item
 */
export const renderTodoHtml = (todo) => `
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4 animate__animated animate__fadeInUp">
    <div class="flex items-center justify-between">
      <div class="flex-1 space-y-1">
        <h4 class="font-medium leading-none ${todo.completed ? 'line-through text-muted-foreground' : ''}">${todo.title}</h4>
        ${todo.description ? `<p class="text-sm text-muted-foreground ${todo.completed ? 'line-through' : ''}">${todo.description}</p>` : ''}
        <p class="text-xs text-muted-foreground">Created: ${new Date(todo.created_at).toLocaleDateString()}</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none    ${todo.completed ? 'border-transparent bg-green-100 text-green-800' : 'border-transparent bg-yellow-100 text-yellow-800'}">
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

/**
 * Render pagination HTML for todos
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {Object} query - Query parameters
 * @returns {string} - HTML string for pagination
 */
export const renderPagination = (page, limit, total, query) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return '';

  const search = query.search || '';
  const status = query.status || '';
  const params = `limit=${limit}&search=${encodeURIComponent(search)}&status=${status}`;

  let html = `<div class="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border">`;

  // Previous button
  if (page > 1) {
    html += `<button hx-get="/api/todos?page=${page - 1}&${params}" hx-target="#todosList" class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" title="Previous page">`;
    html += `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>`;
    html += `</button>`;
  }

  // Page number buttons
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    if (i === page) {
      html += `<span class="inline-flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground shadow-sm font-medium">${i}</span>`;
    } else {
      html += `<button hx-get="/api/todos?page=${i}&${params}" hx-target="#todosList" class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">${i}</button>`;
    }
  }

  // Go to page form
  html += `<form hx-get="/api/todos" hx-target="#todosList" class="flex items-center gap-1 ml-2">`;
  html += `<input type="hidden" name="limit" value="${limit}">`;
  html += `<input type="hidden" name="search" value="${search}">`;
  html += `<input type="hidden" name="status" value="${status}">`;
  html += `<input type="number" name="page" min="1" max="${totalPages}" value="${page}" placeholder="Page" class="w-16 h-8 text-xs text-center rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">`;
  html += `<button type="submit" class="inline-flex items-center justify-center rounded-md text-xs font-medium border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground transition-all duration-200 h-8 px-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">Go</button>`;
  html += `</form>`;

  // Next button
  if (page < totalPages) {
    html += `<button hx-get="/api/todos?page=${page + 1}&${params}" hx-target="#todosList" class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" title="Next page">`;
    html += `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;
    html += `</button>`;
  }

  html += `</div>`;
  return html;
};

/**
 * Render alert HTML for notifications
 * @param {string} type - Alert type (success, error)
 * @param {string} message - Alert message
 * @param {string} iconName - Icon name for the alert
 * @returns {string} - HTML string for the alert
 */
export const renderAlertHtml = (type, message, iconName) => {
  const iconHtml = handlebarsHelpers.icon(iconName, {
    hash: { size: 16, class: 'lucide lucide-' + iconName },
  });

  const styles = {
    success: 'bg-card text-card-foreground',
    error: 'text-destructive bg-card [&>svg]:text-current',
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
