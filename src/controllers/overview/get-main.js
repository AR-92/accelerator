import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Main Section Overview
export const getMain = async (req, res) => {
  try {
    logger.info('Admin main section overview accessed');

    // Fetch all stats in parallel
    const [
      { count: totalTodos },
      { count: completedTodos },
      { count: pendingTodos },
      { count: totalUsers },
      { count: activeUsers },
      { count: pendingUsers },
      { count: totalIdeas },
      { count: approvedIdeas },
      { count: pendingIdeas },
      { count: totalVotes },
      { count: upvotes },
      { count: downvotes },
      { count: totalCollaborations },
      { count: activeCollaborations },
      { count: archivedCollaborations },
    ] = await Promise.all([
      databaseService.supabase
        .from('todos')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('todos')
        .select('*', { count: 'exact', head: true })
        .eq('completed', true),
      databaseService.supabase
        .from('todos')
        .select('*', { count: 'exact', head: true })
        .eq('completed', false),
      databaseService.supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      databaseService.supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved'),
      databaseService.supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      databaseService.supabase
        .from('votes_management')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('votes_management')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'upvote'),
      databaseService.supabase
        .from('votes_management')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'downvote'),
      databaseService.supabase
        .from('collaborations')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('collaborations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('collaborations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'archived'),
    ]);

    const statsGrid = [
      {
        icon: 'clipboard-list',
        title: 'Todos',
        link: '/admin/table-pages/todos',
        items: [
          { label: 'Total', value: totalTodos || 0 },
          {
            label: 'Completed',
            value: completedTodos || 0,
            color: 'text-green-600',
          },
          {
            label: 'Pending',
            value: pendingTodos || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'users',
        title: 'Accounts',
        link: '/admin/table-pages/users',
        items: [
          { label: 'Total', value: totalUsers || 0 },
          { label: 'Active', value: activeUsers || 0, color: 'text-green-600' },
          {
            label: 'Pending',
            value: pendingUsers || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'lightbulb',
        title: 'Ideas',
        link: '/admin/table-pages/ideas',
        items: [
          { label: 'Total', value: totalIdeas || 0 },
          {
            label: 'Approved',
            value: approvedIdeas || 0,
            color: 'text-green-600',
          },
          {
            label: 'Pending',
            value: pendingIdeas || 0,
            color: 'text-orange-600',
          },
        ],
      },
      {
        icon: 'heart',
        title: 'Votes Management',
        link: '/admin/table-pages/votes',
        items: [
          { label: 'Total', value: totalVotes || 0 },
          { label: 'Upvotes', value: upvotes || 0, color: 'text-green-600' },
          { label: 'Downvotes', value: downvotes || 0, color: 'text-red-600' },
        ],
      },
      {
        icon: 'users',
        title: 'Collaborations',
        link: '/admin/table-pages/collaborations',
        items: [
          { label: 'Total', value: totalCollaborations || 0 },
          {
            label: 'Active',
            value: activeCollaborations || 0,
            color: 'text-green-600',
          },
          {
            label: 'Archived',
            value: archivedCollaborations || 0,
            color: 'text-gray-600',
          },
        ],
      },
    ];

    const quickActions = [
      {
        link: '/admin/table-pages/todos',
        icon: 'clipboard-list',
        text: 'Manage Todos',
      },
      {
        link: '/admin/table-pages/users',
        icon: 'users',
        text: 'Manage Accounts',
      },
      {
        link: '/admin/table-pages/ideas',
        icon: 'lightbulb',
        text: 'Manage Ideas',
      },
      {
        link: '/admin/table-pages/votes',
        icon: 'heart',
        text: 'Manage Votes Management',
      },
      {
        link: '/admin/table-pages/collaborations',
        icon: 'users',
        text: 'Manage Collaborations',
      },
    ];

    const filterLinks = [
      {
        id: 'manage-todos-btn',
        href: '/admin/table-pages/todos',
        text: 'Manage Todos',
      },
      {
        id: 'manage-users-btn',
        href: '/admin/table-pages/users',
        text: 'Manage Accounts',
      },
      {
        id: 'manage-ideas-btn',
        href: '/admin/table-pages/ideas',
        text: 'Manage Ideas',
      },
      {
        id: 'manage-votes-btn',
        href: '/admin/table-pages/votes',
        text: 'Manage Votes Management',
      },
      {
        id: 'manage-collaborations-btn',
        href: '/admin/table-pages/collaborations',
        text: 'Manage Collaborations',
      },
    ];

    res.render('admin/overview-page', {
      title: 'Main Overview',
      description: 'Overview of core system components and user management',
      section: 'main',
      currentSection: 'main',
      currentPage: 'main',
      statsGrid,
      quickActions,
      filterLinks,
    });
  } catch (error) {
    logger.error('Error loading main overview:', error);
    res.render('admin/overview-page', {
      title: 'Main Overview',
      description: 'Overview of core system components and user management',
      section: 'main',
      currentSection: 'main',
      currentPage: 'main',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
    });
  }
};
