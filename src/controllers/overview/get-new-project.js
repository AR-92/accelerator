import logger from '../../utils/logger.js';

// New Project Page
export const getNewProject = async (req, res) => {
  try {
    logger.info('New Project page accessed');

    const overviewFilterLinks = [
      {
        id: 'new-project-link',
        href: '/admin/other-pages/new-project',
        text: 'New Project',
        icon: 'plus',
      },
      {
        id: 'explore-ideas-link',
        href: '/admin/explore-ideas',
        text: 'Explore Ideas',
        icon: 'lightbulb',
      },
      {
        id: 'learn-link',
        href: '/pages/learn',
        text: 'Learn',
        icon: 'book-open',
      },
      {
        id: 'all-projects-link',
        href: '/projects/all-projects',
        text: 'All Projects',
        icon: 'briefcase',
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
        id: 'new-project-link',
        href: '/admin/other-pages/new-project',
        text: 'New Project',
        icon: 'plus',
      },
      {
        id: 'explore-ideas-link',
        href: '/admin/explore-ideas',
        text: 'Explore Ideas',
        icon: 'lightbulb',
      },
      {
        id: 'learn-link',
        href: '/pages/learn',
        text: 'Learn',
        icon: 'book-open',
      },
      {
        id: 'all-projects-link',
        href: '/projects/all-projects',
        text: 'All Projects',
        icon: 'briefcase',
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
