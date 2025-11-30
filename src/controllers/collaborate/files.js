import logger from '../../utils/logger.js';

export const getFiles = async (req, res) => {
  try {
    logger.info('Files page accessed');

    const filterLinks = [
      {
        id: 'overview-link',
        href: '/admin/collaborate',
        text: 'Overview',
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

    res.render('collaborate/files', {
      title: 'Files',
      description: 'Shared documents and resources',
      currentSection: 'collaborate',
      currentPage: 'Files',
      filterLinks,
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading files page:', error);
    res.render('collaborate/files', {
      title: 'Files',
      description: 'Shared documents and resources',
      currentSection: 'collaborate',
      currentPage: 'Files',
      filterLinks: [],
      layout: req.headers['hx-request'] ? false : 'main',
    });
  }
};
