import logger from '../../utils/logger.js';

export const getTeam = async (req, res) => {
  try {
    logger.info('Team page accessed');

    res.render('collaborate/team', {
      title: 'Team',
      description: 'Member directory and roles',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading team page:', error);
    res.render('collaborate/team', {
      title: 'Team',
      description: 'Member directory and roles',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  }
};
