import logger from '../../utils/logger.js';
 import { databaseService } from '../../services/index.js';
 import { applyTableFilters, getStatusCounts, getFilterCounts } from '../../helpers/tableFilters.js';
 import { getTableConfig } from '../../config/tableFilters.js';
 import { isHtmxRequest } from '../../helpers/http/index.js';

// Billing Management
export const getBilling = async (req, res) => {
  try {
    logger.info('Admin billing page accessed');

    const { search = '', status = '', page = 1, limit = 10 } = req.query;
    logger.info(`Query params: search="${search}", status="${status}", page=${page}, limit=${limit}`);
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    // Build Supabase query with filters
    let query = databaseService.supabase
      .from('billing')
      .select('*', { count: 'exact' });

    // Apply dynamic filters
    query = applyTableFilters(query, 'billing', req.query);

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data: transactions, error, count } = await query;

    if (error) {
      logger.error('Error fetching billing:', error);
      throw error;
    }

    logger.info(`Fetched ${transactions ? transactions.length : 0} billing records, total count: ${count}`);

    // Map to expected format
    const mappedTransactions = transactions.map(tx => ({
      id: tx.id,
      user: tx.user_id ? `User ${tx.user_id}` : 'Unknown', // Could join with Accounts table for name
      amount: `$${(tx.amount_cents / 100).toFixed(2)}`,
      status: tx.status,
      date: tx.created_at,
      package: tx.plan_name || 'N/A'
    }));

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

    // Get status counts using the dynamic helper
    const statusCounts = await getStatusCounts('billing', databaseService);
    logger.info(`Status counts: ${JSON.stringify(statusCounts)}`);

    const columns = [
      { key: 'user', label: 'User', type: 'text' },
      { key: 'amount', label: 'Amount', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'package', label: 'Package', type: 'text' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/table-pages/billing',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkRefundTransactions', buttonId: 'bulkRefundBtn', label: 'Refund Selected' }
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
    const filterCounts = getFilterCounts('billing', statusCounts);
    const tableConfig = getTableConfig('billing');

    // Make variables available to layout for filter-nav
    res.locals.tableConfig = tableConfig;
    res.locals.filterCounts = filterCounts;
    res.locals.currentPage = 'billing';
    res.locals.query = { search: search || '', status: status || '' };

    if (isHtmxRequest(req)) {
      // Generate table HTML for HTMX requests
      let tableHtml = `
        <table class="min-w-full table-auto bg-card">
          <thead class="bg-card border-b border-border">
            <tr>
              <th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">
                <input type="checkbox" id="selectAll-billing" class="rounded border-input text-primary">
              </th>`;

      // Add column headers
      columns.forEach(column => {
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
      if (mappedTransactions.length > 0) {
        mappedTransactions.forEach(transaction => {
          tableHtml += `<tr id="billing-row-${transaction.id}" class="h-16 border-b border-border hover:bg-muted/50 even:bg-muted/30 transition-colors duration-150">
            <td class="px-6 py-4">
              <input type="checkbox" class="billingCheckbox rounded border-input text-primary value="${transaction.id}" data-billing-id="${transaction.id}">
            </td>`;

          // Add data cells
          columns.forEach(column => {
            let cellContent = '';

            if (column.type === 'status') {
              cellContent = `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${transaction.status === 'paid' ? 'bg-green-100 text-green-800' : transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : transaction.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">${transaction[column.key]}</span>`;
            } else if (column.type === 'date') {
              cellContent = `<div class="text-sm text-card-foreground">${new Date(transaction[column.key]).toLocaleDateString()}</div>`;
            } else {
              cellContent = `<div class="text-sm text-card-foreground truncate max-w-xs" title="${transaction[column.key]}">${transaction[column.key]}</div>`;
            }

            tableHtml += `<td class="px-6 py-4">${cellContent}</td>`;
          });

          // Add actions cell
          if (actions.length > 0) {
            tableHtml += `<td class="px-6 py-4">
              <div class="relative">
                <button onclick="toggleActionMenu('billing', ${transaction.id})" class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                <div id="actionMenu-billing-${transaction.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg z-10 border border-border">
                  <div class="py-1">`;

            actions.forEach(action => {
              if (action.type === 'link') {
                tableHtml += `<a href="${action.url}/${transaction.id}" class="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p class="text-lg font-medium text-muted-foreground mb-2">No billing records found</p>
              <p class="text-sm text-muted-foreground/70">Billing transactions will appear here.</p>
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
                    Showing ${start}-${end} of ${total} billing records
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="text-sm text-muted-foreground font-medium">Rows per page:</span>
                      <select id="rowsPerPage-billing" name="limit" class="border border-input rounded-lg px-3 py-2 text-sm bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        hx-get="/admin/table-pages/billing" hx-target="#billingTableContainer" hx-vals="js:{limit: document.getElementById('rowsPerPage-billing').value}">
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
        tableHtml += `<button hx-get="/admin/table-pages/billing?page=${prevPage}" hx-target="#billingTableContainer"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground transition-all duration-200 font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>`;
      }

      pages.forEach(page => {
        const isActive = page === pageNum;
        tableHtml += `<button hx-get="/admin/table-pages/billing?page=${page}" hx-target="#billingTableContainer"
          class="inline-flex items-center justify-center w-10 h-10 rounded-lg ${isActive ? 'bg-primary text-primary-foreground scale-105' : 'border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground'} transition-all duration-200 font-medium">${page}</button>`;
      });

      if (hasNext) {
        tableHtml += `<button hx-get="/admin/table-pages/billing?page=${nextPage}" hx-target="#billingTableContainer"
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
        <div id="bulkActions-billing" class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-full z-30" style="display: none;">
          <div class="flex items-center gap-4">
            <span id="selectedCount-billing">0 transactions selected</span>
            <div class="flex gap-2">`;

        bulkActions.forEach(action => {
          tableHtml += `<button onclick="${action.onclick}" id="${action.buttonId}-billing" class="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground px-3 py-1 rounded text-sm" disabled="">
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
      res.render('admin/table-pages/billing', {
        title: 'Billing Management',
        currentPage: 'billing',
        currentSection: 'financial',
        isTablePage: true,
        tableId: 'billing',
        entityName: 'billing',
        showCheckbox: true,
        showBulkActions: true,
        columns,
        data: mappedTransactions,
        actions,
        bulkActions,
        pagination,
        query: { search: search || '', status: status || '' },
        currentUrl: '/admin/table-pages/billing',
        colspan,
        filterCounts,
        tableConfig
      });
    }
  } catch (error) {
    logger.error('Error loading billing:', error);
    res.render('admin/table-pages/billing', {
      title: 'Billing Management',
      currentPage: 'billing',
      currentSection: 'financial',
      isTablePage: true,
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' },
      filterCounts: { all: 0, pending: 0, paid: 0, failed: 0, refunded: 0 },
      tableConfig: getTableConfig('billing')
    });
  }
}