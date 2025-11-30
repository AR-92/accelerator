import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Corporate Dashboard Enterprises Page
export const getCorporateEnterprises = async (req, res) => {
  try {
    logger.info('Corporate Dashboard enterprises page accessed');

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
    res.render('corporate-dashboard/enterprises', {
      title: 'Corporate Dashboard Enterprises',
      description: 'Corporate Dashboard enterprises',
      section: 'corporate-dashboard',
      currentSection: 'corporate-dashboard',
      currentPage: 'Enterprises',
      filterLinks,
      layout,
    });
  } catch (error) {
    logger.error('Error loading corporate dashboard enterprises:', error);
    res.status(500).send('Error loading page');
  }
};
