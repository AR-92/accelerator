import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// Content Management Section Overview
export const getContentManagement = async (req, res) => {
  try {
    logger.info('Admin content management section overview accessed');

    const contentManagementOverviewService = serviceFactory.getContentManagementOverviewService();
    const stats = await contentManagementOverviewService.getContentManagementStats();

    res.render('admin/other-pages/content-management', {
      title: 'Content Management Overview',
      currentPage: 'content-management',
      currentSection: 'content-management',
      stats
    });
  } catch (error) {
    logger.error('Error loading content management overview:', error);
    res.render('admin/other-pages/content-management', {
      title: 'Content Management Overview',
      currentPage: 'content-management',
      currentSection: 'content-management',
      stats: {
        content: { total: 0, published: 0, draft: 0 },
        landingPages: { total: 0, active: 0, inactive: 0 }
      }
    });
  }
};