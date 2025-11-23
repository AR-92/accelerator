import logger from '../../utils/logger.js';
import databaseService from '../../services/supabase.js';

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
        url: '/admin/table-pages/users',
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

    res.render('admin/table-pages/users', {
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
      currentUrl: '/admin/table-pages/users',
      colspan
    });
  } catch (error) {
    logger.error('Error loading users:', error);
    res.render('admin/table-pages/users', {
      title: 'Users Management',
      currentPage: 'users',
      currentSection: 'main',
      data: [],
      pagination: { currentPage: 1, limit: 10, total: 0, start: 0, end: 0, hasPrev: false, hasNext: false, prevPage: 0, nextPage: 2, pages: [] },
      query: { search: '', status: '' }
    });
  }
};