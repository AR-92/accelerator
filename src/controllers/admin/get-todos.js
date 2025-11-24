import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import {
  applyTableFilters,
  getStatusCounts,
  getFilterCounts,
} from '../../helpers/tableFilters.js';
import { getTableConfig } from '../../config/tableFilters.js';

// Todos Management
export const getTodos = async (req, res) => {
  try {
    logger.info('Admin todos page accessed');

    const { search, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build query with filters
    let query = databaseService.supabase
      .from('todos')
      .select('*', { count: 'exact' });

    // Apply dynamic filters
    query = applyTableFilters(query, 'todos', req.query);

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: todos, error, count } = await query;
    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / limitNum);
    const start = offset + 1;
    const end = Math.min(offset + limitNum, total);
    const hasPrev = pageNum > 1;
    const hasNext = pageNum < totalPages;
    const prevPage = hasPrev ? pageNum - 1 : null;
    const nextPage = hasNext ? pageNum + 1 : null;
    const pages = [];
    for (
      let i = Math.max(1, pageNum - 2);
      i <= Math.min(totalPages, pageNum + 2);
      i++
    ) {
      pages.push(i);
    }

    const filters = [];
    if (search) filters.push(`search: "${search}"`);
    if (status) filters.push(`status: ${status}`);
    if (pageNum > 1) filters.push(`page: ${pageNum}`);
    logger.info(
      `Fetched ${todos.length} of ${total} todos${filters.length ? ` (filtered by ${filters.join(', ')})` : ''}`
    );

    const isConnected = true; // Assume connected if service works

    const columns = [
      {
        key: 'title',
        label: 'Title',
        type: 'title',
        descriptionKey: 'description',
      },
      { key: 'completed', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
      {
        key: 'updated_at',
        label: 'Updated',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/table-pages/todos',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editTodo',
        label: 'Edit Todo',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'button',
        onclick: 'toggleStatus',
        label: 'Mark Complete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-circle-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteTodo',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ];

    const bulkActions = [
      {
        onclick: 'bulkMarkComplete',
        buttonId: 'bulkCompleteBtn',
        label: 'Mark Complete',
      },
      {
        onclick: 'bulkMarkPending',
        buttonId: 'bulkPendingBtn',
        label: 'Mark Pending',
      },
      {
        onclick: 'bulkDelete',
        buttonId: 'bulkDeleteBtn',
        label: 'Delete Selected',
      },
    ];

    const pagination = {
      currentPage: pageNum,
      limit: limitNum,
      total,
      start,
      end,
      hasPrev,
      hasNext,
      prevPage,
      nextPage,
      pages,
    };

    const colspan = columns.length + 1 + 1; // checkbox + actions

    // Get status counts for filter buttons
    const statusCounts = await getStatusCounts('todos', databaseService);
    const filterCounts = getFilterCounts('todos', statusCounts);
    const tableConfig = getTableConfig('todos');

    // Make variables available to layout for filter-nav
    res.locals.tableConfig = tableConfig;
    res.locals.filterCounts = filterCounts;
    res.locals.currentPage = 'todos';
    res.locals.query = { search: search || '', status: status || '' };

    res.render('admin/table-pages/todos', {
      title: 'Todos Management',
      currentPage: 'todos',
      currentSection: 'system',
      isTablePage: true,
      tableId: 'todos',
      entityName: 'todo',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: todos,
      actions,
      bulkActions,
      pagination,
      query: { search: search || '', status: status || '' },
      currentUrl: '/admin/table-pages/todos',
      colspan,
      supabaseConnected: isConnected,
      filterCounts,
      tableConfig,
    });
  } catch (error) {
    logger.error('Error loading todos:', error);
    res.render('admin/table-pages/todos', {
      title: 'Todos Management',
      currentPage: 'todos',
      currentSection: 'system',
      data: [],
      pagination: {
        currentPage: 1,
        limit: 10,
        total: 0,
        start: 0,
        end: 0,
        hasPrev: false,
        hasNext: false,
        prevPage: 0,
        nextPage: 2,
        pages: [],
      },
      query: { search: '', status: '' },
      supabaseConnected: false,
      error: error.message,
    });
  }
};
