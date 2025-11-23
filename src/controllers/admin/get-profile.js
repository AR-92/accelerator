import logger from '../../utils/logger.js';

// Profile
export const getProfile = async (req, res) => {
  try {
    logger.info('Admin profile page accessed');

    // In a real application, this would come from the authenticated user's session/database
    const profile = {
      name: 'Administrator',
      email: 'admin@accelerator.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      memberSince: 'January 2024',
      role: 'System Administrator',
      status: 'active',
      twoFactorEnabled: true,
      loginNotifications: true,
      dashboardAnalytics: true,
      stats: {
        totalActions: 1247,
        thisMonth: 89,
        usersManaged: 156,
        healthChecks: 42,
        settingsUpdated: 23,
        reportsGenerated: 18
      }
    };

    res.render('admin/other-pages/profile', {
      title: 'Profile',
      currentPage: 'profile',
      currentSection: 'main',
      profile
    });
  } catch (error) {
    logger.error('Error loading profile:', error);
    res.render('admin/other-pages/profile', {
      title: 'Profile',
      currentPage: 'profile',
      currentSection: 'main',
      profile: {}
    });
  }
};