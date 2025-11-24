import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Content Management Section Overview
export const getContentManagement = async (req, res) => {
  try {
    logger.info('Admin content management section overview accessed');

    // Get content management stats
    const { count: totalContent, error: contError } = await databaseService.supabase
      .from('content')
      .select('*', { count: 'exact', head: true });
    if (contError) throw contError;

    const { count: totalPages, error: pageError } = await databaseService.supabase
      .from('landing_pages')
      .select('*', { count: 'exact', head: true });
    if (pageError) throw pageError;

    const stats = {
      totalContent: totalContent || 0,
      totalPages: totalPages || 0
    };

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