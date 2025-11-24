import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import {
  applyTableFilters,
  getStatusCounts,
  getFilterCounts,
} from '../../helpers/tableFilters.js';
import { getTableConfig } from '../../config/tableFilters.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Learning Analytics Management
export const getLearningAnalytics = async (req, res) => {
  try {
    logger.info('Admin learning analytics page accessed');

    const { search = '', status = '', page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build Supabase query with filters
    let query = databaseService.supabase
      .from('learning_analytics')
      .select('*', { count: 'exact' });

    // Apply dynamic filters
    query = applyTableFilters(query, 'learning-analytics', req.query);

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: learningAnalytics, error, count } = await query;

    if (error) {
      logger.error('Error fetching learning analytics:', error);
      throw error;
    }

    const total = count || 0;

    // Get status counts using the dynamic helper
    const statusCounts = await getStatusCounts(
      'learning-analytics',
      databaseService
    );
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

    const columns = [
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'content_id', label: 'Content ID', type: 'text' },
      { key: 'event_type', label: 'Event Type', type: 'text' },
      { key: 'duration_seconds', label: 'Duration', type: 'text' },
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
        url: '/admin/table-pages/learning-analytics',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
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

    const colspan =
      columns.length + (false ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    // Prepare filter counts for template
    const filterCounts = getFilterCounts('learning-analytics', statusCounts);
    const tableConfig = getTableConfig('learning-analytics');

    if (isHtmxRequest(req)) {
      // Generate table HTML for HTMX requests
      let tableHtml = `
        <table class="min-w-full table-auto bg-card">
          <thead class="bg-card border-b border-border">
            <tr>`;

      // Add column headers
      columns.forEach((column) => {
        const responsiveClass = column.hidden
          ? ` hidden ${column.responsive}`
          : '';
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
      if (learningAnalytics.length > 0) {
        learningAnalytics.forEach((item) => {
          tableHtml += `<tr id="learning-analytic-row-${item.id}" class="h-16 border-b border-border hover:bg-muted/50 even:bg-muted/30 transition-colors duration-150">`;

          // Add data cells
          columns.forEach((column) => {
            const responsiveClass = column.hidden
              ? ` hidden ${column.responsive}`
              : '';
            let cellContent = '';

            if (column.type === 'date') {
              cellContent = `<div class="text-sm text-card-foreground">${new Date(item[column.key]).toLocaleDateString()}</div>`;
            } else {
              cellContent = `<div class="text-sm text-card-foreground truncate max-w-xs" title="${item[column.key]}">${item[column.key]}</div>`;
            }

            tableHtml += `<td class="px-6 py-4${responsiveClass}">${cellContent}</td>`;
          });

          // Add actions cell
          if (actions.length > 0) {
            tableHtml += `<td class="px-6 py-4">
              <div class="relative">
                <button onclick="toggleActionMenu('learning-analytic', ${item.id})" class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                <div id="actionMenu-learning-analytic-${item.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg z-10 border border-border">
                  <div class="py-1">`;

            actions.forEach((action) => {
              if (action.type === 'link') {
                tableHtml += `<a href="${action.url}/${item.id}" class="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  ${action.icon}
                  ${action.label}
                </a>`;
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <p class="text-lg font-medium text-muted-foreground mb-2">No learning analytics found</p>
              <p class="text-sm text-muted-foreground/70">Analytics data will appear here.</p>
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
                    Showing ${start}-${end} of ${total} learning analytics
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="text-sm text-muted-foreground font-medium">Rows per page:</span>
                      <select id="rowsPerPage-learning-analytics" name="limit" class="border border-input rounded-lg px-3 py-2 text-sm bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="10" ${limitNum === 10 ? 'selected' : ''}>10</option>
                      <option value="20" ${limitNum === 20 ? 'selected' : ''}>20</option>
                      <option value="50" ${limitNum === 50 ? 'selected' : ''}>50</option>
                      <option value="100" ${limitNum === 100 ? 'selected' : ''}>100</option>
                    </select>
                  </div>

                  <div class="flex items-center gap-2">
                    <nav class="flex items-center gap-1 text-sm">`;

      // Build query parameters for pagination (no search parameters needed)
      const queryString = '';

      // Add pagination buttons
      if (hasPrev) {
        tableHtml += `<button hx-get="/admin/table-pages/learning-analytics?page=${prevPage}${queryString}"
            class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground transition-all duration-200 font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>`;
      }

      pages.forEach((page) => {
        const isActive = page === pageNum;
        tableHtml += `<button hx-get="/admin/table-pages/learning-analytics?page=${page}${queryString}"
            class="inline-flex items-center justify-center w-10 h-10 rounded-lg ${isActive ? 'bg-primary text-primary-foreground scale-105' : 'border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground'} transition-all duration-200 font-medium">${page}</button>`;
      });

      if (hasNext) {
        tableHtml += `<button hx-get="/admin/table-pages/learning-analytics?page=${nextPage}${queryString}"
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
      // Prepare filter counts for template
      const filterCounts = getFilterCounts('learning-analytics', statusCounts);

      // Make variables available to layout for filter-nav
      res.locals.tableConfig = tableConfig;
      res.locals.filterCounts = filterCounts;
      res.locals.currentPage = 'learning-analytics';
      res.locals.query = { search: search || '', status: status || '' };

      res.render('admin/table-pages/learning-analytics', {
        title: 'Learning Analytics Management',
        currentPage: 'learning-analytics',
        currentSection: 'learning',
        isTablePage: true,
        tableId: 'learning-analytics',
        entityName: 'learning analytic',
        showCheckbox: false,
        showBulkActions: false,
        columns,
        data: learningAnalytics,
        actions,
        bulkActions: [],
        pagination,
        query: { search: search || '', status: status || '' },
        currentUrl: '/admin/table-pages/learning-analytics',
        colspan,
        filterCounts,
        tableConfig,
      });
    }
  } catch (error) {
    logger.error('Error loading learning analytics:', error);
    if (isHtmxRequest(req)) {
      res.send(
        '<div class="text-center text-muted-foreground">Error loading learning analytics. Please try again.</div>'
      );
    } else {
      res.render('admin/table-pages/learning-analytics', {
        title: 'Learning Analytics Management',
        currentPage: 'learning-analytics',
        currentSection: 'learning',
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
        filterCounts: { all: 0 },
      });
    }
  }
};
