import logger from '../../utils/logger.js';

export const getSettings = async (req, res) => {
  try {
    logger.info('Settings page accessed');

    res.render('collaborate/settings', {
      title: 'Settings',
      description: 'Collaboration preferences',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading settings page:', error);
    res.render('collaborate/settings', {
      title: 'Settings',
      description: 'Collaboration preferences',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  }
};
