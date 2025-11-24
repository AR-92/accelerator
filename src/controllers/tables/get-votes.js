import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';
import {
  applyTableFilters,
  getStatusCounts,
  getFilterCounts,
} from '../../helpers/tableFilters.js';
import { getTableConfig } from '../../config/tableFilters.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Votes Management
export const getVotes = async (req, res) => {
  try {
    logger.info('Admin votes page accessed');

    const { search = '', status = '', page = 1, limit = 10 } = req.query;
    logger.info(
      `Query params: search="${search}", status="${status}", page=${page}, limit=${limit}`
    );

    // Fetch vote data from ideas and portfolios tables
    const { data: ideas, error: ideasError } = await databaseService.supabase
      .from('ideas')
      .select('id, title, upvotes, downvotes, created_at')
      .order('created_at', { ascending: false });

    const { data: portfolios, error: portfoliosError } =
      await databaseService.supabase
        .from('portfolios')
        .select('id, title, votes, upvotes, downvotes, created_date')
        .order('created_date', { ascending: false });

    if (ideasError) {
      logger.error('Error fetching ideas votes:', ideasError);
    }

    if (portfoliosError) {
      logger.error('Error fetching portfolios votes:', portfoliosError);
    }

    // Combine and format vote data
    const votes = [];

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
      filteredVotes = filteredVotes.filter((vote) => vote.vote_type === status);
    }

    // Apply pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;
    const paginatedVotes = filteredVotes.slice(offset, offset + limitNum);

    const total = filteredVotes.length;
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
      { key: 'entity_type', label: 'Type', type: 'text' },
      { key: 'entity_title', label: 'Title', type: 'text' },
      { key: 'vote_type', label: 'Vote Type', type: 'status' },
      { key: 'vote_count', label: 'Count', type: 'text' },
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
        url: '/admin/table-pages/votes',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>',
      },
      {
        type: 'delete',
        onclick: 'deleteVote',
        label: 'Delete Vote',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
      },
    ];

    const bulkActions = [
      {
        onclick: 'bulkDeleteVotes',
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

    const colspan =
      columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    // Prepare filter counts for template
    const statusCounts = {};
    votes.forEach((vote) => {
      const voteType = vote.vote_type;
      if (voteType) {
        statusCounts[voteType] =
          (statusCounts[voteType] || 0) + vote.vote_count;
      }
    });
    const filterCounts = getFilterCounts('votes', statusCounts);
    const tableConfig = getTableConfig('votes');

    // Make variables available to layout for filter-nav
    res.locals.tableConfig = tableConfig;
    res.locals.filterCounts = filterCounts;
    res.locals.currentPage = 'votes';
    res.locals.query = { search: search || '', status: status || '' };

    if (isHtmxRequest(req)) {
      // Generate table HTML for HTMX requests
      let tableHtml = `
        <table class="min-w-full table-auto bg-card">
          <thead class="bg-card border-b border-border">
            <tr>
              <th class="px-6 py-4 text-left font-semibold text-card-foreground uppercase text-xs tracking-wider bg-muted">
                <input type="checkbox" id="selectAll-votes" class="rounded border-input text-primary">
              </th>`;

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
      if (paginatedVotes.length > 0) {
        paginatedVotes.forEach((vote) => {
          tableHtml += `<tr id="vote-row-${vote.id}" class="h-16 border-b border-border hover:bg-muted/50 even:bg-muted/30 transition-colors duration-150">
            <td class="px-6 py-4">
              <input type="checkbox" class="voteCheckbox rounded border-input text-primary value="${vote.id}" data-vote-id="${vote.id}">
            </td>`;

          // Add data cells
          columns.forEach((column) => {
            const responsiveClass = column.hidden
              ? ` hidden ${column.responsive}`
              : '';
            let cellContent = '';

            if (column.type === 'status') {
              cellContent = `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${vote[column.key] === 'upvote' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${vote[column.key]}</span>`;
            } else if (column.type === 'date') {
              cellContent = `<div class="text-sm text-card-foreground">${new Date(vote[column.key]).toLocaleDateString()}</div>`;
            } else {
              cellContent = `<div class="text-sm text-card-foreground truncate max-w-xs" title="${vote[column.key]}">${vote[column.key]}</div>`;
            }

            tableHtml += `<td class="px-6 py-4${responsiveClass}">${cellContent}</td>`;
          });

          // Add actions cell
          if (actions.length > 0) {
            tableHtml += `<td class="px-6 py-4">
              <div class="relative">
                <button onclick="toggleActionMenu('vote', '${vote.id}')" class="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>
                <div id="actionMenu-vote-${vote.id}" class="dropdown-menu hidden absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg z-10 border border-border">
                  <div class="py-1">`;

            actions.forEach((action) => {
              if (action.type === 'link') {
                tableHtml += `<a href="${action.url}/${vote.id}" class="flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  ${action.icon}
                  ${action.label}
                </a>`;
              } else if (action.type === 'delete') {
                tableHtml += `<button onclick="${action.onclick}('${vote.id}', '${vote.entity_title}')" class="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
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
          <td colspan="${columns.length + 2}" class="px-6 py-8 text-center text-muted-foreground">
            <div class="flex flex-col items-center justify-center py-12">
              <svg class="w-16 h-16 text-muted-foreground/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-lg font-medium text-muted-foreground mb-2">No votes found</p>
              <p class="text-sm text-muted-foreground/70">No votes match your current filters.</p>
            </div>
          </td>
        </tr>`;
      }

      tableHtml += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="${columns.length + 2}" class="bg-card border-t border-border p-4">
                <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div class="text-sm text-muted-foreground">
                    Showing ${start}-${end} of ${total} votes
                  </div>

                  <div class="flex items-center gap-3">
                    <span class="text-sm text-muted-foreground font-medium">Rows per page:</span>
                      <select id="rowsPerPage-votes" name="limit" class="border border-input rounded-lg px-3 py-2 text-sm bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        hx-get="/admin/table-pages/votes" hx-target="#votesTableContainer" hx-vals="js:{limit: document.getElementById('rowsPerPage-votes').value, search: '${search}', status: '${status}'}">
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
        tableHtml += `<button hx-get="/admin/table-pages/votes?page=${prevPage}&search=${encodeURIComponent(search)}&status=${status}" hx-target="#votesTableContainer"
            class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground transition-all duration-200 font-medium">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>`;
      }

      pages.forEach((page) => {
        const isActive = page === pageNum;
        tableHtml += `<button hx-get="/admin/table-pages/votes?page=${page}&search=${encodeURIComponent(search)}&status=${status}" hx-target="#votesTableContainer"
            class="inline-flex items-center justify-center w-10 h-10 rounded-lg ${isActive ? 'bg-primary text-primary-foreground scale-105' : 'border border-input text-muted-foreground hover:bg-accent hover:border-accent-foreground'} transition-all duration-200 font-medium">${page}</button>`;
      });

      if (hasNext) {
        tableHtml += `<button hx-get="/admin/table-pages/votes?page=${nextPage}&search=${encodeURIComponent(search)}&status=${status}" hx-target="#votesTableContainer"
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
        <div id="bulkActions-votes" class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-full z-30" style="display: none;">
          <div class="flex items-center gap-4">
            <span id="selectedCount-votes">0 votes selected</span>
            <div class="flex gap-2">`;

        bulkActions.forEach((action) => {
          tableHtml += `<button onclick="${action.onclick}" id="${action.buttonId}-votes" class="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground px-3 py-1 rounded text-sm" disabled="">
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
      res.render('admin/table-pages/votes', {
        title: 'Votes Management',
        currentPage: 'votes',
        currentSection: 'main',
        isTablePage: true,
        tableId: 'votes',
        entityName: 'vote',
        showCheckbox: true,
        showBulkActions: true,
        columns,
        data: paginatedVotes,
        actions,
        bulkActions,
        pagination,
        query: { search: search || '', status: status || '' },
        currentUrl: '/admin/table-pages/votes',
        colspan,
        filterCounts,
        tableConfig,
      });
    }
  } catch (error) {
    logger.error('Error loading votes:', error);
    res.render('admin/table-pages/votes', {
      title: 'Votes Management',
      currentPage: 'votes',
      currentSection: 'main',
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
      filterCounts: { all: 0, upvote: 0, downvote: 0 },
      tableConfig: getTableConfig('votes'),
    });
  }
};
