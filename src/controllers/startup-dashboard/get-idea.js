import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Idea Page
export const getDashboardIdea = async (req, res) => {
  try {
    logger.info('Startup Dashboard idea page accessed');

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
    res.render('startup-dashboard/idea', {
      title: 'Startup Dashboard Idea',
      description: 'Startup Dashboard idea',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Idea',
      filterLinks,
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard idea:', error);
    res.status(500).send('Error loading page');
  }
};
