import logger from '../../utils/logger.js';

export const getActivity = async (req, res) => {
  try {
    logger.info('Activity page accessed');

    res.render('collaborate/activity', {
      title: 'Activity',
      description: 'Recent updates and timeline',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading activity page:', error);
    res.render('collaborate/activity', {
      title: 'Activity',
      description: 'Recent updates and timeline',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  }
};
