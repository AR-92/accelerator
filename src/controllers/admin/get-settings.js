import logger from '../../utils/logger.js';

// Admin Settings
export const getSettings = async (req, res) => {
  try {
    logger.info('Admin settings page accessed');

    // In a real application, these would be loaded from a configuration file or database
    const settings = {
      general: {
        siteName: process.env.SITE_NAME || 'Accelerator',
        siteDescription:
          process.env.SITE_DESCRIPTION || 'Project Management Platform',
        defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
        timezone: process.env.TIMEZONE || 'UTC',
      },
      security: {
        twoFactorAuth: process.env.TWO_FACTOR_AUTH === 'true',
        sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 60,
        passwordPolicy: process.env.PASSWORD_POLICY !== 'false',
        minPasswordLength: parseInt(process.env.MIN_PASSWORD_LENGTH) || 8,
      },
      email: {
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT) || 587,
        smtpUsername: process.env.SMTP_USERNAME || 'noreply@accelerator.com',
        smtpPassword: '••••••••', // Never expose actual password
        emailNotifications: process.env.EMAIL_NOTIFICATIONS !== 'false',
      },
      database: {
        connectionPoolSize: parseInt(process.env.DB_POOL_SIZE) || 10,
        queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 30,
        databaseLogging: process.env.DB_LOGGING === 'true',
        autoBackup: process.env.DB_AUTO_BACKUP !== 'false',
      },
    };

    res.render('admin/other-pages/settings', {
      title: 'Admin Settings',
      currentPage: 'settings',
      currentSection: 'system',
      settings,
    });
  } catch (error) {
    logger.error('Error loading admin settings:', error);
    res.render('admin/other-pages/settings', {
      title: 'Admin Settings',
      currentPage: 'settings',
      currentSection: 'system',
      settings: {},
    });
  }
};
