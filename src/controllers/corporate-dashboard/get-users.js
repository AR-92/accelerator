import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Corporate Dashboard Users Page
export const getCorporateUsers = async (req, res) => {
  try {
    logger.info('Corporate Dashboard users page accessed');

    const filterLinks = [
      {
        id: 'overview-btn',
        href: '/corporate-dashboard/overview',
        text: 'Overview',
        icon: 'layout',
      },
      {
        id: 'enterprises-btn',
        href: '/corporate-dashboard/enterprises',
        text: 'Enterprises',
        icon: 'building',
      },
      {
        id: 'projects-btn',
        href: '/corporate-dashboard/projects',
        text: 'Projects',
        icon: 'briefcase',
      },
      {
        id: 'analytics-btn',
        href: '/corporate-dashboard/analytics',
        text: 'Analytics',
        icon: 'bar-chart',
      },
      {
        id: 'users-btn',
        href: '/corporate-dashboard/users',
        text: 'Users',
        icon: 'users',
      },
      {
        id: 'activity-log-btn',
        href: '/corporate-dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
      },
    ];

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('corporate-dashboard/users', {
      title: 'Corporate Dashboard Users',
      description: 'Corporate Dashboard users',
      section: 'corporate-dashboard',
      currentSection: 'corporate-dashboard',
      currentPage: 'Users',
      filterLinks,
      layout,
    });
  } catch (error) {
    logger.error('Error loading corporate dashboard users:', error);
    res.status(500).send('Error loading page');
  }
};
