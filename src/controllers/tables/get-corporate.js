import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import { applyTableFilters, getStatusCounts, getFilterCounts } from '../../helpers/tableFilters.js';
import { getTableConfig } from '../../config/tableFilters.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Corporate Management
export const getCorporate = async (req, res) => {
  try {
    logger.info('Admin corporate page accessed');

    const { search, status, page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build Supabase query with filters
    let query = databaseService.supabase
      .from('corporate')
      .select('*', { count: 'exact' });

    // Apply dynamic filters
    query = applyTableFilters(query, 'corporate', req.query);

    // Apply pagination
    query = query
      .order('name', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: corporates, error, count } = await query;

    if (error) {
      logger.error('Error fetching corporates:', error);
      throw error;
    }

    logger.info(`Fetched ${corporates ? corporates.length : 0} corporates, total count: ${count}`);

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
    logger.info(`Fetched ${corporates.length} of ${total} corporates${filters.length ? ` (filtered by ${filters.join(', ')})` : ''}`);

    const columns = [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'company_size', label: 'Size', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/table-pages/corporate',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'editCorporate',
        label: 'Edit Corporate',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteCorporate',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkActivateCorporates', buttonId: 'bulkActivateBtn', label: 'Activate Selected' },
      { onclick: 'bulkDeactivateCorporates', buttonId: 'bulkDeactivateBtn', label: 'Deactivate Selected' },
      { onclick: 'bulkDeleteCorporates', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
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
    const statusCounts = await getStatusCounts('corporate', databaseService);
    const filterCounts = getFilterCounts('corporate', statusCounts);
    const tableConfig = getTableConfig('corporate');

    // Make variables available to layout for filter-nav
    res.locals.tableConfig = tableConfig;
    res.locals.filterCounts = filterCounts;
    res.locals.currentPage = 'corporate';
    res.locals.query = { search: search || '', status: status || '' };

    if (isHtmxRequest(req)) {
      // For HTMX requests, render just the table HTML
      const tableHtml = `
        <table class="min-w-full table-auto bg-card">
          <!-- Table Header -->
          <thead class="bg-card border-b border-border">
            <tr>
              <th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">
                <input type="checkbox" id="selectAll-corporate" class="rounded border-input text-primary" aria-label="Select all corporates">
              </th>
              ${columns.map(col => `<th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider${col.hidden ? ' hidden ' + col.responsive : ''} bg-muted">${col.label}</th>`).join('')}
              <th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">Actions</th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody class="text-sm text-card-foreground">
            ${corporates.length > 0 ? corporates.map(corporate => `
              <tr id="corporate-row-${corporate.id}" class="h-16 border-b border-border hover:bg-muted/50 even:bg-muted/30 transition-colors duration-150">
                <td class="px-6 py-4">
                  <input type="checkbox" class="corporateCheckbox rounded border-input text-primary value="${corporate.id}" data-corporate-id="${corporate.id}" aria-label="Select corporate ${corporate.name}">
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-card-foreground truncate max-w-xs" title="${corporate.name}">${corporate.name}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-card-foreground truncate max-w-xs" title="${corporate.industry}">${corporate.industry}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-card-foreground truncate max-w-xs" title="${corporate.company_size}">${corporate.company_size}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${corporate.status === 'active' ? 'bg-green-100 text-green-800' : corporate.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}">${corporate.status}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="relative">
                    <button onclick="toggleActionMenu('corporate', ${corporate.id})" class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors" aria-label="Actions menu">
                      <svg class="w-4 h-4 lucide lucide-ellipsis-vertical" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                    <div id="actionMenu-corporate-${corporate.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg z-10 border border-border">
                      <div class="py-1">
                        <a href="/admin/table-pages/corporate" class="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                          <svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          View Details
                        </a>
                        <button onclick="editCorporate(${corporate.id})" class="flex items-center w-full px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                          <svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>
                          Edit Corporate
                        </button>
                        <button onclick="deleteCorporate(${corporate.id}, '${corporate.name}')" class="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
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
                    <svg class="w-16 h-16 text-muted-foreground/50 mb-4 lucide lucide-building-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4c0-.27.035-.718.46-.963a.947.947 0 0 1 .54-.037c.26.063.554.25.768.36.254.13.506.274.746.416.45.21.9.42 1.35.616.826.382 1.652.772 2.474 1.21V22"/><path d="M2 22h20"/><path d="M10 6v6"/><path d="M14 6v6"/><path d="M6 6v6"/><path d="M18 6v6"/></svg>
                    <p class="text-lg font-medium text-muted-foreground mb-2">No corporate entities found</p>
                    <p class="text-sm text-muted-foreground/70">Get started by creating your first corporate entity.</p>
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
                    Showing ${start}-${end} of ${total} corporate entities
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="text-sm text-muted-foreground font-medium">Rows per page:</span>
                    <select id="rowsPerPage-corporate" name="limit" class="border border-input rounded-lg px-3 py-2 text-sm bg-background shadow-sm focus:outline-none focus:border-ring transition-colors" hx-get="/admin/table-pages/corporate" hx-target="#corporateTableContainer" hx-include="[name='search'],[name='status']">
                      <option value="10" ${limitNum === 10 ? 'selected' : ''}>10</option>
                      <option value="20" ${limitNum === 20 ? 'selected' : ''}>20</option>
                      <option value="50" ${limitNum === 50 ? 'selected' : ''}>50</option>
                      <option value="100" ${limitNum === 100 ? 'selected' : ''}>100</option>
                    </select>
                  </div>
                  <div class="flex items-center gap-2">
                    <nav class="flex items-center gap-1 text-sm">
                      ${hasPrev ? `<a href="?page=${prevPage}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground transition-all duration-200 font-medium" hx-get="/admin/table-pages/corporate?page=${prevPage}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" hx-target="#corporateTableContainer">
                        <svg class="w-4 h-4 lucide lucide-chevron-left" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      </a>` : ''}
                      ${pages.map(p => `<a href="?page=${p}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg${p === pageNum ? ' bg-primary text-primary-foreground scale-105' : ' border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground'} transition-all duration-200 font-medium" hx-get="/admin/table-pages/corporate?page=${p}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" hx-target="#corporateTableContainer">${p}</a>`).join('')}
                      ${hasNext ? `<a href="?page=${nextPage}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground transition-all duration-200" hx-get="/admin/table-pages/corporate?page=${nextPage}&limit=${limitNum}&search=${search || ''}&status=${status || ''}" hx-target="#corporateTableContainer" title="Next page">
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
      res.render('admin/table-pages/corporate', {
        title: 'Corporate Management',
        currentPage: 'corporate',
        currentSection: 'business',
        isTablePage: true,
        tableId: 'corporate',
        entityName: 'corporate',
        showCheckbox: true,
        showBulkActions: true,
        columns,
        data: corporates,
        actions,
        bulkActions,
        pagination,
        query: { search: search || '', status: status || '' },
        currentUrl: '/admin/table-pages/corporate',
        colspan,
        filterCounts,
        tableConfig
      });
    }
  } catch (error) {
    logger.error('Error loading corporates:', error);
    res.render('admin/table-pages/corporate', {
      title: 'Corporate Management',
      currentPage: 'corporate',
      currentSection: 'business',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};