import logger from '../../utils/logger.js';

// Profile Settings
export const getProfileSettings = async (req, res) => {
  try {
    logger.info('Admin profile settings page accessed');

    // In a real application, this would come from the authenticated user's settings
    const profileSettings = {
      account: {
        displayName: 'Administrator',
        email: 'admin@accelerator.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        bio: 'System administrator with expertise in project management and team coordination.'
      },
      privacy: {
        profileVisibility: true,
        activityStatus: true,
        dataAnalytics: false
      },
      notifications: {
        emailNotifications: true,
        systemAlerts: true,
        userActivity: true,
        marketingUpdates: false,
        frequency: 'immediate'
      },
      appearance: {
        theme: 'light',
        language: 'en',
        dateFormat: 'mdy'
      }
    };

    res.render('admin/other-pages/profile-settings', {
      title: 'Profile Settings',
      currentPage: 'profile-settings',
      currentSection: 'main',
      profileSettings
    });
  } catch (error) {
    logger.error('Error loading profile settings:', error);
    res.render('admin/other-pages/profile-settings', {
      title: 'Profile Settings',
      currentPage: 'profile-settings',
      currentSection: 'main',
      profileSettings: {}
    });
  }
};