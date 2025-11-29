import logger from '../../utils/logger.js';

// Portfolio Page
export const getPortfolioPage = async (req, res) => {
  try {
    logger.info('Portfolio page accessed');

    res.render('admin/portfolio', {
      title: 'Portfolio',
      description: 'Showcase your professional projects and portfolio',
      section: 'main',
      currentSection: 'main',
      currentPage: 'portfolio',
    });
  } catch (error) {
    logger.error('Error loading portfolio page:', error);
    res.render('admin/portfolio', {
      title: 'Portfolio',
      description: 'Showcase your professional projects and portfolio',
      section: 'main',
      currentSection: 'main',
      currentPage: 'portfolio',
    });
  }
};
