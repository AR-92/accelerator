import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Enterprise Dashboard Main Page
export const getEnterpriseMain = async (req, res) => {
  try {
    logger.info('Enterprise Dashboard main page accessed');

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
    res.render('enterprise-dashboard/overview', {
      title: 'Enterprise Dashboard',
      description: 'Enterprise Dashboard overview',
      section: 'enterprise-dashboard',
      currentSection: 'enterprise-dashboard',
      currentPage: 'Overview',
      filterLinks,
      layout,
    });
  } catch (error) {
    logger.error('Error loading enterprise dashboard main:', error);
    res.render('enterprise-dashboard/overview', {
      title: 'Enterprise Dashboard',
      description: 'Enterprise Dashboard overview',
      section: 'enterprise-dashboard',
      currentSection: 'enterprise-dashboard',
      currentPage: 'Overview',
      filterLinks: [],
    });
  }
};
