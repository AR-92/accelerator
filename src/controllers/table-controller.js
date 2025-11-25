import logger from '../utils/logger.js';
import { databaseService } from '../services/index.js';
import {
  applyTableFilters,
  getStatusCounts,
  getFilterCounts,
} from '../helpers/tableFilters.js';
import { getTableConfig } from '../config/tableFilters.js';
import { isHtmxRequest } from '../helpers/http/index.js';
import { tableConfigs } from '../config/tableConfigs.js';

/**
 * Generic table controller that handles all table operations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getGenericTable = async (req, res) => {
  try {
    const { tableName } = req.params;
    const config = tableConfigs[tableName];

    if (!config) {
      logger.error(`Table configuration not found for: ${tableName}`);
      if (isHtmxRequest(req)) {
        return res.status(404).send(`
          <div class="text-red-500 p-4 bg-red-50 border border-red-200 rounded-md">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <span>Table configuration not found for: ${tableName}</span>
            </div>
          </div>
        `);
      } else {
        return res.status(404).send('Table configuration not found');
      }
    }

    const { search = '', status = '', page = 1, limit = 10 } = req.query;
    logger.info(
      `Generic table access: ${tableName}, query params: search="${search}", status="${status}", page=${page}, limit=${limit}`
    );

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    let data, count, error;

    if (tableName === 'votes_management') {
      // Special handling for votes - combine data from ideas and portfolios
      const { data: ideas, error: ideasError } = await databaseService.supabase
        .from('ideas')
        .select('id, title, upvotes, downvotes, created_at');

      const { data: portfolios, error: portfoliosError } =
        await databaseService.supabase
          .from('portfolios')
          .select('id, title, votes, upvotes, downvotes, created_date');

      if (ideasError) {
        logger.error('Error fetching ideas votes:', ideasError);
      }

      if (portfoliosError) {
        logger.error('Error fetching portfolios votes:', portfoliosError);
      }

      // Combine and format vote data
      let votes = [];

      // Process ideas votes
      if (ideas) {
        ideas.forEach((idea) => {
          if (idea.upvotes > 0) {
            votes.push({
              id: `idea-${idea.id}-up`,
              entity_type: 'idea',
              entity_title: idea.title,
              vote_type: 'upvote',
              vote_count: idea.upvotes,
              created_at: idea.created_at,
            });
          }
          if (idea.downvotes > 0) {
            votes.push({
              id: `idea-${idea.id}-down`,
              entity_type: 'idea',
              entity_title: idea.title,
              vote_type: 'downvote',
              vote_count: idea.downvotes,
              created_at: idea.created_at,
            });
          }
        });
      }

      // Process portfolios votes
      if (portfolios) {
        portfolios.forEach((portfolio) => {
          if (portfolio.upvotes > 0) {
            votes.push({
              id: `portfolio-${portfolio.id}-up`,
              entity_type: 'portfolio',
              entity_title: portfolio.title,
              vote_type: 'upvote',
              vote_count: portfolio.upvotes,
              created_at: portfolio.created_date,
            });
          }
          if (portfolio.downvotes > 0) {
            votes.push({
              id: `portfolio-${portfolio.id}-down`,
              entity_type: 'portfolio',
              entity_title: portfolio.title,
              vote_type: 'downvote',
              vote_count: portfolio.downvotes,
              created_at: portfolio.created_date,
            });
          }
        });
      }

      // Sort by creation date
      votes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Apply server-side filtering
      let filteredVotes = votes;

      // Apply search filter
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredVotes = filteredVotes.filter((vote) => {
          return (
            (vote.entity_type &&
              vote.entity_type.toLowerCase().includes(searchTerm)) ||
            (vote.entity_title &&
              vote.entity_title.toLowerCase().includes(searchTerm)) ||
            (vote.vote_type &&
              vote.vote_type.toLowerCase().includes(searchTerm)) ||
            (vote.vote_count &&
              vote.vote_count.toString().toLowerCase().includes(searchTerm))
          );
        });
      }

      // Apply status filter (vote_type)
      if (status) {
        filteredVotes = filteredVotes.filter(
          (vote) => vote.vote_type === status
        );
      }

      // Apply pagination
      const paginatedVotes = filteredVotes.slice(offset, offset + limitNum);

      data = paginatedVotes;
      count = filteredVotes.length;
      error = null;
    } else {
      // Build Supabase query with filters
      let query = databaseService.supabase
        .from(config.tableName)
        .select('*', { count: 'exact' });

      // Apply dynamic filters
      query = applyTableFilters(query, tableName, req.query);

      // Apply pagination
      query = query.range(offset, offset + limitNum - 1);

      const result = await query;
      data = result.data;
      error = result.error;
      count = result.count;
    }

    if (error) {
      logger.error(`Error fetching ${tableName}:`, error);
      throw error;
    }

    logger.info(
      `Fetched ${data ? data.length : 0} ${tableName} records, total count: ${count}`
    );

    // Apply data mapper if exists
    const mappedData = config.dataMapper ? config.dataMapper(data) : data;

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
      `Fetched ${mappedData.length} of ${total} ${tableName}${filters.length ? ` (filtered by ${filters.join(', ')})` : ''}`
    );

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
      config.columns.length +
      (config.showCheckbox ? 1 : 0) +
      (config.actions.length > 0 ? 1 : 0);

    // Get status counts for filter buttons
    let statusCounts;
    if (tableName === 'votes_management') {
      // Custom status counts for votes
      const allVotes = data.concat(); // data is already filtered, but for counts we need all
      // Actually, need to get all votes without pagination
      const { data: ideas } = await databaseService.supabase
        .from('ideas')
        .select('upvotes, downvotes');
      const { data: portfolios } = await databaseService.supabase
        .from('portfolios')
        .select('upvotes, downvotes');

      statusCounts = {};
      if (ideas) {
        ideas.forEach((idea) => {
          if (idea.upvotes > 0)
            statusCounts.upvote = (statusCounts.upvote || 0) + idea.upvotes;
          if (idea.downvotes > 0)
            statusCounts.downvote =
              (statusCounts.downvote || 0) + idea.downvotes;
        });
      }
      if (portfolios) {
        portfolios.forEach((portfolio) => {
          if (portfolio.upvotes > 0)
            statusCounts.upvote =
              (statusCounts.upvote || 0) + portfolio.upvotes;
          if (portfolio.downvotes > 0)
            statusCounts.downvote =
              (statusCounts.downvote || 0) + portfolio.downvotes;
        });
      }
    } else {
      statusCounts = await getStatusCounts(tableName, databaseService);
    }
    const filterCounts = getFilterCounts(tableName, statusCounts);
    const tableFilterConfig = getTableConfig(tableName);

    // Make variables available to layout for filter-nav
    res.locals.tableConfig = tableFilterConfig;
    res.locals.filterCounts = filterCounts;
    res.locals.currentPage = tableName;
    res.locals.query = { search: search || '', status: status || '' };

    if (isHtmxRequest(req)) {
      // Generate table HTML for HTMX requests
      const tableHtml = generateTableHtml(
        mappedData,
        config,
        pagination,
        tableName
      );
      res.send(tableHtml);
    } else {
      // For full page renders, use the table partial which expects {{id}} placeholders
      res.render('admin/table-page', {
        title: config.title,
        currentPage: tableName,
        currentSection: getCurrentSection(tableName),
        isTablePage: true,
        tableId: tableName,
        entityName: config.entityName,
        showCheckbox: config.showCheckbox,
        showBulkActions: config.showBulkActions,

        columns: config.columns,
        data: mappedData,
        actions: config.actions, // Pass original actions with {{id}} placeholders
        bulkActions: config.bulkActions,
        pagination,
        query: { search: search || '', status: status || '' },
        currentUrl: `/admin/table-pages/${tableName}`,
        colspan,
        filterCounts,
        tableConfig: tableFilterConfig,
      });
    }
  } catch (error) {
    logger.error('Error loading generic table:', error);
    const { tableName } = req.params;

    if (isHtmxRequest(req)) {
      // Return error HTML for HTMX requests, not full page
      res.status(500).send(`
        <div class="text-red-500 p-4 bg-red-50 border border-red-200 rounded-md">
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span>Error loading ${tableName || 'table'}: ${error.message}</span>
          </div>
        </div>
      `);
    } else {
      res.render('admin/table-page', {
        title: 'Table Management',
        currentPage: tableName || 'unknown',
        currentSection: 'main',
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
        filterCounts: {
          all: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          active: 0,
          draft: 0,
        },
        error: `Error loading ${tableName || 'table'}`,
      });
    }
  }
};

/**
 * Generate table HTML for HTMX requests
 */
function generateTableHtml(data, config, pagination, tableName) {
  const { columns, actions, bulkActions, showCheckbox } = config;
  const {
    currentPage,
    limit,
    total,
    start,
    end,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
    pages,
  } = pagination;

  let tableHtml = `
    <table class="min-w-full table-auto bg-card rounded-md">
      <thead class="bg-card border-b border-border rounded-t-xl">
        <tr>
          ${
            showCheckbox
              ? `<th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">
            <input type="checkbox" id="selectAll-${tableName}" class="rounded border-input text-primary">
          </th>`
              : ''
          }`;

  // Add column headers
  columns.forEach((column) => {
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
  if (data.length > 0) {
    data.forEach((item) => {
      tableHtml += `<tr id="${tableName}-row-${item.id}" class="h-16 border-b border-border hover:bg-muted/50 even:bg-muted/30 transition-colors duration-150">
        ${
          showCheckbox
            ? `<td class="px-6 py-4">
          <input type="checkbox" class="${tableName}Checkbox rounded border-input text-primary value="${item.id}" data-${tableName}-id="${item.id}">
        </td>`
            : ''
        }`;

      // Add data cells
      columns.forEach((column) => {
        const responsiveClass = column.hidden
          ? ` hidden ${column.responsive}`
          : '';
        let cellContent = '';

        if (column.type === 'status') {
          cellContent = `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(item[column.key])}">${item[column.key]}</span>`;
        } else if (column.type === 'date') {
          cellContent = `<div class="text-sm text-card-foreground">${new Date(item[column.key]).toLocaleDateString()}</div>`;
        } else if (column.type === 'title') {
          cellContent = `<div>
            <div class="text-sm font-medium text-card-foreground">${item[column.key]}</div>
            ${column.descriptionKey && item[column.descriptionKey] ? `<div class="text-sm text-muted-foreground">${item[column.descriptionKey]}</div>` : ''}
          </div>`;
        } else {
          cellContent = `<div class="text-sm text-card-foreground truncate max-w-xs" title="${item[column.key]}">${item[column.key]}</div>`;
        }

        tableHtml += `<td class="px-6 py-4${responsiveClass}">${cellContent}</td>`;
      });

      // Add actions cell
      if (actions.length > 0) {
        tableHtml += `<td class="px-6 py-4">
          <div class="flex items-center gap-2">`;

        actions.forEach((action) => {
          // For HTMX requests, construct URLs based on action type
          let url = '';
          let hxGet = '';
          let hxPut = '';
          let hxDelete = '';
          const hxConfirm = action.hxConfirm || '';

          if (action.type === 'link') {
            url = `${action.url}/${item.id}`;
          } else if (action.type === 'button') {
            hxGet = `${action.hxGet}/${item.id}`;
          } else if (action.type === 'approve') {
            hxPut = `${action.hxPut}/${item.id}/approve`;
          } else if (action.type === 'reject') {
            hxPut = `${action.hxPut}/${item.id}/reject`;
          } else if (action.type === 'toggle') {
            hxPut = `${action.hxPut}/${item.id}`;
          } else if (action.type === 'delete') {
            hxDelete = `${action.hxDelete}/${item.id}`;
          }

          if (action.type === 'link') {
            tableHtml += `<a href="${url}" class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors" title="${action.label}">
              ${action.icon.replace('mr-3', '')}
            </a>`;
          } else if (action.type === 'button') {
            tableHtml += `<button hx-get="${hxGet}" hx-target="body" hx-swap="beforeend" class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors" title="${action.label}">
              ${action.icon.replace('mr-3', '')}
            </button>`;
          } else if (
            action.type === 'approve' ||
            action.type === 'reject' ||
            action.type === 'toggle'
          ) {
            tableHtml += `<button hx-put="${hxPut}" class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors" title="${action.label}">
              ${action.icon.replace('mr-3', '')}
            </button>`;
          } else if (action.type === 'delete') {
            tableHtml += `<button hx-delete="${hxDelete}" hx-confirm="${hxConfirm.replace('this idea', `"${item.title || item.name || 'this item'}"`)}" class="p-2 rounded-full hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors" title="${action.label}">
              ${action.icon.replace('mr-3', '')}
            </button>`;
          }
        });

        tableHtml += `
          </div>
        </td>`;
      }

      tableHtml += `</tr>`;
    });
  } else {
    // Empty state
    const colspan =
      columns.length + (showCheckbox ? 1 : 0) + (actions.length > 0 ? 1 : 0);
    tableHtml += `<tr class="h-16">
      <td colspan="${colspan}" class="px-6 py-8 text-center text-muted-foreground">
        <div class="flex flex-col items-center justify-center py-12">
          <svg class="w-16 h-16 text-muted-foreground/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-lg font-medium text-muted-foreground mb-2">No ${config.entityName} found</p>
          <p class="text-sm text-muted-foreground/70">Get started by creating your first ${config.entityName}.</p>
        </div>
      </td>
    </tr>`;
  }

  tableHtml += `
      </tbody>
      <tfoot>
        <tr>
          <td colspan="${columns.length + (showCheckbox ? 1 : 0) + (actions.length > 0 ? 1 : 0)}" class="bg-card border-t border-border px-4 py-3">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
              <div class="text-xs text-muted-foreground">
                ${start}-${end} of ${total}
              </div>

              <div class="flex items-center gap-3">
                <select id="rowsPerPage-${tableName}" name="limit" class="border border-input rounded px-2 py-1 text-xs bg-background focus:outline-none focus:border-ring transition-colors"
                  hx-get="/admin/table-pages/${tableName}" hx-target="#${tableName}TableContainer" hx-vals="js:{limit: document.getElementById('rowsPerPage-${tableName}').value}">
                  <option value="10" ${currentPage === 10 ? 'selected' : ''}>10</option>
                  <option value="20" ${currentPage === 20 ? 'selected' : ''}>20</option>
                  <option value="50" ${currentPage === 50 ? 'selected' : ''}>50</option>
                  <option value="100" ${currentPage === 100 ? 'selected' : ''}>100</option>
                </select>

                <nav class="flex items-center gap-1">`;

  // Add pagination buttons
  if (hasPrev) {
    tableHtml += `<button hx-get="/admin/table-pages/${tableName}?page=${prevPage}" hx-target="#${tableName}TableContainer"
      class="inline-flex items-center justify-center w-8 h-8 rounded border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>`;
  }

  pages.forEach((page) => {
    const isActive = page === currentPage;
    tableHtml += `<button hx-get="/admin/table-pages/${tableName}?page=${page}" hx-target="#${tableName}TableContainer"
      class="inline-flex items-center justify-center px-2 py-1 rounded${isActive ? ' bg-muted text-foreground' : ' text-muted-foreground hover:text-foreground'} transition-colors text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">${page}</button>`;
  });

  if (hasNext) {
    tableHtml += `<button hx-get="/admin/table-pages/${tableName}?page=${nextPage}" hx-target="#${tableName}TableContainer"
      class="inline-flex items-center justify-center w-8 h-8 rounded border border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
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
  if (showCheckbox && bulkActions.length > 0) {
    tableHtml += `
      <div id="bulkActions-${tableName}" class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-full z-30" style="display: none;">
        <div class="flex items-center gap-4">
          <span id="selectedCount-${tableName}">0 ${config.entityName} selected</span>
          <div class="flex gap-2">`;

    bulkActions.forEach((action) => {
      tableHtml += `<button onclick="${action.onclick}" id="${action.buttonId}-${tableName}" class="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground px-3 py-1 rounded text-sm" disabled="">
        ${action.label}
      </button>`;
    });

    tableHtml += `
          </div>
        </div>
      </div>`;
  }

  return tableHtml;
}

/**
 * Get status class for styling
 */
function getStatusClass(status) {
  const statusClasses = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get row detail for a specific table and id
 */
export const getRowDetail = async (req, res) => {
  try {
    const { tableName, id } = req.params;
    const config = tableConfigs[tableName];

    if (!config) {
      logger.error(`Table configuration not found for: ${tableName}`);
      return res.status(404).send('Table configuration not found');
    }

    const { data, error } = await databaseService.supabase
      .from(config.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      logger.error(`Row not found for table ${tableName}, id ${id}:`, error);
      return res.status(404).send('Row not found');
    }

    const mappedData = data;

    // Define actions for the detail page
    const actions = [
      {
        link: `/admin/table-pages/${tableName}`,
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-arrow-left" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>',
        text: 'Go Back',
      },
      {
        link: `/admin/table-pages/${tableName}/edit/${id}`,
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
        text: 'Edit',
      },
      {
        link: `/admin/table-pages/${tableName}/view/${id}`,
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
        text: 'View',
      },
    ];

    res.locals.isRowPage = true;
    res.locals.rowActions = actions;

    res.render('admin/row-detail', {
      title: `View ${config.entityName}`,
      description: `Details for ${config.entityName} ${id}`,
      table: tableName,
      entity: config.entityName,
      row: mappedData,
      columns: config.columns,
      actions,
    });
  } catch (error) {
    logger.error('Error loading row detail:', error);
    res.status(500).send('Error loading row detail');
  }
};

/**
 * Get row edit form for a specific table and id
 */
export const getRowEdit = async (req, res) => {
  try {
    const { tableName, id } = req.params;
    const config = tableConfigs[tableName];

    if (!config) {
      logger.error(`Table configuration not found for: ${tableName}`);
      return res.status(404).send('Table configuration not found');
    }

    const { data, error } = await databaseService.supabase
      .from(config.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      logger.error(`Row not found for table ${tableName}, id ${id}:`, error);
      return res.status(404).send('Row not found');
    }

    const mappedData = data;

    // Define actions for the edit page
    const actions = [
      {
        link: `/admin/table-pages/${tableName}`,
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-arrow-left" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>',
        text: 'Go Back',
      },
      {
        link: `/admin/table-pages/${tableName}/edit/${id}`,
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-edit" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>',
        text: 'Edit',
      },
      {
        link: `/admin/table-pages/${tableName}/create`,
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-plus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>',
        text: 'Create',
      },
    ];

    res.render('admin/row-edit', {
      title: `Edit ${config.entityName}`,
      description: `Edit details for ${config.entityName} ${id}`,
      table: tableName,
      entity: config.entityName,
      row: mappedData,
      columns: config.columns,
      actions,
    });
  } catch (error) {
    logger.error('Error loading row edit:', error);
    res.status(500).send('Error loading row edit');
  }
};

/**
 * Get row create form for a specific table
 */
export const getRowCreate = async (req, res) => {
  try {
    const { tableName } = req.params;
    const config = tableConfigs[tableName];

    if (!config) {
      logger.error(`Table configuration not found for: ${tableName}`);
      return res.status(404).send('Table configuration not found');
    }

    // Define actions for the create page
    const actions = [
      {
        link: `/admin/table-pages/${tableName}`,
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-arrow-left" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><path d="M12 19l-7-7 7-7"></path></svg>',
        text: 'Go Back',
      },
      {
        link: `/admin/table-pages/${tableName}/create`,
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-plus" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>',
        text: 'Create',
      },
    ];

    res.render('admin/row-create', {
      title: `Create ${config.entityName}`,
      description: `Create a new ${config.entityName}`,
      table: tableName,
      entity: config.entityName,
      row: {}, // Empty row for new creation
      columns: config.columns,
      actions,
    });
  } catch (error) {
    logger.error('Error loading row create:', error);
    res.status(500).send('Error loading row create');
  }
};

/**
 * Get current section based on table name
 */
function getCurrentSection(tableName) {
  const sectionMap = {
    ideas: 'main',
    users: 'main',
    billing: 'financial',
    content: 'content-management',
    'landing-page': 'content-management',
    votes: 'main',
    collaborations: 'main',
    'learning-content': 'learning',
    'learning-categories': 'learning',
    'learning-assessments': 'learning',
    'learning-analytics': 'learning',
    packages: 'financial',
    rewards: 'financial',
    'business-model': 'business',
    'business-plan': 'business',
    'financial-model': 'business',
    pitchdeck: 'business',
    valuation: 'business',
    funding: 'business',
    team: 'business',
    legal: 'business',
    marketing: 'business',
    corporate: 'business',
    enterprises: 'business',
    messages: 'projects',
    'project-collaborators': 'projects',
    calendar: 'projects',
    'help-center': 'help',
  };
  return sectionMap[tableName] || 'main';
}
