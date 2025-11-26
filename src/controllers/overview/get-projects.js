import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Projects Section Overview
export const getProjects = async (req, res) => {
  try {
    logger.info('Admin projects section overview accessed');

    // Fetch all stats in parallel
    const [
      { count: totalMessages },
      { count: unreadMessages },
      { count: readMessages },
      { count: totalProjectCollaborators },
      { count: activeProjectCollaborators },
      { count: inactiveProjectCollaborators },
      { count: totalEvents },
      { count: upcomingEvents },
      { count: pastEvents },
    ] = await Promise.all([
      databaseService.supabase
        .from('messages')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread'),
      databaseService.supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'read'),
      databaseService.supabase
        .from('project_collaborators')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('project_collaborators')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
      databaseService.supabase
        .from('project_collaborators')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'inactive'),
      databaseService.supabase
        .from('calendars')
        .select('*', { count: 'exact', head: true }),
      databaseService.supabase
        .from('calendars')
        .select('*', { count: 'exact', head: true })
        .gt('date', new Date().toISOString()),
      databaseService.supabase
        .from('calendars')
        .select('*', { count: 'exact', head: true })
        .lt('date', new Date().toISOString()),
    ]);

    const statsGrid = [
      {
        icon: 'message-square',
        title: 'Messages',
        link: '/admin/table-pages/messages',
        items: [
          { label: 'Total', value: totalMessages || 0 },
          {
            label: 'Unread',
            value: unreadMessages || 0,
            color: 'text-orange-600',
          },
          { label: 'Read', value: readMessages || 0, color: 'text-green-600' },
        ],
      },
      {
        icon: 'users',
        title: 'Project Collaborators',
        link: '/admin/table-pages/project-collaborators',
        items: [
          { label: 'Total', value: totalProjectCollaborators || 0 },
          {
            label: 'Active',
            value: activeProjectCollaborators || 0,
            color: 'text-green-600',
          },
          {
            label: 'Inactive',
            value: inactiveProjectCollaborators || 0,
            color: 'text-gray-600',
          },
        ],
      },
      {
        icon: 'calendar',
        title: 'Calendars',
        link: '/admin/table-pages/calendar',
        items: [
          { label: 'Events', value: totalEvents || 0 },
          {
            label: 'Upcoming',
            value: upcomingEvents || 0,
            color: 'text-blue-600',
          },
          { label: 'Past', value: pastEvents || 0, color: 'text-gray-600' },
        ],
      },
    ];

    const quickActions = [
      {
        link: '/admin/table-pages/messages',
        icon: 'message-square',
        text: 'Messages',
      },
      {
        link: '/admin/table-pages/project-collaborators',
        icon: 'users',
        text: 'Project Collaborators',
      },
      {
        link: '/admin/table-pages/calendar',
        icon: 'calendar',
        text: 'Calendars',
      },
    ];

    const filterLinks = [
      {
        id: 'messages-btn',
        href: '/admin/table-pages/messages',
        text: 'Messages',
        icon: 'message-square',
      },
      {
        id: 'collaborators-btn',
        href: '/admin/table-pages/project-collaborators',
        text: 'Project Collaborators',
        icon: 'users',
      },
      {
        id: 'calendar-btn',
        href: '/admin/table-pages/calendar',
        text: 'Calendars',
        icon: 'calendar',
      },
    ];

    res.render('admin/overview-page', {
      title: 'Projects Overview',
      description: 'Overview of project communications and collaborations',
      section: 'projects',
      currentSection: 'projects',
      currentPage: 'projects',
      statsGrid,
      quickActions,
      filterLinks,
    });
  } catch (error) {
    logger.error('Error loading projects overview:', error);
    res.render('admin/overview-page', {
      title: 'Projects Overview',
      description: 'Overview of project communications and collaborations',
      section: 'projects',
      currentSection: 'projects',
      currentPage: 'projects',
      statsGrid: [],
      quickActions: [],
      filterLinks: [],
    });
  }
};
