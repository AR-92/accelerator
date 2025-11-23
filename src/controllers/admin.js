import logger from '../utils/logger.js';
import databaseService from '../services/supabase.js';
import Todo from '../models/Todo.js';

// Admin Dashboard
export const getDashboard = (req, res) => {
  logger.info('Admin dashboard accessed');
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    currentPage: 'dashboard',
    currentSection: 'main'
  });
};

// Users Management
export const getUsers = async (req, res) => {
  try {
    logger.info('Admin users page accessed');

    // Fetch real data from Supabase Accounts table
    const { data: users, error } = await databaseService.supabase
      .from('Accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }

    // Map the data to match the expected format
    const mappedUsers = users.map(user => ({
      id: user.id,
      name: user.display_name || user.username || `User ${user.id}`,
      email: user.username ? `${user.username}@example.com` : `user${user.id}@example.com`, // Placeholder since email not in Accounts
      status: user.is_verified ? 'active' : 'pending',
      role: user.account_type === 'business' ? 'Business' : 'User',
      created_at: user.created_at,
      last_login: user.last_login_at
    }));

    const columns = [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'role', label: 'Role', type: 'text', hidden: true, responsive: 'md:table-cell' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' },
      { key: 'last_login', label: 'Last Login', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/users',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'editUser',
        label: 'Edit User',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>'
      },
      {
        type: 'button',
        onclick: 'toggleUserStatus',
        label: 'Deactivate',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-user-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16,11 18,13 22,9"></polyline></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteUser',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkActivate', buttonId: 'bulkActivateBtn', label: 'Activate' },
      { onclick: 'bulkDeactivate', buttonId: 'bulkDeactivateBtn', label: 'Deactivate' },
      { onclick: 'bulkDeleteUsers', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: mappedUsers.length,
      start: 1,
      end: mappedUsers.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/users', {
      title: 'Users Management',
      currentPage: 'users',
      currentSection: 'main',
      tableId: 'users',
      entityName: 'user',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: mappedUsers,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/users',
      colspan
    });
  } catch (error) {
    logger.error('Error loading users:', error);
    res.render('admin/users', {
      title: 'Users Management',
      currentPage: 'users',
      currentSection: 'main',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};

// Ideas Management
export const getIdeas = async (req, res) => {
  try {
    logger.info('Admin ideas page accessed');

    // Fetch real data from Supabase ideas table
    const { data: ideas, error } = await databaseService.supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching ideas:', error);
      throw error;
    }

    const columns = [
      { key: 'title', label: 'Title', type: 'title', descriptionKey: 'description' },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'votes', label: 'Votes', type: 'text', hidden: true, responsive: 'md:table-cell' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/ideas',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'approveIdea',
        label: 'Approve',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"></polyline></svg>'
      },
      {
        type: 'button',
        onclick: 'rejectIdea',
        label: 'Reject',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-x" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteIdea',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkApproveIdeas', buttonId: 'bulkApproveBtn', label: 'Approve Selected' },
      { onclick: 'bulkRejectIdeas', buttonId: 'bulkRejectBtn', label: 'Reject Selected' },
      { onclick: 'bulkDeleteIdeas', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: ideas.length,
      start: 1,
      end: ideas.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/ideas', {
      title: 'Ideas Management',
      currentPage: 'ideas',
      currentSection: 'main',
      tableId: 'ideas',
      entityName: 'idea',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: ideas,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/ideas',
      colspan
    });
  } catch (error) {
    logger.error('Error loading ideas:', error);
    res.render('admin/ideas', {
      title: 'Ideas Management',
      currentPage: 'ideas',
      currentSection: 'main',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};

// Votes Management
export const getVotes = async (req, res) => {
  try {
    logger.info('Admin votes page accessed');

    // Fetch vote data from ideas and portfolios tables
    const { data: ideas, error: ideasError } = await databaseService.supabase
      .from('ideas')
      .select('id, title, upvotes, downvotes, created_at')
      .order('created_at', { ascending: false });

    const { data: portfolios, error: portfoliosError } = await databaseService.supabase
      .from('portfolios')
      .select('id, title, votes, upvotes, downvotes, created_at')
      .order('created_at', { ascending: false });

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
            created_at: portfolio.created_at
          });
        }
        if (portfolio.downvotes > 0) {
          votes.push({
            id: `portfolio-${portfolio.id}-down`,
            entity_type: 'portfolio',
            entity_title: portfolio.title,
            vote_type: 'downvote',
            vote_count: portfolio.downvotes,
            created_at: portfolio.created_at
          });
        }
      });
    }

    // Sort by creation date
    votes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

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
        url: '/admin/votes',
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
      total: votes.length,
      start: 1,
      end: votes.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/votes', {
      title: 'Votes Management',
      currentPage: 'votes',
      currentSection: 'main',
      tableId: 'votes',
      entityName: 'vote',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: votes,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/votes',
      colspan
    });
  } catch (error) {
    logger.error('Error loading votes:', error);
    res.render('admin/votes', {
      title: 'Votes Management',
      currentPage: 'votes',
      currentSection: 'main',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};

// Collaborations Management
export const getCollaborations = async (req, res) => {
  try {
    logger.info('Admin collaborations page accessed');

    // Fetch real data from Supabase collaborations table
    const { data: collaborations, error } = await databaseService.supabase
      .from('collaborations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching collaborations:', error);
      throw error;
    }

    const columns = [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'members_count', label: 'Members', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/collaborations',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'editCollaboration',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>'
      },
      {
        type: 'button',
        onclick: 'archiveCollaboration',
        label: 'Archive',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-archive" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21,8 21,21 3,21 3,8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteCollaboration',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkArchiveCollaborations', buttonId: 'bulkArchiveBtn', label: 'Archive Selected' },
      { onclick: 'bulkDeleteCollaborations', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: collaborations.length,
      start: 1,
      end: collaborations.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/collaborations', {
      title: 'Collaborations Management',
      currentPage: 'collaborations',
      currentSection: 'main',
      tableId: 'collaborations',
      entityName: 'collaboration',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: collaborations,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/collaborations',
      colspan
    });
  } catch (error) {
    logger.error('Error loading collaborations:', error);
    res.render('admin/collaborations', {
      title: 'Collaborations Management',
      currentPage: 'collaborations',
      currentSection: 'main',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};

// Content Management
export const getContent = async (req, res) => {
  try {
    logger.info('Admin content page accessed');

    // Fetch real data from Supabase learning_content table
    const { data: content, error } = await databaseService.supabase
      .from('learning_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching content:', error);
      throw error;
    }

    // Map to expected format
    const mappedContent = content.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      type: item.content_type,
      status: item.status,
      created_at: item.created_at
    }));

    const contentColumns = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/content',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'editContent',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteContent',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkArchiveContent', buttonId: 'bulkArchiveBtn', label: 'Archive Selected' },
      { onclick: 'bulkDeleteContent', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: mappedContent.length,
      start: 1,
      end: mappedContent.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = contentColumns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/content', {
      title: 'Content Management',
      currentPage: 'content',
      currentSection: 'content-management',
      tableId: 'content',
      entityName: 'content',
      showCheckbox: true,
      showBulkActions: true,
      columns: contentColumns,
      data: mappedContent,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/content',
      colspan
    });
  } catch (error) {
    logger.error('Error loading content:', error);
    res.render('admin/content', {
      title: 'Content Management',
      currentPage: 'content',
      currentSection: 'content-management',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};

// Landing Page Management
export const getLandingPage = async (req, res) => {
  try {
    logger.info('Admin landing page accessed');

    // Fetch real data from Supabase landing_pages table
    const { data: sections, error } = await databaseService.supabase
      .from('landing_pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching landing pages:', error);
      throw error;
    }

    // Map to expected format
    const mappedSections = sections.map(section => ({
      id: section.id,
      name: section.title || section.name || `Section ${section.id}`,
      status: section.status || 'active',
      last_updated: section.updated_at || section.created_at
    }));

    const columns = [
      { key: 'name', label: 'Section Name', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'last_updated', label: 'Last Updated', type: 'date' }
    ];

    const actions = [
      { type: 'button', onclick: 'editSection', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'button', onclick: 'toggleSection', label: 'Toggle', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-power" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: mappedSections.length, start: 1, end: mappedSections.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (false ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/landing-page', {
      title: 'Landing Page Management', currentPage: 'landing-page', currentSection: 'content-management', tableId: 'landing-page', entityName: 'section', showCheckbox: false, showBulkActions: false, columns, data: mappedSections, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/landing-page', colspan
    });
  } catch (error) {
    logger.error('Error loading landing page:', error);
    res.render('admin/landing-page', { title: 'Landing Page Management', currentPage: 'landing-page', currentSection: 'content-management', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Packages Management
export const getPackages = async (req, res) => {
  try {
    logger.info('Admin packages page accessed');

    // Fetch packages from packages table
    const { data: packagesData, error: packagesError } = await databaseService.supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (packagesError) {
      logger.error('Error fetching packages:', packagesError);
      throw packagesError;
    }

    // Fetch billing data to compute statistics
    const { data: billingData, error: billingError } = await databaseService.supabase
      .from('Billing')
      .select('plan_name, amount_cents, currency, status');

    if (billingError) {
      logger.error('Error fetching billing data:', billingError);
      // Continue without billing stats if error
    }

    // Group billing data by plan_name
    const billingStats = {};
    if (billingData) {
      billingData.forEach(record => {
        const planName = record.plan_name;
        if (planName) {
          if (!billingStats[planName]) {
            billingStats[planName] = {
              subscribers: 0,
              total_revenue: 0,
              active_subscriptions: 0,
              currency: record.currency || 'USD'
            };
          }
          billingStats[planName].subscribers += 1;
          billingStats[planName].total_revenue += record.amount_cents || 0;
          if (record.status === 'paid' || record.status === 'active') {
            billingStats[planName].active_subscriptions += 1;
          }
        }
      });
    }

    // Helper function to truncate text
    const truncateText = (text, maxLength) => {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // Merge packages with billing stats
    const packages = packagesData.map(pkg => {
      const stats = billingStats[pkg.name] || { subscribers: 0, total_revenue: 0, active_subscriptions: 0, currency: 'USD' };
      return {
        id: pkg.id,
        name: pkg.name,
        description: truncateText(pkg.description, 50),
        price: `$${(pkg.price_cents / 100).toFixed(2)}`,
        status: pkg.status,
        subscribers: stats.subscribers,
        active_subscribers: stats.active_subscriptions,
        total_revenue: `$${(stats.total_revenue / 100).toFixed(2)}`,
        features: truncateText(Array.isArray(pkg.features) ? pkg.features.join(', ') : JSON.stringify(pkg.features), 80),
        created_at: pkg.created_at
      };
    });

    const columns = [
      { key: 'name', label: 'Package Name', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'subscribers', label: 'Total Subscribers', type: 'text' },
      { key: 'active_subscribers', label: 'Active Subscribers', type: 'text' },
      { key: 'total_revenue', label: 'Total Revenue', type: 'text' },
      { key: 'features', label: 'Features', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'button', onclick: 'editPackage', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'button', onclick: 'togglePackage', label: 'Toggle Status', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-power" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>' },
      { type: 'delete', onclick: 'deletePackage', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const bulkActions = [
      { onclick: 'bulkActivatePackages', buttonId: 'bulkActivateBtn', label: 'Activate Selected' },
      { onclick: 'bulkDeactivatePackages', buttonId: 'bulkDeactivateBtn', label: 'Deactivate Selected' },
      { onclick: 'bulkDeletePackages', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: packages.length, start: 1, end: packages.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/packages', {
      title: 'Packages Management', currentPage: 'packages', currentSection: 'financial', tableId: 'packages', entityName: 'package', showCheckbox: true, showBulkActions: true, columns, data: packages, actions, bulkActions, pagination, query: { search: '', status: '' }, currentUrl: '/admin/packages', colspan
    });
  } catch (error) {
    logger.error('Error loading packages:', error);
    res.render('admin/packages', { title: 'Packages Management', currentPage: 'packages', currentSection: 'financial', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Billing Management
export const getBilling = async (req, res) => {
  try {
    logger.info('Admin billing page accessed');

    // Fetch real data from Supabase billing table
    const { data: transactions, error } = await databaseService.supabase
      .from('Billing')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching billing:', error);
      throw error;
    }

    // Map to expected format
    const mappedTransactions = transactions.map(tx => ({
      id: tx.id,
      user: tx.user_id ? `User ${tx.user_id}` : 'Unknown', // Could join with Accounts table for name
      amount: `$${(tx.amount_cents / 100).toFixed(2)}`,
      status: tx.status,
      date: tx.created_at,
      package: tx.plan_name || 'N/A'
    }));

    const columns = [
      { key: 'user', label: 'User', type: 'text' },
      { key: 'package', label: 'Package', type: 'text' },
      { key: 'amount', label: 'Amount', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'date', label: 'Date', type: 'date' }
    ];

    const actions = [
      { type: 'link', url: '/admin/billing', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'refundTransaction', label: 'Refund', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-undo-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>' }
    ];

    const bulkActions = [
      { onclick: 'bulkRefundTransactions', buttonId: 'bulkRefundBtn', label: 'Refund Selected' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: mappedTransactions.length, start: 1, end: mappedTransactions.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/billing', {
      title: 'Billing Management', currentPage: 'billing', currentSection: 'financial', tableId: 'billing', entityName: 'transaction', showCheckbox: true, showBulkActions: true, columns, data: mappedTransactions, actions, bulkActions, pagination, query: { search: '', status: '' }, currentUrl: '/admin/billing', colspan
    });
  } catch (error) {
    logger.error('Error loading billing:', error);
    res.render('admin/billing', { title: 'Billing Management', currentPage: 'billing', currentSection: 'financial', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Rewards Management
export const getRewards = async (req, res) => {
  try {
    logger.info('Admin rewards page accessed');

    // Fetch real data from Supabase rewards table
    const { data: rewards, error } = await databaseService.supabase
      .from('rewards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching rewards:', error);
      throw error;
    }

    const columns = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'button', onclick: 'editReward', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'button', onclick: 'toggleReward', label: 'Toggle Status', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-power" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>' },
      { type: 'delete', onclick: 'deleteReward', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const bulkActions = [
      { onclick: 'bulkActivateRewards', buttonId: 'bulkActivateBtn', label: 'Activate Selected' },
      { onclick: 'bulkDeactivateRewards', buttonId: 'bulkDeactivateBtn', label: 'Deactivate Selected' },
      { onclick: 'bulkDeleteRewards', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: rewards.length, start: 1, end: rewards.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/rewards', {
      title: 'Rewards Management', currentPage: 'rewards', currentSection: 'financial', tableId: 'rewards', entityName: 'reward', showCheckbox: true, showBulkActions: true, columns, data: rewards, actions, bulkActions, pagination, query: { search: '', status: '' }, currentUrl: '/admin/rewards', colspan
    });
  } catch (error) {
    logger.error('Error loading rewards:', error);
    res.render('admin/rewards', { title: 'Rewards Management', currentPage: 'rewards', currentSection: 'financial', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Profile
export const getProfile = async (req, res) => {
  try {
    logger.info('Admin profile page accessed');

    // In a real application, this would come from the authenticated user's session/database
    const profile = {
      name: 'Administrator',
      email: 'admin@accelerator.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      memberSince: 'January 2024',
      role: 'System Administrator',
      status: 'active',
      twoFactorEnabled: true,
      loginNotifications: true,
      lastPasswordChange: '30 days ago',
      language: 'en',
      timezone: 'UTC',
      emailNotifications: true,
      dashboardAnalytics: true,
      stats: {
        totalActions: 1247,
        thisMonth: 89,
        usersManaged: 156,
        healthChecks: 42,
        settingsUpdated: 23,
        reportsGenerated: 18
      }
    };

    res.render('admin/profile', {
      title: 'Profile',
      currentPage: 'profile',
      currentSection: 'main',
      profile
    });
  } catch (error) {
    logger.error('Error loading profile:', error);
    res.render('admin/profile', {
      title: 'Profile',
      currentPage: 'profile',
      currentSection: 'main',
      profile: {}
    });
  }
};

// Profile Settings
export const getProfileSettings = async (req, res) => {
  try {
    logger.info('Admin profile settings page accessed');

    // In a real application, this would come from the authenticated user's settings
    const profileSettings = {
      account: {
        displayName: 'Administrator',
        email: 'admin@accelerator.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        bio: 'System administrator with expertise in project management and team coordination.'
      },
      privacy: {
        profileVisibility: true,
        activityStatus: true,
        dataAnalytics: false
      },
      notifications: {
        emailNotifications: true,
        systemAlerts: true,
        userActivity: true,
        marketingUpdates: false,
        frequency: 'immediate'
      },
      appearance: {
        theme: 'light',
        language: 'en',
        dateFormat: 'mdy'
      }
    };

    res.render('admin/profile-settings', {
      title: 'Profile Settings',
      currentPage: 'profile-settings',
      currentSection: 'main',
      profileSettings
    });
  } catch (error) {
    logger.error('Error loading profile settings:', error);
    res.render('admin/profile-settings', {
      title: 'Profile Settings',
      currentPage: 'profile-settings',
      currentSection: 'main',
      profileSettings: {}
    });
  }
};

// Admin Settings
export const getSettings = async (req, res) => {
  try {
    logger.info('Admin settings page accessed');

    // In a real application, these would be loaded from a configuration file or database
    const settings = {
      general: {
        siteName: process.env.SITE_NAME || 'Accelerator',
        siteDescription: process.env.SITE_DESCRIPTION || 'Project Management Platform',
        defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
        timezone: process.env.TIMEZONE || 'UTC'
      },
      security: {
        twoFactorAuth: process.env.TWO_FACTOR_AUTH === 'true',
        sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 60,
        passwordPolicy: process.env.PASSWORD_POLICY !== 'false',
        minPasswordLength: parseInt(process.env.MIN_PASSWORD_LENGTH) || 8
      },
      email: {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT) || 587,
        smtpUsername: process.env.SMTP_USERNAME || 'noreply@accelerator.com',
        smtpPassword: '••••••••', // Never expose actual password
        emailNotifications: process.env.EMAIL_NOTIFICATIONS !== 'false'
      },
      database: {
        connectionPoolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
        queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 30,
        databaseLogging: process.env.DB_LOGGING === 'true',
        autoBackup: process.env.DB_AUTO_BACKUP !== 'false'
      }
    };

    res.render('admin/settings', {
      title: 'Admin Settings',
      currentPage: 'settings',
      currentSection: 'system',
      settings
    });
  } catch (error) {
    logger.error('Error loading admin settings:', error);
    res.render('admin/settings', {
      title: 'Admin Settings',
      currentPage: 'settings',
      currentSection: 'system',
      settings: {}
    });
  }
};

// System Health
export const getSystemHealth = async (req, res) => {
  try {
    logger.info('Admin system health page accessed');

    // Get system metrics
    const os = await import('os');
    const process = await import('process');

    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = Math.round((usedMemory / totalMemory) * 100);

    const uptime = os.uptime();
    const uptimeDays = Math.floor(uptime / 86400);
    const uptimeHours = Math.floor((uptime % 86400) / 3600);
    const uptimeString = `${uptimeDays}d ${uptimeHours}h`;

    // Database connection test
    const dbConnected = await databaseService.testConnection();

    // Get database metrics
    let dbMetrics = {
      totalTables: 0,
      totalRecords: 0,
      activeConnections: 0
    };

    if (dbConnected) {
      try {
        const tables = await databaseService.getAllTables();
        dbMetrics.totalTables = tables.length;

        // Get record counts for major tables
        const tableCounts = await Promise.all(tables.slice(0, 10).map(async (tableName) => {
          try {
            const { count } = await databaseService.supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });
            return count || 0;
          } catch (error) {
            return 0;
          }
        }));

        dbMetrics.totalRecords = tableCounts.reduce((sum, count) => sum + count, 0);
      } catch (error) {
        logger.warn('Error getting database metrics:', error.message);
      }
    }

    // Mock additional metrics (in a real app, you'd collect these from monitoring tools)
    const systemMetrics = {
      dbConnected,
      memoryUsagePercent,
      uptimeString,
      cpuUsage: Math.floor(Math.random() * 30) + 40, // Mock CPU usage
      diskUsage: Math.floor(Math.random() * 20) + 25, // Mock disk usage
      ...dbMetrics,
      queriesPerMin: Math.floor(Math.random() * 50) + 10,
      responseTime: Math.floor(Math.random() * 50) + 20,
      activeConnections: Math.floor(Math.random() * 10) + 1
    };

    res.render('admin/system-health', {
      title: 'System Health',
      currentPage: 'system-health',
      currentSection: 'system',
      systemMetrics
    });
  } catch (error) {
    logger.error('Error loading system health:', error);
    res.render('admin/system-health', {
      title: 'System Health',
      currentPage: 'system-health',
      currentSection: 'system',
      systemMetrics: {
        dbConnected: false,
        memoryUsagePercent: 0,
        uptimeString: '0d 0h',
        cpuUsage: 0,
        diskUsage: 0,
        totalTables: 0,
        totalRecords: 0,
        queriesPerMin: 0,
        responseTime: 0,
        activeConnections: 0
      }
    });
  }
};

// Notifications
export const getNotifications = async (req, res) => {
  try {
    logger.info('Admin notifications page accessed');

    // Fetch real data from Supabase notifications table
    const { data: notifications, error } = await databaseService.supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching notifications:', error);
      throw error;
    }

    // Map to expected format
    const mappedNotifications = notifications.map(notification => ({
      id: notification.id,
      user_id: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      is_read: notification.is_read,
      priority: notification.priority,
      created_at: notification.created_at
    }));

    const columns = [
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'message', label: 'Message', type: 'text' },
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'is_read', label: 'Read', type: 'status' },
      { key: 'priority', label: 'Priority', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/notifications',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'markAsRead',
        label: 'Mark as Read',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"></polyline></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkMarkAsRead', buttonId: 'bulkReadBtn', label: 'Mark as Read' },
      { onclick: 'bulkDeleteNotifications', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: mappedNotifications.length,
      start: 1,
      end: mappedNotifications.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    // Calculate notification stats
    const notificationStats = {
      total: mappedNotifications.length,
      unread: mappedNotifications.filter(n => !n.is_read).length,
      thisWeek: mappedNotifications.filter(n => {
        const notificationDate = new Date(n.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return notificationDate >= weekAgo;
      }).length,
      systemAlerts: mappedNotifications.filter(n => n.type === 'system' && n.priority === 'high').length
    };

    res.render('admin/notifications', {
      title: 'Notifications',
      currentPage: 'notifications',
      currentSection: 'system',
      tableId: 'notifications',
      entityName: 'notification',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: mappedNotifications,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/notifications',
      colspan,
      notifications: mappedNotifications,
      notificationStats
    });
  } catch (error) {
    logger.error('Error loading notifications:', error);
    res.render('admin/notifications', {
      title: 'Notifications',
      currentPage: 'notifications',
      currentSection: 'system',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};

// Database Tables Overview
export const getTables = async (req, res) => {
  try {
    logger.info('Admin tables page accessed');

    const isConnected = await databaseService.testConnection();
    let tables = [];

    if (isConnected) {
      tables = await databaseService.getAllTables();
    }

    const columns = [
      { key: 'name', label: 'Table Name', type: 'text' },
      { key: 'records', label: 'Records', type: 'text' },
      { key: 'size', label: 'Size', type: 'text' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/tables',
        label: 'View Records',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      }
    ];

    // Get record counts for each table
    const tableData = await Promise.all(tables.map(async (tableName) => {
      try {
        const { count, error } = await databaseService.supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          logger.warn(`Could not get count for table ${tableName}:`, error.message);
          return { name: tableName, records: 'N/A', size: 'N/A' };
        }

        return { name: tableName, records: count || 0, size: 'N/A' }; // Size calculation would need additional query
      } catch (error) {
        logger.warn(`Error getting data for table ${tableName}:`, error.message);
        return { name: tableName, records: 'Error', size: 'Error' };
      }
    }));

    const pagination = {
      currentPage: 1,
      limit: 50,
      total: tableData.length,
      start: 1,
      end: tableData.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + 1; // checkbox not shown

    res.render('admin/tables', {
      title: 'Database Tables',
      currentPage: 'tables',
      currentSection: 'system',
      tableId: 'tables',
      entityName: 'table',
      showCheckbox: false,
      showBulkActions: false,
      columns,
      data: tableData,
      actions,
      bulkActions: [],
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/tables',
      colspan,
      supabaseConnected: isConnected
    });
  } catch (error) {
    logger.error('Error loading tables:', error);
    res.render('admin/tables', {
      title: 'Database Tables',
      currentPage: 'tables',
      currentSection: 'system',
      data: [],
      pagination: { currentPage: 1, limit: 50, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' },
      supabaseConnected: false,
      error: error.message
    });
  }
};

// Todos Management
export const getTodos = async (req, res) => {
  try {
    logger.info('Admin todos page accessed');

    const isConnected = await databaseService.testConnection();
    let todos = [];

    if (isConnected) {
      todos = await Todo.findAll();
    }

    const columns = [
      { key: 'title', label: 'Title', type: 'title', descriptionKey: 'description' },
      { key: 'completed', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' },
      { key: 'updated_at', label: 'Updated', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/todos',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'editTodo',
        label: 'Edit Todo',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>'
      },
      {
        type: 'button',
        onclick: 'toggleStatus',
        label: 'Mark Complete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-circle-check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteTodo',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkMarkComplete', buttonId: 'bulkCompleteBtn', label: 'Mark Complete' },
      { onclick: 'bulkMarkPending', buttonId: 'bulkPendingBtn', label: 'Mark Pending' },
      { onclick: 'bulkDelete', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: todos.length,
      start: 1,
      end: todos.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + 1 + 1; // checkbox + actions

    res.render('admin/todos', {
      title: 'Todos Management',
      currentPage: 'todos',
      currentSection: 'system',
      tableId: 'todos',
      entityName: 'todo',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: todos,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/todos',
      colspan,
      supabaseConnected: isConnected
    });
  } catch (error) {
    logger.error('Error loading todos:', error);
    res.render('admin/todos', {
      title: 'Todos Management',
      currentPage: 'todos',
      currentSection: 'system',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' },
      supabaseConnected: false,
      error: error.message
    });
  }
};

// Activity Log
export const getActivity = async (req, res) => {
  try {
    logger.info('Admin activity page accessed');

    // Fetch real data from Supabase activity_logs table
    const { data: activities, error } = await databaseService.supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Limit to recent 100 activities

    if (error) {
      logger.error('Error fetching activity logs:', error);
      throw error;
    }

    // Map to expected format
    const mappedActivities = activities.map(activity => ({
      id: activity.id,
      user_id: activity.user_id,
      activity_type: activity.activity_type,
      action: activity.action,
      entity_type: activity.entity_type,
      description: activity.description,
      ip_address: activity.ip_address,
      browser: activity.browser,
      os: activity.os,
      status: activity.status,
      created_at: activity.created_at
    }));

    const columns = [
      { key: 'activity_type', label: 'Type', type: 'text' },
      { key: 'action', label: 'Action', type: 'text' },
      { key: 'description', label: 'Description', type: 'text' },
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'ip_address', label: 'IP Address', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/activity',
        label: 'View Details',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      }
    ];

    const bulkActions = [];

    const pagination = {
      currentPage: 1,
      limit: 100,
      total: mappedActivities.length,
      start: 1,
      end: mappedActivities.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    // Calculate activity stats
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const activityStats = {
      total: mappedActivities.length,
      today: mappedActivities.filter(a => new Date(a.created_at) >= today).length,
      thisWeek: mappedActivities.filter(a => new Date(a.created_at) >= weekAgo).length,
      failed: mappedActivities.filter(a => a.status === 'failed').length
    };

    res.render('admin/activity', {
      title: 'Activity Log',
      currentPage: 'activity',
      currentSection: 'system',
      tableId: 'activity',
      entityName: 'activity',
      showCheckbox: false,
      showBulkActions: false,
      columns,
      data: mappedActivities,
      actions,
      bulkActions,
      pagination,
      query: { search: '', status: '' },
      currentUrl: '/admin/activity',
      colspan,
      activities: mappedActivities,
      activityStats
    });
  } catch (error) {
    logger.error('Error loading activity logs:', error);
    res.render('admin/activity', {
      title: 'Activity Log',
      currentPage: 'activity',
      currentSection: 'system',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};

// Logout
export const postLogout = (req, res) => {
  logger.info('Admin logout');
  // For now, just redirect to home
  res.redirect('/');
};

// Business Model Management
export const getBusinessModel = async (req, res) => {
  try {
    logger.info('Admin business model page accessed');

    const { data: businessModels, error } = await databaseService.supabase
      .from('business_model')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching business models:', error);
      throw error;
    }

    const columns = [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'business_type', label: 'Type', type: 'text' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/business-model', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editBusinessModel', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteBusinessModel', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: businessModels.length, start: 1, end: businessModels.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/business-model', {
      title: 'Business Model Management', currentPage: 'business-model', currentSection: 'business', tableId: 'business-model', entityName: 'business model', showCheckbox: true, showBulkActions: true, columns, data: businessModels, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/business-model', colspan
    });
  } catch (error) {
    logger.error('Error loading business models:', error);
    res.render('admin/business-model', { title: 'Business Model Management', currentPage: 'business-model', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Business Plan Management
export const getBusinessPlan = async (req, res) => {
  try {
    logger.info('Admin business plan page accessed');

    const { data: businessPlans, error } = await databaseService.supabase
      .from('business_plan')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching business plans:', error);
      throw error;
    }

    const columns = [
      { key: 'company_name', label: 'Company', type: 'text' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'current_stage', label: 'Stage', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/business-plan', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editBusinessPlan', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteBusinessPlan', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: businessPlans.length, start: 1, end: businessPlans.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/business-plan', {
      title: 'Business Plan Management', currentPage: 'business-plan', currentSection: 'business', tableId: 'business-plan', entityName: 'business plan', showCheckbox: true, showBulkActions: true, columns, data: businessPlans, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/business-plan', colspan
    });
  } catch (error) {
    logger.error('Error loading business plans:', error);
    res.render('admin/business-plan', { title: 'Business Plan Management', currentPage: 'business-plan', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Financial Model Management
export const getFinancialModel = async (req, res) => {
  try {
    logger.info('Admin financial model page accessed');

    const { data: financialModels, error } = await databaseService.supabase
      .from('financial_model')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching financial models:', error);
      throw error;
    }

    const columns = [
      { key: 'model_name', label: 'Model Name', type: 'text' },
      { key: 'model_status', label: 'Status', type: 'status' },
      { key: 'progress_percentage', label: 'Progress', type: 'text' },
      { key: 'monthly_revenue', label: 'Revenue', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/financial-model', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editFinancialModel', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteFinancialModel', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: financialModels.length, start: 1, end: financialModels.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/financial-model', {
      title: 'Financial Model Management', currentPage: 'financial-model', currentSection: 'business', tableId: 'financial-model', entityName: 'financial model', showCheckbox: true, showBulkActions: true, columns, data: financialModels, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/financial-model', colspan
    });
  } catch (error) {
    logger.error('Error loading financial models:', error);
    res.render('admin/financial-model', { title: 'Financial Model Management', currentPage: 'financial-model', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// PitchDeck Management
export const getPitchDeck = async (req, res) => {
  try {
    logger.info('Admin pitchdeck page accessed');

    const { data: pitchdecks, error } = await databaseService.supabase
      .from('pitchdeck')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching pitchdecks:', error);
      throw error;
    }

    const columns = [
      { key: 'title_slide', label: 'Title', type: 'text' },
      { key: 'problem_statement', label: 'Problem', type: 'text' },
      { key: 'solution_overview', label: 'Solution', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/pitchdeck', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editPitchDeck', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deletePitchDeck', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: pitchdecks.length, start: 1, end: pitchdecks.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/pitchdeck', {
      title: 'PitchDeck Management', currentPage: 'pitchdeck', currentSection: 'business', tableId: 'pitchdeck', entityName: 'pitchdeck', showCheckbox: true, showBulkActions: true, columns, data: pitchdecks, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/pitchdeck', colspan
    });
  } catch (error) {
    logger.error('Error loading pitchdecks:', error);
    res.render('admin/pitchdeck', { title: 'PitchDeck Management', currentPage: 'pitchdeck', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Valuation Management
export const getValuation = async (req, res) => {
  try {
    logger.info('Admin valuation page accessed');

    const { data: valuations, error } = await databaseService.supabase
      .from('valuation')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching valuations:', error);
      throw error;
    }

    const columns = [
      { key: 'valuation_date', label: 'Date', type: 'date' },
      { key: 'valuation_method', label: 'Method', type: 'text' },
      { key: 'enterprise_value', label: 'Enterprise Value', type: 'text' },
      { key: 'equity_value', label: 'Equity Value', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/valuation', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editValuation', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteValuation', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: valuations.length, start: 1, end: valuations.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/valuation', {
      title: 'Valuation Management', currentPage: 'valuation', currentSection: 'business', tableId: 'valuation', entityName: 'valuation', showCheckbox: true, showBulkActions: true, columns, data: valuations, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/valuation', colspan
    });
  } catch (error) {
    logger.error('Error loading valuations:', error);
    res.render('admin/valuation', { title: 'Valuation Management', currentPage: 'valuation', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Funding Management
export const getFunding = async (req, res) => {
  try {
    logger.info('Admin funding page accessed');

    const { data: fundings, error } = await databaseService.supabase
      .from('funding')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching fundings:', error);
      throw error;
    }

    const columns = [
      { key: 'total_funding_required', label: 'Funding Required', type: 'text' },
      { key: 'funding_type', label: 'Type', type: 'text' },
      { key: 'funding_stage', label: 'Stage', type: 'text' },
      { key: 'burn_rate', label: 'Burn Rate', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/funding', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editFunding', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteFunding', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: fundings.length, start: 1, end: fundings.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/funding', {
      title: 'Funding Management', currentPage: 'funding', currentSection: 'business', tableId: 'funding', entityName: 'funding', showCheckbox: true, showBulkActions: true, columns, data: fundings, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/funding', colspan
    });
  } catch (error) {
    logger.error('Error loading fundings:', error);
    res.render('admin/funding', { title: 'Funding Management', currentPage: 'funding', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Team Management
export const getTeam = async (req, res) => {
  try {
    logger.info('Admin team page accessed');

    const { data: teams, error } = await databaseService.supabase
      .from('team')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching teams:', error);
      throw error;
    }

    const columns = [
      { key: 'founders_count', label: 'Founders', type: 'text' },
      { key: 'employees_count', label: 'Employees', type: 'text' },
      { key: 'work_mode', label: 'Work Mode', type: 'text' },
      { key: 'readiness_score', label: 'Readiness', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/team', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editTeam', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteTeam', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: teams.length, start: 1, end: teams.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/team', {
      title: 'Team Management', currentPage: 'team', currentSection: 'business', tableId: 'team', entityName: 'team', showCheckbox: true, showBulkActions: true, columns, data: teams, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/team', colspan
    });
  } catch (error) {
    logger.error('Error loading teams:', error);
    res.render('admin/team', { title: 'Team Management', currentPage: 'team', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Legal Management
export const getLegal = async (req, res) => {
  try {
    logger.info('Admin legal page accessed');

    const { data: legals, error } = await databaseService.supabase
      .from('legal')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching legals:', error);
      throw error;
    }

    const columns = [
      { key: 'company_name', label: 'Company', type: 'text' },
      { key: 'company_type', label: 'Type', type: 'text' },
      { key: 'incorporation_date', label: 'Incorporation', type: 'date' },
      { key: 'compliance_status', label: 'Compliance', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/legal', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editLegal', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteLegal', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: legals.length, start: 1, end: legals.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/legal', {
      title: 'Legal Management', currentPage: 'legal', currentSection: 'business', tableId: 'legal', entityName: 'legal', showCheckbox: true, showBulkActions: true, columns, data: legals, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/legal', colspan
    });
  } catch (error) {
    logger.error('Error loading legals:', error);
    res.render('admin/legal', { title: 'Legal Management', currentPage: 'legal', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Marketing Management
export const getMarketing = async (req, res) => {
  try {
    logger.info('Admin marketing page accessed');

    const { data: marketings, error } = await databaseService.supabase
      .from('marketing')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching marketings:', error);
      throw error;
    }

    const columns = [
      { key: 'unique_value_proposition', label: 'UVP', type: 'text' },
      { key: 'marketing_channels', label: 'Channels', type: 'text' },
      { key: 'marketing_budget', label: 'Budget', type: 'text' },
      { key: 'target_audience', label: 'Audience', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/marketing', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editMarketing', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteMarketing', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: marketings.length, start: 1, end: marketings.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/marketing', {
      title: 'Marketing Management', currentPage: 'marketing', currentSection: 'business', tableId: 'marketing', entityName: 'marketing', showCheckbox: true, showBulkActions: true, columns, data: marketings, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/marketing', colspan
    });
  } catch (error) {
    logger.error('Error loading marketings:', error);
    res.render('admin/marketing', { title: 'Marketing Management', currentPage: 'marketing', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Corporate Management
export const getCorporate = async (req, res) => {
  try {
    logger.info('Admin corporate page accessed');

    const { data: corporates, error } = await databaseService.supabase
      .from('corporates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching corporates:', error);
      throw error;
    }

    const columns = [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'company_size', label: 'Size', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/corporate', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editCorporate', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteCorporate', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: corporates.length, start: 1, end: corporates.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/corporate', {
      title: 'Corporate Management', currentPage: 'corporate', currentSection: 'business', tableId: 'corporate', entityName: 'corporate', showCheckbox: true, showBulkActions: true, columns, data: corporates, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/corporate', colspan
    });
  } catch (error) {
    logger.error('Error loading corporates:', error);
    res.render('admin/corporate', { title: 'Corporate Management', currentPage: 'corporate', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Enterprises Management
export const getEnterprises = async (req, res) => {
  try {
    logger.info('Admin enterprises page accessed');

    const { data: enterprises, error } = await databaseService.supabase
      .from('enterprises')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching enterprises:', error);
      throw error;
    }

    const columns = [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'industry', label: 'Industry', type: 'text' },
      { key: 'company_size', label: 'Size', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/enterprises', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editEnterprise', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteEnterprise', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: enterprises.length, start: 1, end: enterprises.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/enterprises', {
      title: 'Enterprises Management', currentPage: 'enterprises', currentSection: 'business', tableId: 'enterprises', entityName: 'enterprise', showCheckbox: true, showBulkActions: true, columns, data: enterprises, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/enterprises', colspan
    });
  } catch (error) {
    logger.error('Error loading enterprises:', error);
    res.render('admin/enterprises', { title: 'Enterprises Management', currentPage: 'enterprises', currentSection: 'business', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Learning Content Management
export const getLearningContent = async (req, res) => {
  try {
    logger.info('Admin learning content page accessed');

    const { data: learningContents, error } = await databaseService.supabase
      .from('learning_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching learning contents:', error);
      throw error;
    }

    const columns = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'content_type', label: 'Type', type: 'text' },
      { key: 'difficulty_level', label: 'Difficulty', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/learning-content', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editLearningContent', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteLearningContent', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: learningContents.length, start: 1, end: learningContents.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/learning-content', {
      title: 'Learning Content Management', currentPage: 'learning-content', currentSection: 'learning', tableId: 'learning-content', entityName: 'learning content', showCheckbox: true, showBulkActions: true, columns, data: learningContents, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/learning-content', colspan
    });
  } catch (error) {
    logger.error('Error loading learning contents:', error);
    res.render('admin/learning-content', { title: 'Learning Content Management', currentPage: 'learning-content', currentSection: 'learning', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Learning Categories Management
export const getLearningCategories = async (req, res) => {
  try {
    logger.info('Admin learning categories page accessed');

    const { data: learningCategories, error } = await databaseService.supabase
      .from('learning_categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching learning categories:', error);
      throw error;
    }

    const columns = [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'category_type', label: 'Type', type: 'text' },
      { key: 'is_featured', label: 'Featured', type: 'status' },
      { key: 'content_count', label: 'Content Count', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/learning-categories', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editLearningCategory', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteLearningCategory', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: learningCategories.length, start: 1, end: learningCategories.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/learning-categories', {
      title: 'Learning Categories Management', currentPage: 'learning-categories', currentSection: 'learning', tableId: 'learning-categories', entityName: 'learning category', showCheckbox: true, showBulkActions: true, columns, data: learningCategories, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/learning-categories', colspan
    });
  } catch (error) {
    logger.error('Error loading learning categories:', error);
    res.render('admin/learning-categories', { title: 'Learning Categories Management', currentPage: 'learning-categories', currentSection: 'learning', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Learning Assessments Management
export const getLearningAssessments = async (req, res) => {
  try {
    logger.info('Admin learning assessments page accessed');

    const { data: learningAssessments, error } = await databaseService.supabase
      .from('learning_assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching learning assessments:', error);
      throw error;
    }

    const columns = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'assessment_type', label: 'Type', type: 'text' },
      { key: 'passing_score', label: 'Passing Score', type: 'text' },
      { key: 'is_active', label: 'Active', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/learning-assessments', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editLearningAssessment', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteLearningAssessment', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: learningAssessments.length, start: 1, end: learningAssessments.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/learning-assessments', {
      title: 'Learning Assessments Management', currentPage: 'learning-assessments', currentSection: 'learning', tableId: 'learning-assessments', entityName: 'learning assessment', showCheckbox: true, showBulkActions: true, columns, data: learningAssessments, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/learning-assessments', colspan
    });
  } catch (error) {
    logger.error('Error loading learning assessments:', error);
    res.render('admin/learning-assessments', { title: 'Learning Assessments Management', currentPage: 'learning-assessments', currentSection: 'learning', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Learning Analytics Management
export const getLearningAnalytics = async (req, res) => {
  try {
    logger.info('Admin learning analytics page accessed');

    const { data: learningAnalytics, error } = await databaseService.supabase
      .from('learning_analytics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      logger.error('Error fetching learning analytics:', error);
      throw error;
    }

    const columns = [
      { key: 'event_type', label: 'Event', type: 'text' },
      { key: 'user_id', label: 'User ID', type: 'text' },
      { key: 'content_id', label: 'Content ID', type: 'text' },
      { key: 'engagement_score', label: 'Engagement', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/learning-analytics', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 100, total: learningAnalytics.length, start: 1, end: learningAnalytics.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (false ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/learning-analytics', {
      title: 'Learning Analytics Management', currentPage: 'learning-analytics', currentSection: 'learning', tableId: 'learning-analytics', entityName: 'learning analytic', showCheckbox: false, showBulkActions: false, columns, data: learningAnalytics, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/learning-analytics', colspan
    });
  } catch (error) {
    logger.error('Error loading learning analytics:', error);
    res.render('admin/learning-analytics', { title: 'Learning Analytics Management', currentPage: 'learning-analytics', currentSection: 'learning', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Messages Management
export const getMessages = async (req, res) => {
  try {
    logger.info('Admin messages page accessed');

    const { data: messages, error } = await databaseService.supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching messages:', error);
      throw error;
    }

    const columns = [
      { key: 'sender_id', label: 'Sender', type: 'text' },
      { key: 'receiver_id', label: 'Receiver', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'is_read', label: 'Read', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/messages', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'delete', onclick: 'deleteMessage', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: messages.length, start: 1, end: messages.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/messages', {
      title: 'Messages Management', currentPage: 'messages', currentSection: 'projects', tableId: 'messages', entityName: 'message', showCheckbox: true, showBulkActions: true, columns, data: messages, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/messages', colspan
    });
  } catch (error) {
    logger.error('Error loading messages:', error);
    res.render('admin/messages', { title: 'Messages Management', currentPage: 'messages', currentSection: 'projects', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Project Collaborators Management
export const getProjectCollaborators = async (req, res) => {
  try {
    logger.info('Admin project collaborators page accessed');

    const { data: projectCollaborators, error } = await databaseService.supabase
      .from('project_collaborators')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching project collaborators:', error);
      throw error;
    }

    const columns = [
      { key: 'project_id', label: 'Project ID', type: 'text' },
      { key: 'collaborator_user_id', label: 'User ID', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/project-collaborators', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editProjectCollaborator', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteProjectCollaborator', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: projectCollaborators.length, start: 1, end: projectCollaborators.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/project-collaborators', {
      title: 'Project Collaborators Management', currentPage: 'project-collaborators', currentSection: 'projects', tableId: 'project-collaborators', entityName: 'project collaborator', showCheckbox: true, showBulkActions: true, columns, data: projectCollaborators, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/project-collaborators', colspan
    });
  } catch (error) {
    logger.error('Error loading project collaborators:', error);
    res.render('admin/project-collaborators', { title: 'Project Collaborators Management', currentPage: 'project-collaborators', currentSection: 'projects', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Calendar Management
export const getCalendar = async (req, res) => {
  try {
    logger.info('Admin calendar page accessed');

    const { data: calendars, error } = await databaseService.supabase
      .from('calendar')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching calendars:', error);
      throw error;
    }

    const columns = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'event_type', label: 'Type', type: 'text' },
      { key: 'start_time', label: 'Start Time', type: 'date' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/calendar', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editCalendar', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteCalendar', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: calendars.length, start: 1, end: calendars.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/calendar', {
      title: 'Calendar Management', currentPage: 'calendar', currentSection: 'projects', tableId: 'calendar', entityName: 'calendar', showCheckbox: true, showBulkActions: true, columns, data: calendars, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/calendar', colspan
    });
  } catch (error) {
    logger.error('Error loading calendars:', error);
    res.render('admin/calendar', { title: 'Calendar Management', currentPage: 'calendar', currentSection: 'projects', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Help Center Management
export const getHelpCenter = async (req, res) => {
  try {
    logger.info('Admin help center page accessed');

    const { data: helpCenters, error } = await databaseService.supabase
      .from('help_center')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching help centers:', error);
      throw error;
    }

    const columns = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'category_name', label: 'Category', type: 'text' },
      { key: 'is_published', label: 'Published', type: 'status' },
      { key: 'view_count', label: 'Views', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      { type: 'link', url: '/admin/help-center', label: 'View Details', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>' },
      { type: 'button', onclick: 'editHelpCenter', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'delete', onclick: 'deleteHelpCenter', label: 'Delete', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: helpCenters.length, start: 1, end: helpCenters.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/help-center', {
      title: 'Help Center Management', currentPage: 'help-center', currentSection: 'help', tableId: 'help-center', entityName: 'help center', showCheckbox: true, showBulkActions: true, columns, data: helpCenters, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/help-center', colspan
    });
  } catch (error) {
    logger.error('Error loading help centers:', error);
    res.render('admin/help-center', { title: 'Help Center Management', currentPage: 'help-center', currentSection: 'help', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Main Section Overview
export const getMain = async (req, res) => {
  try {
    logger.info('Admin main section overview accessed');

    // Get summary stats for Main section items
    const stats = {
      todos: { total: 0, completed: 0, pending: 0 },
      users: { total: 0, active: 0, pending: 0 },
      ideas: { total: 0, approved: 0, pending: 0 },
      votes: { total: 0, upvotes: 0, downvotes: 0 },
      collaborations: { total: 0, active: 0, archived: 0 }
    };

    // Fetch stats from database
    try {
      const [todosResult, usersResult, ideasResult, votesResult, collaborationsResult] = await Promise.all([
        databaseService.supabase.from('todos').select('completed').order('created_at', { ascending: false }),
        databaseService.supabase.from('Accounts').select('is_verified').order('created_at', { ascending: false }),
        databaseService.supabase.from('ideas').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('ideas').select('upvotes, downvotes').order('created_at', { ascending: false }),
        databaseService.supabase.from('collaborations').select('status').order('created_at', { ascending: false })
      ]);

      if (todosResult.data) {
        stats.todos.total = todosResult.data.length;
        stats.todos.completed = todosResult.data.filter(t => t.completed).length;
        stats.todos.pending = stats.todos.total - stats.todos.completed;
      }

      if (usersResult.data) {
        stats.users.total = usersResult.data.length;
        stats.users.active = usersResult.data.filter(u => u.is_verified).length;
        stats.users.pending = stats.users.total - stats.users.active;
      }

      if (ideasResult.data) {
        stats.ideas.total = ideasResult.data.length;
        stats.ideas.approved = ideasResult.data.filter(i => i.status === 'approved').length;
        stats.ideas.pending = stats.ideas.total - stats.ideas.approved;
      }

      if (votesResult.data) {
        stats.votes.total = votesResult.data.reduce((sum, v) => sum + (v.upvotes || 0) + (v.downvotes || 0), 0);
        stats.votes.upvotes = votesResult.data.reduce((sum, v) => sum + (v.upvotes || 0), 0);
        stats.votes.downvotes = votesResult.data.reduce((sum, v) => sum + (v.downvotes || 0), 0);
      }

      if (collaborationsResult.data) {
        stats.collaborations.total = collaborationsResult.data.length;
        stats.collaborations.active = collaborationsResult.data.filter(c => c.status === 'active').length;
        stats.collaborations.archived = stats.collaborations.total - stats.collaborations.active;
      }
    } catch (error) {
      logger.warn('Error fetching main section stats:', error.message);
    }

    res.render('admin/main', {
      title: 'Main Overview',
      currentPage: 'main',
      currentSection: 'main',
      stats
    });
  } catch (error) {
    logger.error('Error loading main section overview:', error);
    res.render('admin/main', {
      title: 'Main Overview',
      currentPage: 'main',
      stats: {
        todos: { total: 0, completed: 0, pending: 0 },
        users: { total: 0, active: 0, pending: 0 },
        ideas: { total: 0, approved: 0, pending: 0 },
        votes: { total: 0, upvotes: 0, downvotes: 0 },
        collaborations: { total: 0, active: 0, archived: 0 }
      }
    });
  }
};

// Content Management Section Overview
export const getContentManagement = async (req, res) => {
  try {
    logger.info('Admin content management section overview accessed');

    const stats = {
      content: { total: 0, published: 0, draft: 0 },
      landingPages: { total: 0, active: 0, inactive: 0 }
    };

    try {
      const [contentResult, landingPagesResult] = await Promise.all([
        databaseService.supabase.from('learning_content').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('landing_pages').select('status').order('created_at', { ascending: false })
      ]);

      if (contentResult.data) {
        stats.content.total = contentResult.data.length;
        stats.content.published = contentResult.data.filter(c => c.status === 'published').length;
        stats.content.draft = stats.content.total - stats.content.published;
      }

      if (landingPagesResult.data) {
        stats.landingPages.total = landingPagesResult.data.length;
        stats.landingPages.active = landingPagesResult.data.filter(l => l.status === 'active').length;
        stats.landingPages.inactive = stats.landingPages.total - stats.landingPages.active;
      }
    } catch (error) {
      logger.warn('Error fetching content management stats:', error.message);
    }

    res.render('admin/content-management', {
      title: 'Content Management Overview',
      currentPage: 'content-management',
      currentSection: 'content-management',
      stats
    });
  } catch (error) {
    logger.error('Error loading content management section overview:', error);
    res.render('admin/content-management', {
      title: 'Content Management Overview',
      currentPage: 'content-management',
      currentSection: 'content-management',
      stats: {
        content: { total: 0, published: 0, draft: 0 },
        landingPages: { total: 0, active: 0, inactive: 0 }
      }
    });
  }
};

// System Section Overview
export const getSystem = async (req, res) => {
  try {
    logger.info('Admin system section overview accessed');

    const stats = {
      notifications: { total: 0, unread: 0, read: 0 },
      activityLogs: { total: 0, today: 0, thisWeek: 0 }
    };

    try {
      const [notificationsResult, activityLogsResult] = await Promise.all([
        databaseService.supabase.from('notifications').select('is_read').order('created_at', { ascending: false }),
        databaseService.supabase.from('activity_logs').select('created_at').order('created_at', { ascending: false })
      ]);

      if (notificationsResult.data) {
        stats.notifications.total = notificationsResult.data.length;
        stats.notifications.unread = notificationsResult.data.filter(n => !n.is_read).length;
        stats.notifications.read = stats.notifications.total - stats.notifications.unread;
      }

      if (activityLogsResult.data) {
        stats.activityLogs.total = activityLogsResult.data.length;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);

        stats.activityLogs.today = activityLogsResult.data.filter(a => new Date(a.created_at) >= today).length;
        stats.activityLogs.thisWeek = activityLogsResult.data.filter(a => new Date(a.created_at) >= weekAgo).length;
      }
    } catch (error) {
      logger.warn('Error fetching system stats:', error.message);
    }

    res.render('admin/system', {
      title: 'System Overview',
      currentPage: 'system',
      currentSection: 'system',
      stats
    });
  } catch (error) {
    logger.error('Error loading system section overview:', error);
    res.render('admin/system', {
      title: 'System Overview',
      currentPage: 'system',
      currentSection: 'system',
      stats: {
        notifications: { total: 0, unread: 0, read: 0 },
        activityLogs: { total: 0, today: 0, thisWeek: 0 }
      }
    });
  }
};

// Business Section Overview
export const getBusiness = async (req, res) => {
  try {
    logger.info('Admin business section overview accessed');

    const stats = {
      businessModels: { total: 0, active: 0, inactive: 0 },
      businessPlans: { total: 0, completed: 0, draft: 0 },
      financialModels: { total: 0, active: 0, inactive: 0 },
      pitchdecks: { total: 0, approved: 0, pending: 0 },
      valuations: { total: 0, completed: 0, pending: 0 },
      funding: { total: 0, secured: 0, seeking: 0 },
      teams: { total: 0, complete: 0, incomplete: 0 },
      legal: { total: 0, compliant: 0, pending: 0 },
      marketing: { total: 0, active: 0, inactive: 0 },
      corporate: { total: 0, active: 0, inactive: 0 },
      enterprises: { total: 0, active: 0, inactive: 0 }
    };

    try {
      const results = await Promise.all([
        databaseService.supabase.from('business_model').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('business_plan').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('financial_model').select('model_status').order('created_at', { ascending: false }),
        databaseService.supabase.from('pitchdeck').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('valuation').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('funding').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('team').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('legal').select('compliance_status').order('created_at', { ascending: false }),
        databaseService.supabase.from('marketing').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('corporates').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('enterprises').select('status').order('created_at', { ascending: false })
      ]);

      const tables = ['businessModels', 'businessPlans', 'financialModels', 'pitchdecks', 'valuations', 'funding', 'teams', 'legal', 'marketing', 'corporate', 'enterprises'];

      results.forEach((result, index) => {
        if (result.data) {
          const tableName = tables[index];
          stats[tableName].total = result.data.length;

          if (tableName === 'financialModels') {
            stats[tableName].active = result.data.filter(item => item.model_status === 'active').length;
            stats[tableName].inactive = stats[tableName].total - stats[tableName].active;
          } else if (tableName === 'legal') {
            stats[tableName].compliant = result.data.filter(item => item.compliance_status === 'compliant').length;
            stats[tableName].pending = stats[tableName].total - stats[tableName].compliant;
          } else {
            stats[tableName].active = result.data.filter(item => item.status === 'active').length;
            stats[tableName].inactive = stats[tableName].total - stats[tableName].active;
          }
        }
      });
    } catch (error) {
      logger.warn('Error fetching business stats:', error.message);
    }

    res.render('admin/business', {
      title: 'Business Overview',
      currentPage: 'business',
      currentSection: 'business',
      stats
    });
  } catch (error) {
    logger.error('Error loading business section overview:', error);
    res.render('admin/business', {
      title: 'Business Overview',
      currentPage: 'business',
      currentSection: 'business',
      stats: {}
    });
  }
};

// Learning Section Overview
export const getLearning = async (req, res) => {
  try {
    logger.info('Admin learning section overview accessed');

    const stats = {
      learningContent: { total: 0, published: 0, draft: 0 },
      learningCategories: { total: 0, active: 0, inactive: 0 },
      learningAssessments: { total: 0, completed: 0, pending: 0 },
      learningAnalytics: { totalViews: 0, avgCompletion: 0, popularContent: 0 }
    };

    try {
      const [contentResult, categoriesResult, assessmentsResult] = await Promise.all([
        databaseService.supabase.from('learning_content').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('learning_categories').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('learning_assessments').select('status').order('created_at', { ascending: false })
      ]);

      if (contentResult.data) {
        stats.learningContent.total = contentResult.data.length;
        stats.learningContent.published = contentResult.data.filter(c => c.status === 'published').length;
        stats.learningContent.draft = stats.learningContent.total - stats.learningContent.published;
      }

      if (categoriesResult.data) {
        stats.learningCategories.total = categoriesResult.data.length;
        stats.learningCategories.active = categoriesResult.data.filter(c => c.status === 'active').length;
        stats.learningCategories.inactive = stats.learningCategories.total - stats.learningCategories.active;
      }

      if (assessmentsResult.data) {
        stats.learningAssessments.total = assessmentsResult.data.length;
        stats.learningAssessments.completed = assessmentsResult.data.filter(a => a.status === 'completed').length;
        stats.learningAssessments.pending = stats.learningAssessments.total - stats.learningAssessments.completed;
      }
    } catch (error) {
      logger.warn('Error fetching learning stats:', error.message);
    }

    res.render('admin/learning', {
      title: 'Learning Overview',
      currentPage: 'learning',
      currentSection: 'learning',
      stats
    });
  } catch (error) {
    logger.error('Error loading learning section overview:', error);
    res.render('admin/learning', {
      title: 'Learning Overview',
      currentPage: 'learning',
      currentSection: 'learning',
      stats: {}
    });
  }
};

// Projects Section Overview
export const getProjects = async (req, res) => {
  try {
    logger.info('Admin projects section overview accessed');

    const stats = {
      messages: { total: 0, unread: 0, read: 0 },
      projectCollaborators: { total: 0, active: 0, inactive: 0 },
      calendar: { totalEvents: 0, upcoming: 0, past: 0 }
    };

    try {
      const [messagesResult, collaboratorsResult] = await Promise.all([
        databaseService.supabase.from('messages').select('is_read').order('created_at', { ascending: false }),
        databaseService.supabase.from('project_collaborators').select('status').order('created_at', { ascending: false })
      ]);

      if (messagesResult.data) {
        stats.messages.total = messagesResult.data.length;
        stats.messages.unread = messagesResult.data.filter(m => !m.is_read).length;
        stats.messages.read = stats.messages.total - stats.messages.unread;
      }

      if (collaboratorsResult.data) {
        stats.projectCollaborators.total = collaboratorsResult.data.length;
        stats.projectCollaborators.active = collaboratorsResult.data.filter(c => c.status === 'active').length;
        stats.projectCollaborators.inactive = stats.projectCollaborators.total - stats.projectCollaborators.active;
      }
    } catch (error) {
      logger.warn('Error fetching projects stats:', error.message);
    }

    res.render('admin/projects', {
      title: 'Projects Overview',
      currentPage: 'projects',
      currentSection: 'projects',
      stats
    });
  } catch (error) {
    logger.error('Error loading projects section overview:', error);
    res.render('admin/projects', {
      title: 'Projects Overview',
      currentPage: 'projects',
      currentSection: 'projects',
      stats: {}
    });
  }
};

// Help Section Overview
export const getHelp = async (req, res) => {
  try {
    logger.info('Admin help section overview accessed');

    const stats = {
      helpCenter: { total: 0, published: 0, draft: 0 }
    };

    try {
      const helpCenterResult = await databaseService.supabase
        .from('help_center')
        .select('status')
        .order('created_at', { ascending: false });

      if (helpCenterResult.data) {
        stats.helpCenter.total = helpCenterResult.data.length;
        stats.helpCenter.published = helpCenterResult.data.filter(h => h.status === 'published').length;
        stats.helpCenter.draft = stats.helpCenter.total - stats.helpCenter.published;
      }
    } catch (error) {
      logger.warn('Error fetching help stats:', error.message);
    }

    res.render('admin/help', {
      title: 'Help Overview',
      currentPage: 'help',
      currentSection: 'help',
      stats
    });
  } catch (error) {
    logger.error('Error loading help section overview:', error);
    res.render('admin/help', {
      title: 'Help Overview',
      currentPage: 'help',
      currentSection: 'help',
      stats: {}
    });
  }
};

// Financial Section Overview
export const getFinancial = async (req, res) => {
  try {
    logger.info('Admin financial section overview accessed');

    const stats = {
      packages: { total: 0, active: 0, inactive: 0 },
      billing: { total: 0, paid: 0, pending: 0 },
      rewards: { total: 0, active: 0, inactive: 0 }
    };

    try {
      const [packagesResult, billingResult, rewardsResult] = await Promise.all([
        databaseService.supabase.from('packages').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('Billing').select('status').order('created_at', { ascending: false }),
        databaseService.supabase.from('rewards').select('status').order('created_at', { ascending: false })
      ]);

      if (packagesResult.data) {
        stats.packages.total = packagesResult.data.length;
        stats.packages.active = packagesResult.data.filter(p => p.status === 'active').length;
        stats.packages.inactive = stats.packages.total - stats.packages.active;
      }

      if (billingResult.data) {
        stats.billing.total = billingResult.data.length;
        stats.billing.paid = billingResult.data.filter(b => b.status === 'paid').length;
        stats.billing.pending = stats.billing.total - stats.billing.paid;
      }

      if (rewardsResult.data) {
        stats.rewards.total = rewardsResult.data.length;
        stats.rewards.active = rewardsResult.data.filter(r => r.status === 'active').length;
        stats.rewards.inactive = stats.rewards.total - stats.rewards.active;
      }
    } catch (error) {
      logger.warn('Error fetching financial stats:', error.message);
    }

    res.render('admin/financial', {
      title: 'Financial Overview',
      currentPage: 'financial',
      currentSection: 'financial',
      stats
    });
  } catch (error) {
    logger.error('Error loading financial section overview:', error);
    res.render('admin/financial', {
      title: 'Financial Overview',
      currentPage: 'financial',
      currentSection: 'financial',
      stats: {}
    });
  }
};

// Route setup function
export default function adminRoutes(app) {
  // Section overview routes
  app.get('/admin/main', getMain);
  app.get('/admin/content-management', getContentManagement);
  app.get('/admin/system', getSystem);
  app.get('/admin/business', getBusiness);
  app.get('/admin/learning', getLearning);
  app.get('/admin/projects', getProjects);
  app.get('/admin/help', getHelp);
  app.get('/admin/financial', getFinancial);

  app.get('/admin/dashboard', getDashboard);
  app.get('/admin/users', getUsers);
  app.get('/admin/ideas', getIdeas);
  app.get('/admin/votes', getVotes);
  app.get('/admin/collaborations', getCollaborations);
  app.get('/admin/content', getContent);
  app.get('/admin/landing-page', getLandingPage);
  app.get('/admin/packages', getPackages);
  app.get('/admin/billing', getBilling);
  app.get('/admin/tables', getTables);
  app.get('/admin/todos', getTodos);
  app.get('/admin/rewards', getRewards);
  app.get('/admin/profile', getProfile);
  app.get('/admin/profile-settings', getProfileSettings);
  app.get('/admin/settings', getSettings);
  app.get('/admin/system-health', getSystemHealth);
  app.get('/admin/notifications', getNotifications);
  app.get('/admin/activity', getActivity);
  app.get('/admin/business-model', getBusinessModel);
  app.get('/admin/business-plan', getBusinessPlan);
  app.get('/admin/financial-model', getFinancialModel);
  app.get('/admin/pitchdeck', getPitchDeck);
  app.get('/admin/valuation', getValuation);
  app.get('/admin/funding', getFunding);
  app.get('/admin/team', getTeam);
  app.get('/admin/legal', getLegal);
  app.get('/admin/marketing', getMarketing);
  app.get('/admin/corporate', getCorporate);
  app.get('/admin/enterprises', getEnterprises);
  app.get('/admin/learning-content', getLearningContent);
  app.get('/admin/learning-categories', getLearningCategories);
  app.get('/admin/learning-assessments', getLearningAssessments);
  app.get('/admin/learning-analytics', getLearningAnalytics);
  app.get('/admin/messages', getMessages);
  app.get('/admin/project-collaborators', getProjectCollaborators);
  app.get('/admin/calendar', getCalendar);
  app.get('/admin/help-center', getHelpCenter);
  app.post('/admin/logout', postLogout);
}