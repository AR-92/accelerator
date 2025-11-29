import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Collaborate Section Overview
export const getCollaborate = async (req, res) => {
  try {
    logger.info('Admin collaborate section overview accessed');

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
        items: [
          { label: 'Total', value: totalVotes || 0 },
          { label: 'Upvotes', value: upvotes || 0, color: 'text-green-600' },
          { label: 'Downvotes', value: downvotes || 0, color: 'text-red-600' },
        ],
      },
      {
        icon: 'users',
        title: 'Collaborations',
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

    const quickActions = [];

    const filterLinks = [
      {
        id: 'dashboard-link',
        href: '/admin/collaborate',
        text: 'Dashboard',
        icon: 'layout-dashboard',
      },
      {
        id: 'chat-link',
        href: '/pages/collaborate/chat',
        text: 'Chat',
        icon: 'message-circle',
      },
      {
        id: 'tasks-link',
        href: '/pages/collaborate/tasks',
        text: 'Tasks',
        icon: 'square-check-big',
      },
      {
        id: 'files-link',
        href: '/pages/collaborate/files',
        text: 'Files',
        icon: 'file-text',
      },
      {
        id: 'team-link',
        href: '/pages/collaborate/team',
        text: 'Team',
        icon: 'users',
      },
      {
        id: 'calendar-link',
        href: '/pages/collaborate/calendar',
        text: 'Calendar',
        icon: 'calendar',
      },
      {
        id: 'activity-link',
        href: '/pages/collaborate/activity',
        text: 'Activity',
        icon: 'activity',
      },
      {
        id: 'settings-link',
        href: '/pages/collaborate/settings',
        text: 'Settings',
        icon: 'settings',
      },
    ];

    res.render('admin/collaborate', {
      title: 'Collaborate Overview',
      description: 'Overview of collaborations and teamwork',
      section: 'collaborate',
      currentSection: 'collaborate',
      currentPage: 'collaborate',
      statsGrid,
      quickActions,
      filterLinks,
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading collaborate overview:', error);
    res.render('admin/collaborate', {
      title: 'Collaborate Overview',
      description: 'Overview of collaborations and teamwork',
      section: 'collaborate',
      currentSection: 'collaborate',
      currentPage: 'collaborate',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
      layout: req.headers['hx-request'] ? false : 'main',
    });
  }
};
