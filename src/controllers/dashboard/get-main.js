import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Dashboard Main Page
export const getDashboardMain = async (req, res) => {
  try {
    logger.info('Dashboard main page accessed');

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

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('dashboard/overview', {
      title: 'Dashboard',
      description: 'Dashboard overview',
      section: 'dashboard',
      currentSection: 'dashboard',
      currentPage: 'dashboard',
      filterLinks,
      layout,
    });
  } catch (error) {
    logger.error('Error loading dashboard main:', error);
    res.render('dashboard/overview', {
      title: 'Dashboard',
      description: 'Dashboard overview',
      section: 'dashboard',
      currentSection: 'dashboard',
      currentPage: 'dashboard',
      filterLinks: [],
    });
  }
};
