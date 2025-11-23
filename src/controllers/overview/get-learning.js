import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// Learning Section Overview
export const getLearning = async (req, res) => {
  try {
    logger.info('Admin learning section overview accessed');

    const learningOverviewService = serviceFactory.getLearningOverviewService();
    const stats = await learningOverviewService.getLearningStats();

    res.render('admin/other-pages/learning', {
      title: 'Learning Overview',
      currentPage: 'learning',
      currentSection: 'learning',
      stats
    });
  } catch (error) {
    logger.error('Error loading learning overview:', error);
    res.render('admin/other-pages/learning', {
      title: 'Learning Overview',
      currentPage: 'learning',
      currentSection: 'learning',
      stats: {
        content: { total: 0, published: 0, draft: 0 },
        categories: { total: 0, featured: 0, regular: 0 },
        assessments: { total: 0, active: 0, archived: 0 },
        analytics: { total: 0, thisWeek: 0, thisMonth: 0 }
      }
    });
  }
};