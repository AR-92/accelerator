import logger from '../../utils/logger.js';
import serviceFactory from '../../services/index.js';

// Projects Section Overview
export const getProjects = async (req, res) => {
  try {
    logger.info('Admin projects section overview accessed');

    const projectsOverviewService = serviceFactory.getProjectsOverviewService();
    const stats = await projectsOverviewService.getProjectsStats();

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