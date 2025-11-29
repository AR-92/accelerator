import logger from '../../utils/logger.js';

export const getTasks = async (req, res) => {
  try {
    logger.info('Tasks page accessed');

    res.render('collaborate/tasks', {
      title: 'Tasks',
      description: 'Project management and tracking',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading tasks page:', error);
    res.render('collaborate/tasks', {
      title: 'Tasks',
      description: 'Project management and tracking',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  }
};
