/**
 * Render table rows HTML for todos table
 * @param {Array} todos - Array of todo objects
 * @returns {string} - HTML string for table rows
 */
export const renderTableRowsHtml = (todos) => {
  const Handlebars = require('handlebars');
  const template = Handlebars.compile(`
    {{#each todos}}
    <tr id="todo-row-{{id}}" class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150 even:bg-purple-100 dark:even:bg-purple-800">
      <td class="px-6 py-4">
        <input type="checkbox" class="todoCheckbox rounded border-gray-300 text-primary  value="{{id}}" data-todo-id="{{id}}" aria-label="Select todo {{title}}">
      </td>
      <td class="px-6 py-4">
        <div>
          <div class="text-sm font-medium text-gray-900">{{title}}</div>
          {{#if description}}
          <div class="text-sm text-gray-500">{{description}}</div>
          {{/if}}
        </div>
      </td>
      <td class="px-6 py-4">
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {{#if completed}}bg-green-100 text-green-800{{else}}bg-yellow-100 text-yellow-800{{/if}}">{{#if completed}}completed{{else}}pending{{/if}}</span>
      </td>
      <td class="px-6 py-4 hidden md:table-cell">
        <div class="text-sm text-gray-900 font-medium">Medium</div>
      </td>
      <td class="px-6 py-4 hidden lg:table-cell">
        <div class="text-sm text-gray-900">{{formatDate created_at}}</div>
      </td>
      <td class="px-6 py-4 hidden lg:table-cell">
        <div class="text-sm text-gray-900">{{formatDate updated_at}}</div>
      </td>
      <td class="px-6 py-4">
        <div class="relative">
          <button onclick="toggleActionMenu({{id}})" class="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black dark:text-white transition-colors" aria-label="Actions menu">
            <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
          <div id="actionMenu-{{id}}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div class="py-1">
              <a href="/todos/{{id}}" class="flex items-center px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View Details
              </a>
              <button onclick="editTodo({{id}})" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                </svg>
                Edit Todo
              </button>
              <button onclick="toggleStatus({{id}}, '{{#if completed}}pending{{else}}completed{{/if}}')" class="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 transition-colors">
                <svg class="w-4 h-4 mr-3 lucide lucide-circle-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                {{#if completed}}Mark Pending{{else}}Mark Complete{{/if}}
              </button>
              <button onclick="deleteTodo({{id}}, '{{title}}')" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 11v6"></path>
                  <path d="M14 11v6"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                  <path d="M3 6h18"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
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
