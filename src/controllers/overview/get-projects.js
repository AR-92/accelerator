import logger from '../../utils/logger.js';
import { databaseService } from '../../services/index.js';

// Projects Section Overview
export const getProjects = async (req, res) => {
  try {
    logger.info('Admin projects section overview accessed');

    // Get projects stats
    const { count: totalProjects, error: projError } = await databaseService.supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });
    if (projError) throw projError;

    const { count: totalTasks, error: taskError } = await databaseService.supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true });
    if (taskError) throw taskError;

    const { count: totalCollaborators, error: collError } = await databaseService.supabase
      .from('project_collaborators')
      .select('*', { count: 'exact', head: true });
    if (collError) throw collError;

    const stats = {
      totalProjects: totalProjects || 0,
      totalTasks: totalTasks || 0,
      totalCollaborators: totalCollaborators || 0
    };

    res.render('admin/other-pages/projects', {
      title: 'Projects Overview',
      currentPage: 'projects',
      currentSection: 'projects',
      stats
    });
  } catch (error) {
    logger.error('Error loading projects overview:', error);
    res.render('admin/other-pages/projects', {
      title: 'Projects Overview',
      currentPage: 'projects',
      currentSection: 'projects',
      stats: {
        collaborators: { total: 0, active: 0, inactive: 0 },
        calendar: { total: 0, upcoming: 0, thisMonth: 0 }
      }
    });
  }
};