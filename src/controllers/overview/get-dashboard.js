import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Dashboard Section Overview
export const getDashboard = async (req, res) => {
  try {
    logger.info('Admin dashboard section overview accessed');

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
        id: 'overview-btn',
        href: '/dashboard/overview',
        text: 'Overview',
        icon: 'layout',
      },
      {
        id: 'idea-btn',
        href: '/dashboard/idea',
        text: 'Idea',
        icon: 'lightbulb',
      },
      {
        id: 'business-btn',
        href: '/dashboard/business',
        text: 'Business',
        icon: 'briefcase',
      },
      {
        id: 'financial-btn',
        href: '/dashboard/financial',
        text: 'Financial',
        icon: 'dollar-sign',
      },
      {
        id: 'marketing-btn',
        href: '/dashboard/marketing',
        text: 'Marketing',
        icon: 'globe',
      },
      {
        id: 'fund-btn',
        href: '/dashboard/fund',
        text: 'Fund',
        icon: 'wallet',
      },
      {
        id: 'team-btn',
        href: '/dashboard/team',
        text: 'Team',
        icon: 'users',
      },
      {
        id: 'promote-btn',
        href: '/dashboard/promote',
        text: 'Promote',
        icon: 'megaphone',
      },
      {
        id: 'activity-log-btn',
        href: '/dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
      },
    ];

    res.render('admin/overview-page', {
      title: 'Dashboard Overview',
      description: 'Overview of core system components and user management',
      section: 'dashboard',
      currentSection: 'dashboard',
      currentPage: 'dashboard',
      statsGrid,
      quickActions,
      filterLinks,
    });
  } catch (error) {
    logger.error('Error loading dashboard overview:', error);
    res.render('admin/overview-page', {
      title: 'Dashboard Overview',
      description: 'Overview of core system components and user management',
      section: 'dashboard',
      currentSection: 'dashboard',
      currentPage: 'dashboard',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
    });
  }
};
