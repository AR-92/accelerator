import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import {
  applyTableFilters,
  getStatusCounts,
  getFilterCounts,
} from '../../helpers/tableFilters.js';
import { getTableConfig } from '../../config/tableFilters.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Business Model Management
export const getBusinessModel = async (req, res) => {
  try {
    logger.info('Admin business model page accessed');

    const { search = '', status = '', page = 1, limit = 10 } = req.query;
    logger.info(
      `Query params: search="${search}", status="${status}", page=${page}, limit=${limit}`
    );
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build Supabase query with filters
    let query = databaseService.supabase
      .from('business_model')
      .select('*', { count: 'exact' });

    // Apply dynamic filters
    query = applyTableFilters(query, 'business-model', req.query);

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: businessModels, error, count } = await query;

    if (error) {
      logger.error('Error fetching business models:', error);
      throw error;
    }

    logger.info(
      `Fetched ${businessModels ? businessModels.length : 0} business models, total count: ${count}`
    );

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

    // Get status counts using the dynamic helper
    const statusCounts = await getStatusCounts(
      'business-model',
      databaseService
    );
    logger.info(`Status counts: ${JSON.stringify(statusCounts)}`);

    const tableConfig = getTableConfig('business-model');

    const columns = [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'business_type', label: 'Type', type: 'text' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      {
        key: 'created_at',
        label: 'Created',
        type: 'date',
        hidden: true,
        responsive: 'lg:table-cell',
      },
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/other-pages/business-model',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'button',
        onclick: 'editBusinessModel',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteBusinessModel',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ];

    const bulkActions = [];

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

    const colspan =
      columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    // Prepare filter counts for template
    const filterCounts = getFilterCounts('business-model', statusCounts);

    // Make variables available to layout for filter-nav
    res.locals.tableConfig = tableConfig;
    res.locals.filterCounts = filterCounts;
    res.locals.currentPage = 'business-model';
    res.locals.query = { search: search || '', status: status || '' };

    if (isHtmxRequest(req)) {
      // Generate table HTML for HTMX requests
      let tableHtml = `
        <table class="min-w-full table-auto bg-card">
          <thead class="bg-card border-b border-border">
            <tr>
              <th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">
                <input type="checkbox" id="selectAll-business-model" class="rounded border-input text-primary">
              </th>`;

      // Add column headers
      columns.forEach((column) => {
        tableHtml += `<th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">${column.label}</th>`;
      });

      // Add actions header
      if (actions.length > 0) {
        tableHtml += `<th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">Actions</th>`;
      }

      tableHtml += `
            </tr>
          </thead>
          <tbody class="text-sm text-card-foreground">`;

      // Add table rows
      if (businessModels.length > 0) {
        businessModels.forEach((model) => {
          tableHtml += `<tr id="business-model-row-${model.id}" class="h-16 border-b border-border hover:bg-muted/50 even:bg-muted/30 transition-colors duration-150">
            <td class="px-6 py-4">
              <input type="checkbox" class="business-modelCheckbox rounded border-input text-primary value="${model.id}" data-business-model-id="${model.id}">
            </td>`;

          // Add data cells
          columns.forEach((column) => {
            let cellContent = '';

            if (column.type === 'status') {
              cellContent = `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${model.status === 'approved' ? 'bg-green-100 text-green-800' : model.status === 'review' ? 'bg-yellow-100 text-yellow-800' : model.status === 'draft' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'}">${model[column.key]}</span>`;
            } else if (column.type === 'date') {
              cellContent = `<div class="text-sm text-card-foreground">${new Date(model[column.key]).toLocaleDateString()}</div>`;
            } else {
              cellContent = `<div class="text-sm text-card-foreground truncate max-w-xs" title="${model[column.key]}">${model[column.key]}</div>`;
            }

            tableHtml += `<td class="px-6 py-4">${cellContent}</td>`;
          });

          // Add actions cell
          if (actions.length > 0) {
            tableHtml += `<td class="px-6 py-4">
              <div class="relative">
                <button onclick="toggleActionMenu('business-model', ${model.id})" class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                <div id="actionMenu-business-model-${model.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg z-10 border border-border">
                  <div class="py-1">`;

            actions.forEach((action) => {
              if (action.type === 'link') {
                tableHtml += `<a href="${action.url}/${model.id}" class="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  ${action.icon}
                  ${action.label}
                </a>`;
              } else if (action.type === 'button') {
                tableHtml += `<button onclick="${action.onclick}(${model.id})" class="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  ${action.icon}
                  ${action.label}
                </button>`;
              } else if (action.type === 'delete') {
                tableHtml += `<button onclick="${action.onclick}(${model.id})" class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors">
                  ${action.icon}
                  ${action.label}
                </button>`;
              }
            });

            tableHtml += `
                  </div>
                </div>
              </div>
            </td>`;
          }

          tableHtml += `</tr>`;
        });
      } else {
        // Empty state
        tableHtml += `<tr class="h-16">
          <td colspan="${colspan}" class="px-6 py-8 text-center text-muted-foreground">
            <div class="flex flex-col items-center justify-center py-12">
              <svg class="w-16 h-16 text-muted-foreground/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p class="text-lg font-medium text-muted-foreground mb-2">No business models found</p>
              <p class="text-sm text-muted-foreground/70">Business models will appear here.</p>
            </div>
          </td>
        </tr>`;
      }

      tableHtml += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="${colspan}" class="bg-card border-t border-border p-4">
                <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div class="text-sm text-muted-foreground">
                    Showing ${start}-${end} of ${total} business models
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="text-sm text-muted-foreground font-medium">Rows per page:</span>
                      <select id="rowsPerPage-business-model" name="limit" class="border border-input rounded-lg px-3 py-2 text-sm bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        hx-get="/admin/table-pages/business-model" hx-target="#business-modelTableContainer" hx-vals="js:{limit: document.getElementById('rowsPerPage-business-model').value}">
                      <option value="10" ${limitNum === 10 ? 'selected' : ''}>10</option>
                      <option value="20" ${limitNum === 20 ? 'selected' : ''}>20</option>
                      <option value="50" ${limitNum === 50 ? 'selected' : ''}>50</option>
                      <option value="100" ${limitNum === 100 ? 'selected' : ''}>100</option>
                    </select>
                  </div>

                  <div class="flex items-center gap-2">
                    <nav class="flex items-center gap-1 text-sm">`;

      // Add pagination buttons
      if (hasPrev) {
        tableHtml += `<button hx-get="/admin/table-pages/business-model?page=${prevPage}" hx-target="#business-modelTableContainer"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground transition-all duration-200 font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>`;
      }

      pages.forEach((page) => {
        const isActive = page === pageNum;
        tableHtml += `<button hx-get="/admin/table-pages/business-model?page=${page}" hx-target="#business-modelTableContainer"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg ${isActive ? 'bg-primary text-primary-foreground scale-105' : 'border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground'} transition-all duration-200 font-medium">${page}</button>`;
      });

      if (hasNext) {
        tableHtml += `<button hx-get="/admin/table-pages/business-model?page=${nextPage}" hx-target="#business-modelTableContainer"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground transition-all duration-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>`;
      }

      tableHtml += `
                    </nav>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>`;

      res.send(tableHtml);
    } else {
      res.render('admin/table-pages/business-model', {
        title: 'Business Model Management',
        currentPage: 'business-model',
        currentSection: 'business',
        isTablePage: true,
        tableId: 'business-model',
        entityName: 'business model',
        showCheckbox: true,
        showBulkActions: false,
        columns,
        data: businessModels,
        actions,
        bulkActions,
        pagination,
        query: { search: search || '', status: status || '' },
        statusCounts,
        currentUrl: '/admin/table-pages/business-model',
        colspan,
        filterCounts,
        tableConfig,
      });
    }
  } catch (error) {
    logger.error('Error loading business models:', error);
    res.render('admin/table-pages/business-model', {
      title: 'Business Model Management',
      currentPage: 'business-model',
      currentSection: 'business',
      isTablePage: true,
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
      statusCounts: {},
      filterCounts: { all: 0, draft: 0, review: 0, approved: 0 },
      tableConfig: getTableConfig('business-model'),
    });
  }
};
