import logger from '../../utils/logger.js';

// New Project Page
export const getNewProject = async (req, res) => {
  try {
    logger.info('New Project page accessed');

    res.render('admin/new-project', {
      title: 'New Project',
      description: 'Create a new project',
      section: 'main',
      currentSection: 'main',
      currentPage: 'new-project',
    });
  } catch (error) {
    logger.error('Error loading new project page:', error);
    res.render('admin/new-project', {
      title: 'New Project',
      description: 'Create a new project',
      section: 'main',
      currentSection: 'main',
      currentPage: 'new-project',
    });
  }
};
