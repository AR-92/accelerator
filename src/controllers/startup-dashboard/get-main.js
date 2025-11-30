import logger from '../../utils/logger.js';
import { isHtmxRequest } from '../../helpers/http/index.js';

// Startup Dashboard Main Page
export const getDashboardMain = async (req, res) => {
  try {
    logger.info('Startup Dashboard main page accessed');

    const filterLinks = [
      {
        id: 'overview-btn',
        href: '/startup-dashboard/overview',
        text: 'Overview',
        icon: 'layout',
        itemClass: 'md:hidden',
      },
      {
        id: 'idea-btn',
        href: '/startup-dashboard/idea',
        text: 'Idea',
        icon: 'lightbulb',
        itemClass: 'md:hidden',
      },
      {
        id: 'business-btn',
        href: '/startup-dashboard/business',
        text: 'Business',
        icon: 'briefcase',
        itemClass: 'md:hidden',
      },
      {
        id: 'financial-btn',
        href: '/startup-dashboard/financial',
        text: 'Financial',
        icon: 'dollar-sign',
        itemClass: 'md:hidden',
      },
      {
        id: 'marketing-btn',
        href: '/startup-dashboard/marketing',
        text: 'Marketing',
        icon: 'globe',
        itemClass: 'md:hidden',
      },
      {
        id: 'fund-btn',
        href: '/startup-dashboard/fund',
        text: 'Fund',
        icon: 'wallet',
        itemClass: 'md:hidden',
      },
      {
        id: 'team-btn',
        href: '/startup-dashboard/team',
        text: 'Team',
        icon: 'users',
        itemClass: 'md:hidden',
      },
      {
        id: 'promote-btn',
        href: '/startup-dashboard/promote',
        text: 'Promote',
        icon: 'megaphone',
        itemClass: 'md:hidden',
      },
      {
        id: 'activity-log-btn',
        href: '/startup-dashboard/activity-log',
        text: 'Activity Log',
        icon: 'activity',
        itemClass: 'md:hidden',
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
      {
        id: 'learn-btn',
        href: '/pages/learn',
        text: 'Learn',
        icon: 'book-open',
      },
    ];

    const layout = isHtmxRequest(req) ? false : 'main';
    res.render('startup-dashboard/overview', {
      title: 'Startup Dashboard',
      description: 'Startup Dashboard overview',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Overview',
      filterLinks,
      layout,
    });
  } catch (error) {
    logger.error('Error loading startup dashboard main:', error);
    res.render('startup-dashboard/overview', {
      title: 'Startup Dashboard',
      description: 'Startup Dashboard overview',
      section: 'startup-dashboard',
      currentSection: 'startup-dashboard',
      currentPage: 'Overview',
      filterLinks: [],
    });
  }
};
