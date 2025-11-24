import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Business Section Overview
export const getBusiness = async (req, res) => {
  try {
    logger.info('Admin business section overview accessed');

    // Get business stats
    const { count: totalModels, error: modelError } =
      await databaseService.supabase
        .from('business_model')
        .select('*', { count: 'exact', head: true });
    if (modelError) throw modelError;

    const { count: totalPlans, error: planError } =
      await databaseService.supabase
        .from('business_plan')
        .select('*', { count: 'exact', head: true });
    if (planError) throw planError;

    const stats = {
      totalModels: totalModels || 0,
      totalPlans: totalPlans || 0,
    };

    res.render('admin/other-pages/business', {
      title: 'Business Overview',
      currentPage: 'business',
      currentSection: 'business',
      stats,
    });
  } catch (error) {
    logger.error('Error loading business overview:', error);
    res.render('admin/other-pages/business', {
      title: 'Business Overview',
      currentPage: 'business',
      currentSection: 'business',
      stats: {},
    });
  }
};
