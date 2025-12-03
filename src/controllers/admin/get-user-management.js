import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Admin User Management
export const getUserManagement = async (req, res) => {
  try {
    logger.info('Admin user management accessed');

    // Fetch all users
    const { data: users, error } = await databaseService.supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }

    // Group users by role
    const usersByRole = {
      startup: users?.filter((u) => u.role === 'startup' || !u.role) || [],
      enterprise: users?.filter((u) => u.role === 'enterprise') || [],
      corporate: users?.filter((u) => u.role === 'corporate') || [],
    };

    // Stats
    const stats = {
      total: users?.length || 0,
      startup: usersByRole.startup.length,
      enterprise: usersByRole.enterprise.length,
      corporate: usersByRole.corporate.length,
      active: users?.filter((u) => u.status === 'active').length || 0,
      pending: users?.filter((u) => u.status === 'pending').length || 0,
    };

    const quickActions = [
      {
        text: 'Add New User',
        href: '/admin/user-management/add',
        icon: 'user-plus',
        color: 'primary',
      },
      {
        text: 'Export Users',
        href: '/admin/user-management/export',
        icon: 'download',
        color: 'secondary',
      },
      {
        text: 'Bulk Actions',
        href: '#',
        icon: 'settings',
        color: 'muted',
      },
    ];

    res.render('admin/user-management', {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      section: 'main',
      currentSection: 'main',
      currentPage: 'User Management',
      users: users || [],
      usersByRole,
      stats,
      quickActions,
    });
  } catch (error) {
    logger.error('Error loading user management:', error);
    res.render('admin/user-management', {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      section: 'main',
      currentSection: 'main',
      currentPage: 'User Management',
      users: [],
      usersByRole: { startup: [], enterprise: [], corporate: [] },
      stats: {
        total: 0,
        startup: 0,
        enterprise: 0,
        corporate: 0,
        active: 0,
        pending: 0,
      },
      quickActions: [],
    });
  }
};
