import logger from '../../utils/logger.js';

// Explore Ideas Page
export const getExploreIdeas = async (req, res) => {
  try {
    logger.info('Explore Ideas page accessed');

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

    res.render('admin/explore-ideas', {
      title: 'Explore Ideas',
      description: 'Discover and explore project ideas',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Explore Ideas',
      filterLinks: overviewFilterLinks,
      ideaFilters: [
        {
          id: 'innovative',
          href: '/admin/other-pages/explore-ideas?filter=innovative',
          icon: 'zap',
          text: 'Innovative Solutions',
        },
        {
          id: 'community',
          href: '/admin/other-pages/explore-ideas?filter=community',
          icon: 'users',
          text: 'Community Driven',
        },
        {
          id: 'quality',
          href: '/admin/other-pages/explore-ideas?filter=quality',
          icon: 'shield-check',
          text: 'Quality Assured',
        },
      ],
    });
  } catch (error) {
    logger.error('Error loading explore ideas page:', error);

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

    res.render('admin/explore-ideas', {
      title: 'Explore Ideas',
      description: 'Discover and explore project ideas',
      section: 'main',
      currentSection: 'main',
      currentPage: 'Explore Ideas',
      filterLinks: overviewFilterLinks,
      ideaFilters: [
        {
          id: 'innovative',
          href: '/admin/other-pages/explore-ideas?filter=innovative',
          icon: 'zap',
          text: 'Innovative Solutions',
        },
        {
          id: 'community',
          href: '/admin/other-pages/explore-ideas?filter=community',
          icon: 'users',
          text: 'Community Driven',
        },
        {
          id: 'quality',
          href: '/admin/other-pages/explore-ideas?filter=quality',
          icon: 'shield-check',
          text: 'Quality Assured',
        },
      ],
    });
  }
};
