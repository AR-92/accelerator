import logger from '../../utils/logger.js';

// New Project Page
export const getNewProject = async (req, res) => {
  try {
    logger.info('New Project page accessed');

    const overviewFilterLinks = [
      {
        id: 'dashboard-link',
        href: '/admin/dashboard',
        text: 'Dashboard',
        icon: 'bar-chart',
      },
      {
        id: 'portfolio-link',
        href: '/admin/portfolio',
        text: 'Portfolio',
        icon: 'briefcase',
      },
      {
        id: 'collaborate-link',
        href: '/admin/collaborate',
        text: 'Collaborate',
        icon: 'users',
      },
      {
        id: 'new-project-link',
        href: '/admin/new-project',
        text: 'New Project',
        icon: 'plus',
      },
      {
        id: 'explore-ideas-link',
        href: '/admin/explore-ideas',
        text: 'Explore Ideas',
        icon: 'lightbulb',
      },
    ];

    res.render('admin/new-project', {
      title: 'New Project',
      description: 'Create a new project',
      section: 'main',
      currentSection: 'main',
      currentPage: 'New Project',
      filterLinks: overviewFilterLinks,
    });
  } catch (error) {
    logger.error('Error loading new project page:', error);

    const overviewFilterLinks = [
      {
        id: 'dashboard-link',
        href: '/admin/dashboard',
        text: 'Dashboard',
        icon: 'bar-chart',
      },
      {
        id: 'portfolio-link',
        href: '/admin/portfolio',
        text: 'Portfolio',
        icon: 'briefcase',
      },
      {
        id: 'collaborate-link',
        href: '/admin/collaborate',
        text: 'Collaborate',
        icon: 'users',
      },
      {
        id: 'new-project-link',
        href: '/admin/new-project',
        text: 'New Project',
        icon: 'plus',
      },
      {
        id: 'explore-ideas-link',
        href: '/admin/explore-ideas',
        text: 'Explore Ideas',
        icon: 'lightbulb',
      },
    ];

    res.render('admin/new-project', {
      title: 'New Project',
      description: 'Create a new project',
      section: 'main',
      currentSection: 'main',
      currentPage: 'New Project',
      filterLinks: overviewFilterLinks,
    });
  }
};
