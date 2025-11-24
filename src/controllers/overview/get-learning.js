import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Learning Section Overview
export const getLearning = async (req, res) => {
  try {
    logger.info('Admin learning section overview accessed');

    // Get learning stats
    const { count: totalContent, error: contentError } =
      await databaseService.supabase
        .from('learning_content')
        .select('*', { count: 'exact', head: true });
    if (contentError) throw contentError;

    const { count: totalCategories, error: catError } =
      await databaseService.supabase
        .from('learning_categories')
        .select('*', { count: 'exact', head: true });
    if (catError) throw catError;

    const { count: totalAssessments, error: assessError } =
      await databaseService.supabase
        .from('learning_assessments')
        .select('*', { count: 'exact', head: true });
    if (assessError) throw assessError;

    const stats = {
      totalContent: totalContent || 0,
      totalCategories: totalCategories || 0,
      totalAssessments: totalAssessments || 0,
    };

    res.render('admin/other-pages/learning', {
      title: 'Learning Overview',
      currentPage: 'learning',
      currentSection: 'learning',
      stats,
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
        analytics: { total: 0, thisWeek: 0, thisMonth: 0 },
      },
    });
  }
};
