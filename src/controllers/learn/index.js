import logger from '../../utils/logger.js';

// Placeholder for learn-related controllers
export const getLearn = async (req, res) => {
  try {
    logger.info('Learn page accessed');
    res.render('learn/index', {
      title: 'Learn',
      description: 'Learning resources and tutorials',
      currentSection: 'learn',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading learn page:', error);
    res.status(500).send('Internal Server Error');
  }
};
