import logger from '../../utils/logger.js';

// System Config Page
export const getSystemConfig = async (req, res) => {
  try {
    logger.info('Admin system config page accessed');

    // Gather current system configuration
    const config = {
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
      database: {
        url: process.env.SUPABASE_URL ? 'Configured' : 'Not configured',
        key: process.env.SUPABASE_KEY ? 'Configured' : 'Not configured',
      },
      logging: {
        level: process.env.LOG_LEVEL || 'info',
      },
      cache: {
        enabled: process.env.CACHE_ENABLED === 'true',
        ttl: process.env.CACHE_TTL || 3600,
      },
      security: {
        sessionTimeout: process.env.SESSION_TIMEOUT || 3600000,
        maxLoginAttempts: process.env.MAX_LOGIN_ATTEMPTS || 5,
      },
    };

    res.render('admin/other-pages/system-config', {
      title: 'System Configuration',
      currentPage: 'system-config',
      currentSection: 'system',
      config,
    });
  } catch (error) {
    logger.error('Error loading system config:', error);
    res.render('admin/other-pages/system-config', {
      title: 'System Configuration',
      currentPage: 'system-config',
      currentSection: 'system',
      config: {},
      error: 'Failed to load system configuration',
    });
  }
};
