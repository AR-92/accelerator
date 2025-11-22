import databaseService from '../services/supabase.js';
import logger from '../utils/logger.js';
import Todo from '../models/Todo.js';
import { handlebarsHelpers } from '../helpers/handlebars.js';

// Helper function to check if request is HTMX
const isHtmxRequest = (req) => {
  return req.headers['hx-request'] || req.headers['HX-Request'] || req.get('HX-Request');
};

// Helper function to render table rows HTML
const renderTableRowsHtml = (todos) => {
  const Handlebars = require('handlebars');
  const template = Handlebars.compile(`
    {{#each todos}}
    <tr id="todo-row-{{id}}" class="border-b border-gray-100/40 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors duration-150 even:bg-purple-100 dark:even:bg-purple-800">
      <td class="px-6 py-4">
        <input type="checkbox" class="todoCheckbox rounded border-gray-300 text-primary focus:ring-primary" value="{{id}}" data-todo-id="{{id}}" aria-label="Select todo {{title}}">
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
  Object.keys(handlebarsHelpers).forEach(key => {
    Handlebars.registerHelper(key, handlebarsHelpers[key]);
  });

  return template({ todos });
};

export const getHome = async (req, res) => {
  try {
    const isConnected = await databaseService.testConnection();
    logger.info('Dashboard page accessed');

    // Get some basic stats for the dashboard
    let totalTodos = 0;
    let completedTodos = 0;
    let pendingTodos = 0;
    let recentTodos = [];

    if (isConnected) {
      const allTodos = await Todo.findAll();
      totalTodos = allTodos.length;
      completedTodos = allTodos.filter(todo => todo.completed).length;
      pendingTodos = totalTodos - completedTodos;

      // Get recent todos (last 5)
      recentTodos = allTodos
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
    }

    res.render('main', {
      title: 'Dashboard',
      totalTodos,
      completedTodos,
      pendingTodos,
      recentTodos,
      supabaseConnected: isConnected
    });
  } catch (error) {
    logger.error('Error loading dashboard:', error);
    res.render('main', {
      title: 'Dashboard',
      totalTodos: 0,
      completedTodos: 0,
      pendingTodos: 0,
      recentTodos: [],
      supabaseConnected: false,
      error: error.message
    });
  }
};

export const getTodosTable = async (req, res) => {
  try {
    const isConnected = await databaseService.testConnection();
    const { search, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    let todos = [];
    let total = 0;
    let filteredTodos = [];

    if (isConnected) {
      // Database is connected, fetch real data
      let allTodos = await Todo.findAll();
      filteredTodos = [...allTodos];

      if (search) {
        filteredTodos = filteredTodos.filter(todo =>
          todo.title.toLowerCase().includes(search.toLowerCase()) ||
          (todo.description && todo.description.toLowerCase().includes(search.toLowerCase()))
        );
      }
      if (status === 'pending') {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
      } else if (status === 'completed') {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
      }

      total = filteredTodos.length;
      const offset = (pageNum - 1) * limitNum;
      todos = filteredTodos.slice(offset, offset + limitNum);
    } else {
      // Database not connected, show sample data for demo
      total = 0;
      todos = [];
    }

    // Pagination data
    const totalPages = Math.ceil(total / limitNum);
    const hasPrev = pageNum > 1;
    const hasNext = pageNum < totalPages;
    const prevPage = pageNum - 1;
    const nextPage = pageNum + 1;

    // Generate page numbers for pagination
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pageNum - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    logger.info(`Todos table accessed - page: ${pageNum}, limit: ${limitNum}, total: ${total}, connected: ${isConnected}`);

    if (isHtmxRequest(req)) {
      // For HTMX requests, return just the table content
      let tableBodyHtml = '';
      if (todos.length > 0) {
        tableBodyHtml = renderTableRowsHtml(todos);
      } else {
        tableBodyHtml = `
          <tr>
            <td colspan="7" class="px-6 py-8 text-center text-gray-500">
              ${isConnected ? 'No todos found. Create your first todo!' : 'Database not connected. Please check your database configuration.'}
            </td>
          </tr>
        `;
      }

      const tableHtml = `
        <table class="min-w-full table-auto bg-purple-50 dark:bg-purple-900">
          <thead class="bg-purple-200 dark:bg-purple-800">
            <tr>
               <th class="px-6 py-4 text-left font-semibold text-black dark:text-white uppercase text-xs tracking-wider">
                 <input type="checkbox" id="selectAll" class="rounded border-gray-300 text-primary focus:ring-primary" aria-label="Select all todos">
               </th>
               <th class="px-6 py-4 text-left font-semibold text-black dark:text-white uppercase text-xs tracking-wider">Todo</th>
               <th class="px-6 py-4 text-left font-semibold text-black dark:text-white uppercase text-xs tracking-wider">Status</th>
               <th class="px-6 py-4 text-left font-semibold text-black dark:text-white uppercase text-xs tracking-wider hidden md:table-cell">Priority</th>
               <th class="px-6 py-4 text-left font-semibold text-black dark:text-white uppercase text-xs tracking-wider hidden lg:table-cell">Created</th>
               <th class="px-6 py-4 text-left font-semibold text-black dark:text-white uppercase text-xs tracking-wider hidden lg:table-cell">Updated</th>
               <th class="px-6 py-4 text-left font-semibold text-black dark:text-white uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm text-black dark:text-white">
            ${tableBodyHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="7" class="bg-white/85 backdrop-blur-sm border-t border-gray-200 p-4">
                <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div class="text-sm text-gray-600">
                    ${total > 0 ? `Showing ${(pageNum - 1) * limitNum + 1}-${Math.min(pageNum * limitNum, total)} of ${total} todos` : 'No todos available'}
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="text-sm text-gray-600 font-medium">Rows per page:</span>
                    <select id="rowsPerPage" name="limit" class="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors" hx-get="/todos" hx-target="#todosTableContainer" hx-include="[name='search'],[name='status']">
                      <option value="10" ${limitNum === 10 ? 'selected' : ''}>10</option>
                      <option value="20" ${limitNum === 20 ? 'selected' : ''}>20</option>
                      <option value="50" ${limitNum === 50 ? 'selected' : ''}>50</option>
                      <option value="100" ${limitNum === 100 ? 'selected' : ''}>100</option>
                    </select>
                  </div>

                  <div class="flex items-center gap-2">
                    <nav class="flex items-center gap-1 text-sm">
        ${hasPrev ? `<a href="?page=${prevPage}&limit=${limitNum}&search=${encodeURIComponent(search || '')}&status=${status || ''}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
        <svg class="w-4 h-4 lucide lucide-chevron-left" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"></path>
        </svg>
        </a>` : ''}
        ${pages.map(page => page === pageNum ? `<span class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground shadow-lg scale-105 transition-all duration-200 shadow-sm hover:shadow-md font-medium">${page}</span>` : `<a href="?page=${page}&limit=${limitNum}&search=${encodeURIComponent(search || '')}&status=${status || ''}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md font-medium">${page}</a>`).join('')}
        ${hasNext ? `<a href="?page=${nextPage}&limit=${limitNum}&search=${encodeURIComponent(search || '')}&status=${status || ''}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md" title="Next page">
        <svg class="w-4 h-4 lucide lucide-chevron-right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"></path>
        </svg>
        </a>` : ''}
                    </nav>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      `;
      res.send(tableHtml);
    } else {
      // Full page render
      const columns = [
        { key: 'title', label: 'Todo', type: 'title', descriptionKey: 'description' },
        { key: 'completed', label: 'Status', type: 'status' },
        { key: 'priority', label: 'Priority', type: 'text', hidden: true, responsive: 'md:table-cell' },
        { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' },
        { key: 'updated_at', label: 'Updated', type: 'date', hidden: true, responsive: 'lg:table-cell' }
      ];

      const actions = [
        {
          type: 'link',
          url: '/todos',
          label: 'View Details',
          icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
        },
        {
          type: 'button',
          onclick: 'editTodo',
          label: 'Edit Todo',
          icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>'
        },
        {
          type: 'button',
          onclick: 'toggleStatus',
          label: 'Mark Complete',
          icon: '<svg class="w-4 h-4 mr-3 lucide lucide-circle-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>'
        },
        {
          type: 'delete',
          onclick: 'deleteTodo',
          label: 'Delete',
          icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
        }
      ];

      const bulkActions = [
        { onclick: 'bulkMarkComplete', buttonId: 'bulkCompleteBtn', label: 'Mark Complete' },
        { onclick: 'bulkMarkPending', buttonId: 'bulkPendingBtn', label: 'Mark Pending' },
        { onclick: 'bulkDelete', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
      ];

      const pagination = {
        currentPage: pageNum,
        limit: limitNum,
        total,
        totalPages,
        start: (pageNum - 1) * limitNum + 1,
        end: Math.min(pageNum * limitNum, total),
        hasPrev,
        hasNext,
        prevPage,
        nextPage,
        pages
      };

      const colspan = columns.length + 1 + 1; // checkbox + actions

       res.render('todos', {
         title: 'Todos',
         tableId: 'todos',
         entityName: 'todo',
         showCheckbox: true,
         showBulkActions: true,
         columns,
         data: todos,
         actions,
         bulkActions,
         pagination,
         query: {
           search: search || '',
           status: status || ''
         },
         currentUrl: '/todos',
         colspan,
         supabaseConnected: isConnected
       });
    }
  } catch (error) {
    logger.error('Error loading todos table:', error);
    res.render('todos', {
      title: 'Todos',
      data: [],
      pagination: {
        currentPage: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        start: 0,
        end: 0,
        hasPrev: false,
        hasNext: false,
        prevPage: 0,
        nextPage: 2,
        pages: []
      },
      query: {
        search: '',
        status: ''
      },
      supabaseConnected: false,
      error: error.message
    });
  }
};

export default function homeRoutes(app) {
  app.get('/', getHome);
  app.get('/todos', (req, res) => res.redirect('/admin/todos'));
}