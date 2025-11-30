import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Enterprise Dashboard Activity Log Page
export const getEnterpriseActivityLog = async (req, res) => {
  try {
    logger.info('Enterprise Dashboard activity log page accessed');

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
    res.render('enterprise-dashboard/activity-log', {
      title: 'Enterprise Dashboard Activity Log',
      description: 'Enterprise Dashboard activity log',
      section: 'enterprise-dashboard',
      currentSection: 'enterprise-dashboard',
      currentPage: 'Activity Log',
      filterLinks,
      layout,
    });
  } catch (error) {
    logger.error('Error loading enterprise dashboard activity log:', error);
    res.status(500).send('Error loading page');
  }
};
