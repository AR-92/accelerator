import logger from '../../utils/logger.js';

// Explore Ideas Page
export const getExploreIdeas = async (req, res) => {
  try {
    logger.info('Explore Ideas page accessed');

    res.render('admin/explore-ideas', {
      title: 'Explore Ideas',
      description: 'Discover and explore project ideas',
      section: 'main',
      currentSection: 'main',
      currentPage: 'explore-ideas',
      filterLinks: [
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
    res.render('admin/explore-ideas', {
      title: 'Explore Ideas',
      description: 'Discover and explore project ideas',
      section: 'main',
      currentSection: 'main',
      currentPage: 'explore-ideas',
      filterLinks: [
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
