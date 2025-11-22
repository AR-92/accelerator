import logger from '../utils/logger.js';

// Admin Dashboard
export const getDashboard = (req, res) => {
  logger.info('Admin dashboard accessed');
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    currentPage: 'dashboard'
  });
};

// Users Management
export const getUsers = async (req, res) => {
  try {
    logger.info('Admin users page accessed');

    // Placeholder data - in real app, fetch from Supabase
    const users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
        role: 'Admin',
        created_at: '2024-01-15T00:00:00Z',
        last_login: '2024-11-22T01:00:00Z'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        status: 'pending',
        role: 'User',
        created_at: '2024-02-20T00:00:00Z',
        last_login: null
      }
    ];

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
      total: users.length,
      start: 1,
      end: users.length,
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
      tableId: 'users',
      entityName: 'user',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: users,
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

    // Placeholder data - in real app, fetch from Supabase
    const ideas = [
      {
        id: 1,
        title: 'New Feature Request',
        description: 'Add dark mode support to the application',
        author: 'John Doe',
        status: 'under_review',
        votes: 24,
        created_at: '2024-03-10T00:00:00Z'
      },
      {
        id: 2,
        title: 'API Enhancement',
        description: 'Improve API response times and add caching',
        author: 'Jane Smith',
        status: 'approved',
        votes: 15,
        created_at: '2024-03-15T00:00:00Z'
      }
    ];

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

    // Placeholder data - in real app, fetch from Supabase
    const votes = [
      {
        id: 1,
        idea_title: 'New Feature Request',
        voter_name: 'John Doe',
        vote_type: 'upvote',
        created_at: '2024-03-10T00:00:00Z'
      },
      {
        id: 2,
        idea_title: 'API Enhancement',
        voter_name: 'Jane Smith',
        vote_type: 'downvote',
        created_at: '2024-03-15T00:00:00Z'
      }
    ];

    const columns = [
      { key: 'idea_title', label: 'Idea', type: 'text' },
      { key: 'voter_name', label: 'Voter', type: 'text' },
      { key: 'vote_type', label: 'Vote Type', type: 'status' },
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

    // Placeholder data - in real app, fetch from Supabase
    const collaborations = [
      {
        id: 1,
        name: 'Project Alpha',
        description: 'A collaborative project for new features',
        members_count: 3,
        status: 'active',
        created_at: '2024-02-15T00:00:00Z'
      },
      {
        id: 2,
        name: 'Beta Initiative',
        description: 'Testing new collaboration workflows',
        members_count: 5,
        status: 'archived',
        created_at: '2024-01-20T00:00:00Z'
      }
    ];

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

    // Placeholder data - in real app, fetch from Supabase
    const content = [
      {
        id: 1,
        title: 'Welcome Page',
        type: 'page',
        status: 'published',
        author: 'Admin',
        created_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: 'About Us',
        type: 'page',
        status: 'draft',
        author: 'Editor',
        created_at: '2024-02-15T00:00:00Z'
      }
    ];

    const columns = [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'created_at', label: 'Created', type: 'date', hidden: true, responsive: 'lg:table-cell' }
    ];

    const actions = [
      {
        type: 'link',
        url: '/admin/content',
        label: 'View',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>'
      },
      {
        type: 'button',
        onclick: 'editContent',
        label: 'Edit',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>'
      },
      {
        type: 'button',
        onclick: 'unpublishContent',
        label: 'Unpublish',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-eye-off" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>'
      },
      {
        type: 'delete',
        onclick: 'deleteContent',
        label: 'Delete',
        icon: '<svg class="w-4 h-4 mr-3 lucide lucide-trash-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>'
      }
    ];

    const bulkActions = [
      { onclick: 'bulkPublishContent', buttonId: 'bulkPublishBtn', label: 'Publish Selected' },
      { onclick: 'bulkUnpublishContent', buttonId: 'bulkUnpublishBtn', label: 'Unpublish Selected' },
      { onclick: 'bulkDeleteContent', buttonId: 'bulkDeleteBtn', label: 'Delete Selected' }
    ];

    const pagination = {
      currentPage: 1,
      limit: 10,
      total: content.length,
      start: 1,
      end: content.length,
      hasPrev: false,
      hasNext: false,
      prevPage: 0,
      nextPage: 2,
      pages: [1]
    };

    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/content', {
      title: 'Content Management',
      currentPage: 'content',
      tableId: 'content',
      entityName: 'content',
      showCheckbox: true,
      showBulkActions: true,
      columns,
      data: content,
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

    const sections = [
      { id: 1, name: 'Hero Section', status: 'active', last_updated: '2024-03-01T00:00:00Z' },
      { id: 2, name: 'Features Section', status: 'active', last_updated: '2024-02-15T00:00:00Z' }
    ];

    const columns = [
      { key: 'name', label: 'Section Name', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'last_updated', label: 'Last Updated', type: 'date' }
    ];

    const actions = [
      { type: 'button', onclick: 'editSection', label: 'Edit', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-square-pen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path></svg>' },
      { type: 'button', onclick: 'toggleSection', label: 'Toggle', icon: '<svg class="w-4 h-4 mr-3 lucide lucide-power" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>' }
    ];

    const pagination = { currentPage: 1, limit: 10, total: sections.length, start: 1, end: sections.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (false ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/landing-page', {
      title: 'Landing Page Management', currentPage: 'landing-page', tableId: 'landing-page', entityName: 'section', showCheckbox: false, showBulkActions: false, columns, data: sections, actions, bulkActions: [], pagination, query: { search: '', status: '' }, currentUrl: '/admin/landing-page', colspan
    });
  } catch (error) {
    logger.error('Error loading landing page:', error);
    res.render('admin/landing-page', { title: 'Landing Page Management', currentPage: 'landing-page', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Packages Management
export const getPackages = async (req, res) => {
  try {
    logger.info('Admin packages page accessed');

    const packages = [
      { id: 1, name: 'Basic Plan', price: '$9.99', status: 'active', subscribers: 150, created_at: '2024-01-01T00:00:00Z' },
      { id: 2, name: 'Pro Plan', price: '$19.99', status: 'active', subscribers: 75, created_at: '2024-01-15T00:00:00Z' }
    ];

    const columns = [
      { key: 'name', label: 'Package Name', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'subscribers', label: 'Subscribers', type: 'text' },
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
      title: 'Packages Management', currentPage: 'packages', tableId: 'packages', entityName: 'package', showCheckbox: true, showBulkActions: true, columns, data: packages, actions, bulkActions, pagination, query: { search: '', status: '' }, currentUrl: '/admin/packages', colspan
    });
  } catch (error) {
    logger.error('Error loading packages:', error);
    res.render('admin/packages', { title: 'Packages Management', currentPage: 'packages', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Billing Management
export const getBilling = async (req, res) => {
  try {
    logger.info('Admin billing page accessed');

    const transactions = [
      { id: 1, user: 'John Doe', amount: '$19.99', status: 'completed', date: '2024-03-01T00:00:00Z', package: 'Pro Plan' },
      { id: 2, user: 'Jane Smith', amount: '$9.99', status: 'pending', date: '2024-03-05T00:00:00Z', package: 'Basic Plan' }
    ];

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

    const pagination = { currentPage: 1, limit: 10, total: transactions.length, start: 1, end: transactions.length, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [1] };
    const colspan = columns.length + (true ? 1 : 0) + (actions.length > 0 ? 1 : 0);

    res.render('admin/billing', {
      title: 'Billing Management', currentPage: 'billing', tableId: 'billing', entityName: 'transaction', showCheckbox: true, showBulkActions: true, columns, data: transactions, actions, bulkActions, pagination, query: { search: '', status: '' }, currentUrl: '/admin/billing', colspan
    });
  } catch (error) {
    logger.error('Error loading billing:', error);
    res.render('admin/billing', { title: 'Billing Management', currentPage: 'billing', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Rewards Management
export const getRewards = async (req, res) => {
  try {
    logger.info('Admin rewards page accessed');

    const rewards = [
      { id: 1, name: 'Early Adopter Badge', type: 'badge', status: 'active', recipients: 25, created_at: '2024-01-01T00:00:00Z' },
      { id: 2, name: 'Top Contributor', type: 'achievement', status: 'active', recipients: 10, created_at: '2024-02-01T00:00:00Z' }
    ];

    const columns = [
      { key: 'name', label: 'Reward Name', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'recipients', label: 'Recipients', type: 'text' },
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
      title: 'Rewards Management', currentPage: 'rewards', tableId: 'rewards', entityName: 'reward', showCheckbox: true, showBulkActions: true, columns, data: rewards, actions, bulkActions, pagination, query: { search: '', status: '' }, currentUrl: '/admin/rewards', colspan
    });
  } catch (error) {
    logger.error('Error loading rewards:', error);
    res.render('admin/rewards', { title: 'Rewards Management', currentPage: 'rewards', data: [], pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] }, query: { search: '', status: '' } });
  }
};

// Profile
export const getProfile = (req, res) => {
  logger.info('Admin profile page accessed');
  res.render('admin/profile', {
    title: 'Profile',
    currentPage: 'profile'
  });
};

// Profile Settings
export const getProfileSettings = (req, res) => {
  logger.info('Admin profile settings page accessed');
  res.render('admin/profile-settings', {
    title: 'Profile Settings',
    currentPage: 'profile-settings'
  });
};

// Admin Settings
export const getSettings = (req, res) => {
  logger.info('Admin settings page accessed');
  res.render('admin/settings', {
    title: 'Admin Settings',
    currentPage: 'settings'
  });
};

// System Health
export const getSystemHealth = (req, res) => {
  logger.info('Admin system health page accessed');
  res.render('admin/system-health', {
    title: 'System Health',
    currentPage: 'system-health'
  });
};

// Notifications
export const getNotifications = (req, res) => {
  logger.info('Admin notifications page accessed');
  res.render('admin/notifications', {
    title: 'Notifications',
    currentPage: 'notifications'
  });
};

// Activity Log
export const getActivity = (req, res) => {
  logger.info('Admin activity page accessed');
  res.render('admin/activity', {
    title: 'Activity Log',
    currentPage: 'activity'
  });
};

// Logout
export const postLogout = (req, res) => {
  logger.info('Admin logout');
  // For now, just redirect to home
  res.redirect('/');
};

// Route setup function
export default function adminRoutes(app) {
  app.get('/admin/dashboard', getDashboard);
  app.get('/admin/users', getUsers);
  app.get('/admin/ideas', getIdeas);
  app.get('/admin/votes', getVotes);
  app.get('/admin/collaborations', getCollaborations);
  app.get('/admin/content', getContent);
  app.get('/admin/landing-page', getLandingPage);
  app.get('/admin/packages', getPackages);
  app.get('/admin/billing', getBilling);
  app.get('/admin/rewards', getRewards);
  app.get('/admin/profile', getProfile);
  app.get('/admin/profile-settings', getProfileSettings);
  app.get('/admin/settings', getSettings);
  app.get('/admin/system-health', getSystemHealth);
  app.get('/admin/notifications', getNotifications);
  app.get('/admin/activity', getActivity);
  app.post('/admin/logout', postLogout);
}