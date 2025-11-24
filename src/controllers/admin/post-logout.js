import logger from '../../utils/logger.js';

// Logout
export const postLogout = (req, res) => {
  logger.info('Admin logout');
  // For now, just redirect to home
  res.redirect('/');
};
