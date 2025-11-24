import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import { applyTableFilters, getStatusCounts, getFilterCounts } from '../../helpers/tableFilters.js';
import { getTableConfig } from '../../config/tableFilters.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Marketing Management
export const getMarketing = async (req, res) => {
  try {
    logger.info('Admin marketing page accessed');

    const { search, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build Supabase query with filters
    let query = databaseService.supabase
      .from('marketing')
      .select('*', { count: 'exact' });

    // Apply dynamic filters
    query = applyTableFilters(query, 'marketing', req.query);

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: marketings, error, count } = await query;

    if (error) {
      logger.error('Error fetching marketings:', error);
      throw error;
    }

    logger.info(`Fetched ${marketings ? marketings.length : 0} marketings, total count: ${count}`);

    const total = count || 0;
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
    if (status) filters.push(`status: ${status}`);
    if (pageNum > 1) filters.push(`page: ${pageNum}`);
    logger.info(`Fetched ${marketings.length} of ${total} marketings${filters.length ? ` (filtered by ${filters.join(', ')})` : ''}`);

    const columns = [
      { key: 'unique_value_proposition', label: 'UVP', type: 'text' },
      { key: 'marketing_channels', label: 'Channels', type: 'text' },
      { key: 'marketing_budget', label: 'Budget', type: 'text' },
      { key: 'target_audience', label: 'Audience', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/table-pages/marketing',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'editMarketing',
        label: 'Edit Marketing',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteMarketing',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkActivateMarketings', buttonId: 'bulkActivateBtn', label: 'Activate Selected' },
      { onclick: 'bulkArchiveMarketings', buttonId: 'bulkArchiveBtn', label: 'Archive Selected' },
      { onclick: 'bulkDeleteMarketings', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
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

    // Get status counts for filter buttons
    const statusCounts = await getStatusCounts('marketing', databaseService);
    const filterCounts = getFilterCounts('marketing', statusCounts);
    const tableConfig = getTableConfig('marketing');

    // Make variables available to layout for filter-nav
    res.locals.tableConfig = tableConfig;
    res.locals.filterCounts = filterCounts;
    res.locals.currentPage = 'marketing';
    res.locals.query = { search: search || '', status: status || '' };

    if (isHtmxRequest(req)) {
      // For HTMX requests, render just the table HTML
      const tableHtml = `
        <table class="min-w-full table-auto bg-card">
          <!-- Table Header -->
          <thead class="bg-card border-b border-border">
            <tr>
              <th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">
                <input type="checkbox" id="selectAll-marketing" class="rounded border-input text-primary" aria-label="Select all marketings">
              </th>
              ${columns.map(col => `<th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider${col.hidden ? ' hidden ' + col.responsive : ''} bg-muted">${col.label}</th>`).join('')}
              <th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">Actions</th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody class="text-sm text-card-foreground">
            ${marketings.length > 0 ? marketings.map(marketing => `
              <tr id="marketing-row-${marketing.id}" class="h-16 border-b border-border hover:bg-muted/50 even:bg-muted/30 transition-colors duration-150">
                <td class="px-6 py-4">
                  <input type="checkbox" class="marketingCheckbox rounded border-input text-primary value="${marketing.id}" data-marketing-id="${marketing.id}" aria-label="Select marketing ${marketing.unique_value_proposition}">
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-card-foreground truncate max-w-xs" title="${marketing.unique_value_proposition}">${marketing.unique_value_proposition}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-card-foreground truncate max-w-xs" title="${marketing.marketing_channels}">${marketing.marketing_channels}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-card-foreground truncate max-w-xs" title="${marketing.marketing_budget}">${marketing.marketing_budget}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-card-foreground truncate max-w-xs" title="${marketing.target_audience}">${marketing.target_audience}</div>
                </td>
                <td class="px-6 py-4 hidden lg:table-cell">
                  <div class="text-sm text-card-foreground">${new Date(marketing.created_at).toLocaleDateString()}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="relative">
                    <button onclick="toggleActionMenu('marketing', ${marketing.id})" class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors" aria-label="Actions menu">
                      <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                    <div id="actionMenu-marketing-${marketing.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg z-10 border border-border">
                      <div class="py-1">
                        <a href="/admin/table-pages/marketing" class="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                          <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          View Details
                        </a>
                        <button onclick="editMarketing(${marketing.id})" class="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                          <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>
                          Edit Marketing
                        </button>
                        <button onclick="deleteMarketing(${marketing.id}, '${marketing.unique_value_proposition}')" class="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                          <svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            `).join('') : `
              <tr class="h-16">
                <td colspan="${colspan}" class="px-6 py-8 text-center text-muted-foreground">
                  <div class="flex flex-col items-center justify-center py-12">
                    <svg class="w-16 h-16 text-muted-foreground/50 mb-4 lucide lucide-trending-up" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline><polyline points="17,6 23,6 23,12"></polyline></svg>
                    <p class="text-lg font-medium text-muted-foreground mb-2">No marketing campaigns found</p>
                    <p class="text-sm text-muted-foreground/70">Get started by creating your first marketing campaign.</p>
                  </div>
                </td>
              </tr>
            `}
          </tbody>
          <!-- Table Footer -->
          <tfoot>
            <tr>
              <td colspan="${colspan}" class="bg-card border-t border-border p-4">
                <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div class="text-sm text-muted-foreground">
                    Showing ${start}-${end} of ${total} marketing campaigns
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-muted-foreground font-medium">Rows per page:</span>
                    <select id="rowsPerPage-marketing" name="limit" class="border border-input rounded-lg px-3 py-2 text-sm bg-background shadow-sm focus:outline-none focus:border-ring transition-colors" hx-get="/admin/table-pages/marketing" hx-target="#marketingTableContainer" hx-include="[name='search'],[name='status']">
                      <option value="10" ${limitNum === 10 ? 'selected' : ''}>10</option>
                      <option value="20" ${limitNum === 20 ? 'selected' : ''}>20</option>
                      <option value="50" ${limitNum === 50 ? 'selected' : ''}>50</option>
                      <option value="100" ${limitNum === 100 ? 'selected' : ''}>100</option>
                    </select>
                  </div>
                  <div class="flex items-center gap-2">
                    <nav class="flex items-center gap-1 text-sm">
                      ${hasPrev ? `<a href="?page=${prevPage}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground transition-all duration-200 font-medium" hx-get="/admin/table-pages/marketing?page=${prevPage}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" hx-target="#marketingTableContainer">
                        <svg class="w-4 h-4 lucide lucide-chevron-left" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      </a>` : ''}
                      ${pages.map(p => `<a href="?page=${p}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg${p === pageNum ? ' bg-primary text-primary-foreground scale-105' : ' border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground'} transition-all duration-200 font-medium" hx-get="/admin/table-pages/marketing?page=${p}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" hx-target="#marketingTableContainer">${p}</a>`).join('')}
                      ${hasNext ? `<a href="?page=${nextPage}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground transition-all duration-200" hx-get="/admin/table-pages/marketing?page=${nextPage}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" hx-target="#marketingTableContainer" title="Next page">
                        <svg class="w-4 h-4 lucide lucide-chevron-right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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
      res.render('admin/table-pages/marketing', {
        title: 'Marketing Management',
        currentPage: 'marketing',
        currentSection: 'business',
        isTablePage: true,
        tableId: 'marketing',
        entityName: 'marketing',
        showCheckbox: true,
        showBulkActions: true,
        columns,
        data: marketings,
        actions,
        bulkActions,
        pagination,
        query: { search: search || '', status: status || '' },
        currentUrl: '/admin/table-pages/marketing',
        colspan,
        filterCounts,
        tableConfig
      });
    }
  } catch (error) {
    logger.error('Error loading marketings:', error);
    res.render('admin/table-pages/marketing', {
      title: 'Marketing Management',
      currentPage: 'marketing',
      currentSection: 'business',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};