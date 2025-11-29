import logger from '../../utils/logger.js';

export const getCalendar = async (req, res) => {
  try {
    logger.info('Calendar page accessed');

    res.render('collaborate/calendar', {
      title: 'Calendar',
      description: 'Meetings and events scheduling',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading calendar page:', error);
    res.render('collaborate/calendar', {
      title: 'Calendar',
      description: 'Meetings and events scheduling',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  }
};
