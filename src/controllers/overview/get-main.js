import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Main Section Overview
export const getMain = async (req, res) => {
  try {
    logger.info('Admin main section overview accessed');

    // Get main stats
    const { count: totalUsers, error: userError } =
      await databaseService.supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true });
    if (userError) throw userError;

    const { count: totalProjects, error: projError } =
      await databaseService.supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
    if (projError) throw projError;

    const { count: totalContent, error: contError } =
      await databaseService.supabase
        .from('content')
        .select('*', { count: 'exact', head: true });
    if (contError) throw contError;

    const stats = {
      totalUsers: totalUsers || 0,
      totalProjects: totalProjects || 0,
      totalContent: totalContent || 0,
    };

    res.render('admin/other-pages/main', {
      title: 'Main Overview',
      currentPage: 'main',
      currentSection: 'main',
      stats,
    });
  } catch (error) {
    logger.error('Error loading main overview:', error);
    res.render('admin/other-pages/main', {
      title: 'Main Overview',
      currentPage: 'main',
      currentSection: 'main',
      stats: {
        todos: { total: 0, completed: 0, pending: 0 },
        users: { total: 0, active: 0, pending: 0 },
        ideas: { total: 0, approved: 0, pending: 0 },
        votes: { total: 0, upvotes: 0, downvotes: 0 },
        collaborations: { total: 0, active: 0, archived: 0 },
      },
    });
  }
};
