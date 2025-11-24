 import logger from '../../utils/logger.js';
 import { databaseService } from '../../services/index.js';
 import { applyTableFilters, getStatusCounts, getFilterCounts } from '../../helpers/tableFilters.js';
 import { getTableConfig } from '../../config/tableFilters.js';
 import { isHtmxRequest } from '../../helpers/http/index.js';

// Learning Categories Management
export const getLearningCategories = async (req, res) => {
  try {
    logger.info('Admin learning categories page accessed');

    const { search = '', page = 1, limit = 10 } = req.query;
    logger.info(`Query params: search="${search}", page=${page}, limit=${limit}`);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build Supabase query with filters
    let query = databaseService.supabase
      .from('learning_categories')
      .select('*', { count: 'exact' });

    // Apply dynamic filters
    query = applyTableFilters(query, 'learning-categories', req.query);

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: learningCategories, error, count } = await query;

    if (error) {
      logger.error('Error fetching learning categories:', error);
      throw error;
    }

    logger.info(`Fetched ${learningCategories ? learningCategories.length : 0} learning categories, total count: ${count}`);

    const total = count || 0;

    // Get status counts using the dynamic helper (will be empty for categories)
    const statusCounts = await getStatusCounts('learning-categories', databaseService);
    logger.info(`Status counts: ${JSON.stringify(statusCounts)}`);
    const totalPages = Math.ceil(total / limitNum);
    const start = offset + 1;
    const end = Math.min(offset + limitNum, total);
    const hasPrev = pageNum > 1;
    const hasNext = pageNum < totalPages;
    const prevPage = hasPrev ? pageNum - 1 : null;
    const nextPage = hasNext ? pageNum + 1 : null;
    const pages = [];
    for (let i = Math.max(1, pageNum - 2); i <= Math.min(totalPages, pageNum + 2); i++) {
      pages.push(i);
    }

    const filters = [];
    if (search) filters.push(`search: "${search}"`);
    if (pageNum > 1) filters.push(`page: ${pageNum}`);
    logger.info(`Fetched ${learningCategories.length} of ${total} learning categories${filters.length ? ` (filtered by ${filters.join(', ')})` : ''}`);

    const columns = [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'category_type', label: 'Type', type: 'text' },
      { key: 'is_featured', label: 'Featured', type: 'status' },
      { key: 'content_count', label: 'Content Count', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/other-pages/learning-categories', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editLearningCategory', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteLearningCategory', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const bulkActions = [
      { onclick: 'bulkDeleteLearningCategories', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
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
      pages
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    // Prepare filter counts for template
    const filterCounts = getFilterCounts('learning-categories', statusCounts);
    const tableConfig = getTableConfig('learning-categories');

    // Make variables available to layout for filter-nav
    res.locals.tableConfig = tableConfig;
    res.locals.filterCounts = filterCounts;
    res.locals.currentPage = 'learning-categories';
    res.locals.query = { search: search || '', status: '' };

    if (isHtmxRequest(req)) {
      // Generate table HTML for HTMX requests
      let tableHtml = `
        <table class="min-w-full table-auto bg-card">
          <thead class="bg-card border-b border-border">
            <tr>
              <th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">
                <input type="checkbox" id="selectAll-learning-categories" class="rounded border-input text-primary">
              </th>`;

      // Add column headers
      columns.forEach(column => {
        const responsiveClass = column.hidden ? ` hidden ${column.responsive}` : '';
        tableHtml += `<th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider${responsiveClass} bg-muted">${column.label}</th>`;
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
      if (learningCategories.length > 0) {
        learningCategories.forEach(category => {
          tableHtml += `<tr id="learning-category-row-${category.id}" class="h-16 border-b border-border hover:bg-muted/50 even:bg-muted/30 transition-colors duration-150">
            <td class="px-6 py-4">
              <input type="checkbox" class="learningCategoryCheckbox rounded border-input text-primary value="${category.id}" data-learning-category-id="${category.id}">
            </td>`;

          // Add data cells
          columns.forEach(column => {
            const responsiveClass = column.hidden ? ` hidden ${column.responsive}` : '';
            let cellContent = '';

            if (column.type === 'status') {
              cellContent = `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${category[column.key] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">${category[column.key] ? 'Yes' : 'No'}</span>`;
            } else if (column.type === 'date') {
              cellContent = `<div class="text-sm text-card-foreground">${new Date(category[column.key]).toLocaleDateString()}</div>`;
            } else {
              cellContent = `<div class="text-sm text-card-foreground truncate max-w-xs" title="${category[column.key]}">${category[column.key]}</div>`;
            }

            tableHtml += `<td class="px-6 py-4${responsiveClass}">${cellContent}</td>`;
          });

          // Add actions cell
          if (actions.length > 0) {
            tableHtml += `<td class="px-6 py-4">
              <div class="relative">
                <button onclick="toggleActionMenu('learning-category', ${category.id})" class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                <div id="actionMenu-learning-category-${category.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg z-10 border border-border">
                  <div class="py-1">`;

            actions.forEach(action => {
              if (action.type === 'link') {
                tableHtml += `<a href="${action.url}/${category.id}" class="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  ${action.icon}
                  ${action.label}
                </a>`;
              } else if (action.type === 'button') {
                tableHtml += `<button onclick="${action.onclick}(${category.id})" class="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  ${action.icon}
                  ${action.label}
                </button>`;
              } else if (action.type === 'delete') {
                tableHtml += `<button onclick="${action.onclick}(${category.id}, '${category.name}')" class="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <p class="text-lg font-medium text-muted-foreground mb-2">No learning categories found</p>
              <p class="text-sm text-muted-foreground/70">Get started by creating your first learning category.</p>
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
                    Showing ${start}-${end} of ${total} learning categories
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="text-sm text-muted-foreground font-medium">Rows per page:</span>
                      <select id="rowsPerPage-learning-categories" name="limit" class="border border-input rounded-lg px-3 py-2 text-sm bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        hx-get="/admin/table-pages/learning-categories" hx-target="#learningCategoriesTableContainer" hx-vals="js:{limit: document.getElementById('rowsPerPage-learning-categories').value}">
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
           tableHtml += `<button hx-get="/admin/table-pages/learning-categories?page=${prevPage}" hx-target="#learningCategoriesTableContainer"
            class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground transition-all duration-200 font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>`;
        }

        pages.forEach(page => {
          const isActive = page === pageNum;
           tableHtml += `<button hx-get="/admin/table-pages/learning-categories?page=${page}" hx-target="#learningCategoriesTableContainer"
            class="inline-flex items-center justify-center w-10 h-10 rounded-lg ${isActive ? 'bg-primary text-primary-foreground scale-105' : 'border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground'} transition-all duration-200 font-medium">${page}</button>`;
        });

        if (hasNext) {
           tableHtml += `<button hx-get="/admin/table-pages/learning-categories?page=${nextPage}" hx-target="#learningCategoriesTableContainer"
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

      // Add bulk actions if enabled
      if (true && bulkActions.length > 0) {
        tableHtml += `
        <div id="bulkActions-learning-categories" class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-full z-30" style="display: none;">
          <div class="flex items-center gap-4">
            <span id="selectedCount-learning-categories">0 learning categories selected</span>
            <div class="flex gap-2">`;

        bulkActions.forEach(action => {
          tableHtml += `<button onclick="${action.onclick}" id="${action.buttonId}-learning-categories" class="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground px-3 py-1 rounded text-sm" disabled="">
            ${action.label}
          </button>`;
        });

        tableHtml += `
            </div>
          </div>
        </div>`;
      }

      res.send(tableHtml);
    } else {
      res.render('admin/table-pages/learning-categories', {
        title: 'Learning Categories Management',
        currentPage: 'learning-categories',
        currentSection: 'learning',
        isTablePage: true,
        tableId: 'learning-categories',
        entityName: 'learning category',
        showCheckbox: true,
        showBulkActions: true,
        columns,
        data: learningCategories,
        actions,
        bulkActions,
        pagination,
        query: { search: search || '', status: '' },
        currentUrl: '/admin/table-pages/learning-categories',
        colspan,
        filterCounts,
        tableConfig
      });
    }
  } catch (error) {
    logger.error('Error loading learning categories:', error);
    res.render('admin/table-pages/learning-categories', {
      title: 'Learning Categories Management',
      currentPage: 'learning-categories',
      currentSection: 'learning',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' },
      filterCounts: { all: 0 }
    });
  }
};