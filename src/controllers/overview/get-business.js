import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// Business Section Overview
export const getBusiness = async (req, res) => {
  try {
    logger.info('Admin business section overview accessed');

    const businessOverviewService = serviceFactory.getBusinessOverviewService();
    const stats = await businessOverviewService.getBusinessStats();

    res.render('admin/other-pages/business', {
      title: 'Business Overview',
      currentPage: 'business',
      currentSection: 'business',
      stats
    });
  } catch (error) {
    logger.error('Error loading business overview:', error);
    res.render('admin/other-pages/business', {
      title: 'Business Overview',
      currentPage: 'business',
      currentSection: 'business',
      stats: {}
    });
  }
};