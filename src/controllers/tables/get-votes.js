import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Votes Management
export const getVotes = async (req, res) => {
  try {
    logger.info('Admin votes page accessed');

    // Fetch vote data from ideas and portfolios tables
    const { data: ideas, error: ideasError } = await databaseService.supabase
      .from('idea')
      .select('id, title, upvotes, downvotes, created_at')
      .order('created_at', { ascending: false });

    const { data: portfolios, error: portfoliosError } = await databaseService.supabase
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
      ideas.forEach(idea => {
        if (idea.upvotes > 0) {
          votes.push({
            id: `idea-${idea.id}-up`,
            entity_type: 'idea',
            entity_title: idea.title,
            vote_type: 'upvote',
            vote_count: idea.upvotes,
            created_at: idea.created_at
          });
        }
        if (idea.downvotes > 0) {
          votes.push({
            id: `idea-${idea.id}-down`,
            entity_type: 'idea',
            entity_title: idea.title,
            vote_type: 'downvote',
            vote_count: idea.downvotes,
            created_at: idea.created_at
          });
        }
      });
    }

    // Process portfolios votes
    if (portfolios) {
      portfolios.forEach(portfolio => {
        if (portfolio.upvotes > 0) {
          votes.push({
            id: `portfolio-${portfolio.id}-up`,
            entity_type: 'portfolio',
            entity_title: portfolio.title,
            vote_type: 'upvote',
            vote_count: portfolio.upvotes,
            created_at: portfolio.created_date
          });
        }
        if (portfolio.downvotes > 0) {
          votes.push({
            id: `portfolio-${portfolio.id}-down`,
            entity_type: 'portfolio',
            entity_title: portfolio.title,
            vote_type: 'downvote',
            vote_count: portfolio.downvotes,
            created_at: portfolio.created_date
          });
        }
      });
    }

    // Sort by creation date
    votes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    let filteredVotes = votes;

    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      filteredVotes = votes.filter(vote => {
        return (vote.entity_type && vote.entity_type.toLowerCase().includes(search)) ||
               (vote.entity_title && vote.entity_title.toLowerCase().includes(search)) ||
               (vote.vote_type && vote.vote_type.toLowerCase().includes(search)) ||
               (vote.vote_count && vote.vote_count.toString().toLowerCase().includes(search));
      });
    }

    const columns = [
      { key: 'entity_type', label: 'Type', type: 'text' },
      { key: 'entity_title', label: 'Title', type: 'text' },
      { key: 'vote_type', label: 'Vote Type', type: 'status' },
      { key: 'vote_count', label: 'Count', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/table-pages/votes',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteVote',
        label: 'Delete Vote',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkDeleteVotes', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: filteredVotes.length,
      start: 1,
      end: filteredVotes.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

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
      data: filteredVotes,
      actions,
      bulkActions,
      pagination,
      query: { search: req.query.search || '', status: '' },
      currentUrl: '/admin/table-pages/votes',
      colspan
    });
  } catch (error) {
    logger.error('Error loading votes:', error);
    res.render('admin/table-pages/votes', {
      title: 'Votes Management',
      currentPage: 'votes',
      currentSection: 'main',
      isTablePage: true,
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};