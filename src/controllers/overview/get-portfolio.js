import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Portfolio Section Overview
export const getPortfolio = async (req, res) => {
  try {
    // Check if this is the portfolio page or the overview
    const isPortfolioPage = req.path === '/admin/other-pages/portfolio';

    if (isPortfolioPage) {
      logger.info('Portfolio page accessed');
      res.render('admin/portfolio', {
        title: 'Portfolio',
        description: 'Showcase your professional projects and portfolio',
        section: 'main',
        currentSection: 'main',
        currentPage: 'portfolio',
        filterLinks: [
          {
            id: 'professional-projects',
            href: '/admin/other-pages/portfolio?filter=professional',
            icon: 'zap',
            text: 'Professional Projects',
          },
          {
            id: 'community-driven',
            href: '/admin/other-pages/portfolio?filter=community',
            icon: 'users',
            text: 'Community Driven',
          },
          {
            id: 'quality-assured',
            href: '/admin/other-pages/portfolio?filter=quality',
            icon: 'shield-check',
            text: 'Quality Assured',
          },
        ],
      });
      return;
    }

    logger.info('Admin portfolio section overview accessed');

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
        id: 'manage-todos-btn',
        href: '/admin/table-pages/todos',
        text: 'Manage Todos',
        icon: 'check-square',
      },
      {
        id: 'manage-users-btn',
        href: '/admin/table-pages/users',
        text: 'Manage Accounts',
        icon: 'users',
      },
      {
        id: 'manage-ideas-btn',
        href: '/admin/table-pages/ideas',
        text: 'Manage Ideas',
        icon: 'lightbulb',
      },
      {
        id: 'manage-votes-btn',
        href: '/admin/table-pages/votes',
        text: 'Manage Votes Management',
        icon: 'thumbs-up',
      },
      {
        id: 'manage-collaborations-btn',
        href: '/admin/table-pages/collaborations',
        text: 'Manage Collaborations',
        icon: 'handshake',
      },
    ];

    res.render('admin/overview-page', {
      title: 'Portfolio Overview',
      description: 'Overview of portfolio and projects',
      section: 'portfolio',
      currentSection: 'portfolio',
      currentPage: 'portfolio',
      statsGrid,
      quickActions,
      filterLinks,
    });
  } catch (error) {
    logger.error('Error loading portfolio overview:', error);
    res.render('admin/overview-page', {
      title: 'Portfolio Overview',
      description: 'Overview of portfolio and projects',
      section: 'portfolio',
      currentSection: 'portfolio',
      currentPage: 'portfolio',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
    });
  }
};
