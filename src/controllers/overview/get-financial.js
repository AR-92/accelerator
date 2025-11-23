import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// Financial Section Overview
export const getFinancial = async (req, res) => {
  try {
    logger.info('Admin financial section overview accessed');

    const financialOverviewService = serviceFactory.getFinancialOverviewService();
    const stats = await financialOverviewService.getFinancialStats();

    res.render('admin/other-pages/financial', {
      title: 'Financial Overview',
      currentPage: 'financial',
      currentSection: 'financial',
      stats
    });
  } catch (error) {
    logger.error('Error loading financial overview:', error);
    res.render('admin/other-pages/financial', {
      title: 'Financial Overview',
      currentPage: 'financial',
      currentSection: 'financial',
      stats: {
        packages: { total: 0, active: 0, inactive: 0 },
        billing: { total: 0, paid: 0, pending: 0 },
        rewards: { total: 0, active: 0, expired: 0 },
        revenue: { total: 0, thisMonth: 0, growth: 0 }
      }
    });
  }
};