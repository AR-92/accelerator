/**
 * Render table rows HTML for todos table
 * @param {Array} todos - Array of todo objects
 * @returns {string} - HTML string for table rows
 */
export const renderTableRowsHtml = (todos) => {
  const Handlebars = require('handlebars');
  const template = Handlebars.compile(`
    {{#each todos}}
    <tr id="todo-row-{{id}}" class="border-b border-border hover:bg-muted dark:hover:bg-muted transition-colors duration-150 even:bg-muted dark:even:bg-muted">
      <td class="px-6 py-4">
        <input type="checkbox" class="todoCheckbox rounded border-border text-primary  value="{{id}}" data-todo-id="{{id}}" aria-label="Select todo {{title}}">
      </td>
      <td class="px-6 py-4">
        <div>
          <div class="text-sm font-medium text-foreground">{{title}}</div>
          {{#if description}}
          <div class="text-sm text-muted-foreground">{{description}}</div>
          {{/if}}
        </div>
      </td>
      <td class="px-6 py-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {{#if completed}}bg-success/10 text-success{{else}}bg-warning/10 text-warning{{/if}}">{{#if completed}}completed{{else}}pending{{/if}}</span>
      </td>
      <td class="px-6 py-4 hidden md:table-cell">
        <div class="text-sm text-foreground font-medium">Medium</div>
      </td>
      <td class="px-6 py-4 hidden lg:table-cell">
        <div class="text-sm text-foreground">{{formatDate created_at}}</div>
      </td>
      <td class="px-6 py-4 hidden lg:table-cell">
        <div class="text-sm text-foreground">{{formatDate updated_at}}</div>
      </td>
      <td class="px-6 py-4">
        <div class="relative">
          <button onclick="toggleActionMenu(this)" data-entity="{{entity}}" data-id="{{id}}" class="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" aria-label="Actions menu">
            {{{icon 'ellipsis-vertical' class='w-4 h-4'}}}
          </button>
          <div id="actionMenu-{{entity}}-{{id}}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg z-10 border border-border">
            <div class="py-1">
              <a href="/todos/{{id}}" class="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                {{{icon 'eye' class='w-4 h-4 mr-3'}}}
                View Details
              </a>
              <button onclick="editTodo({{id}})" class="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                {{{icon 'square-pen' class='w-4 h-4 mr-3'}}}
                Edit Todo
              </button>
              <button onclick="toggleStatus({{id}}, '{{#if completed}}pending{{else}}completed{{/if}}')" class="flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                {{{icon 'circle-check' class='w-4 h-4 mr-3'}}}
                {{#if completed}}Mark Pending{{else}}Mark Complete{{/if}}
              </button>
              <button onclick="deleteTodo({{id}}, '{{title}}')" class="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                {{{icon 'trash-2' class='w-4 h-4 mr-3'}}}
                Delete
              </button>
            </div>
          </div>
        </div>
      </td>
    </tr>
    {{/each}}
  `);

  // Register helpers
  Object.keys(require('../handlebars.js').handlebarsHelpers).forEach((key) => {
    Handlebars.registerHelper(
      key,
      require('../handlebars.js').handlebarsHelpers[key]
    );
  });

  return template({ todos });
};
