import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Enterprise Dashboard Users Page
export const getEnterpriseUsers = async (req, res) => {
  try {
    logger.info('Enterprise Dashboard users page accessed');

    const filterLinks = [
      {
        id: 'overview-btn',
        href: '/enterprise-dashboard/overview',
        text: 'Overview',
        icon: 'layout',
      },
      {
        id: 'startups-btn',
        href: '/enterprise-dashboard/startups',
        text: 'Startups',
        icon: 'lightbulb',
      },
      {
        id: 'projects-btn',
        href: '/enterprise-dashboard/projects',
        text: 'Projects',
        icon: 'briefcase',
      },
      {
        id: 'analytics-btn',
        href: '/enterprise-dashboard/analytics',
        text: 'Analytics',
        icon: 'bar-chart',
      },
      {
        id: 'users-btn',
        href: '/enterprise-dashboard/users',
        text: 'Users',
        icon: 'users',
      },
      {
        id: 'activity-log-btn',
        href: '/enterprise-dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
      },
    ];

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('enterprise-dashboard/users', {
      title: 'Enterprise Dashboard Users',
      description: 'Enterprise Dashboard users',
      section: 'enterprise-dashboard',
      currentSection: 'enterprise-dashboard',
      currentPage: 'Users',
      filterLinks,
      layout,
    });
  } catch (error) {
    logger.error('Error loading enterprise dashboard users:', error);
    res.status(500).send('Error loading page');
  }
};
