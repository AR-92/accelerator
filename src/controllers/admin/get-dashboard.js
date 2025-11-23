import logger from '../../utils/logger.js';

// Admin Dashboard
export const getDashboard = (req, res) => {
  logger.info('Admin dashboard accessed');
  res.render('admin/other-pages/dashboard', {
    title: 'Admin Dashboard',
    currentPage: 'dashboard',
    currentSection: 'main'
  });
};