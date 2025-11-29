import logger from '../../utils/logger.js';

// Placeholder for help-related controllers
export const getHelp = async (req, res) => {
  try {
    logger.info('Help page accessed');
    res.render('help/index', {
      title: 'Help',
      description: 'Get help and support',
      currentSection: 'help',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading help page:', error);
    res.status(500).send('Internal Server Error');
  }
};
