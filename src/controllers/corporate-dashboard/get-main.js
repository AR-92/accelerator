import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Corporate Dashboard Main Page
export const getCorporateMain = async (req, res) => {
  try {
    logger.info('Corporate Dashboard main page accessed');

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
      {
        id: 'new-project-btn',
        href: '/admin/other-pages/new-project',
        text: 'New Project',
        icon: 'plus',
      },
      {
        id: 'explore-ideas-btn',
        href: '/admin/other-pages/explore-ideas',
        text: 'Explore Ideas',
        icon: 'lightbulb',
      },
    ];

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('corporate-dashboard/overview', {
      title: 'Corporate Dashboard',
      description: 'Corporate Dashboard overview',
      section: 'corporate-dashboard',
      currentSection: 'corporate-dashboard',
      currentPage: 'Overview',
      filterLinks,
      layout,
    });
  } catch (error) {
    logger.error('Error loading corporate dashboard main:', error);
    res.render('corporate-dashboard/overview', {
      title: 'Corporate Dashboard',
      description: 'Corporate Dashboard overview',
      section: 'corporate-dashboard',
      currentSection: 'corporate-dashboard',
      currentPage: 'Overview',
      filterLinks: [],
    });
  }
};
