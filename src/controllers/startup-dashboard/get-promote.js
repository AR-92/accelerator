import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Promote Page
export const getDashboardPromote = async (req, res) => {
  try {
    logger.info('Startup Dashboard promote page accessed');

    const filterLinks = [
      {
        id: 'overview-btn',
        href: '/startup-dashboard/overview',
        text: 'Overview',
        icon: 'layout',
      },
      {
        id: 'idea-btn',
        href: '/startup-dashboard/idea',
        text: 'Idea',
        icon: 'lightbulb',
      },
      {
        id: 'business-btn',
        href: '/startup-dashboard/business',
        text: 'Business',
        icon: 'briefcase',
      },
      {
        id: 'financial-btn',
        href: '/startup-dashboard/financial',
        text: 'Financial',
        icon: 'dollar-sign',
      },
      {
        id: 'marketing-btn',
        href: '/startup-dashboard/marketing',
        text: 'Marketing',
        icon: 'globe',
      },
      {
        id: 'fund-btn',
        href: '/startup-dashboard/fund',
        text: 'Fund',
        icon: 'wallet',
      },
      {
        id: 'team-btn',
        href: '/startup-dashboard/team',
        text: 'Team',
        icon: 'users',
      },
      {
        id: 'promote-btn',
        href: '/startup-dashboard/promote',
        text: 'Promote',
        icon: 'megaphone',
      },
      {
        id: 'activity-log-btn',
        href: '/startup-dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
      },
    ];

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/promote', {
      title: 'Startup Dashboard Promote',
      description: 'Startup Dashboard promote',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Promote',
      filterLinks,
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard promote:', error);
    res.status(500).send('Error loading page');
  }
};
