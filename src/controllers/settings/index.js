import logger from '../../utils/logger.js';

// Placeholder for settings-related controllers
export const getSettings = async (req, res) => {
  try {
    logger.info('Settings page accessed');
    const settingsCategories = [
      { value: 'account', label: 'Account', icon: 'user' },
      { value: 'privacy', label: 'Privacy', icon: 'shield' },
      { value: 'notifications', label: 'Notifications', icon: 'bell' },
      { value: 'appearance', label: 'Appearance', icon: 'palette' },
      { value: 'ai', label: 'AI Assistant', icon: 'brain' },
      { value: 'security', label: 'Security', icon: 'lock' },
      { value: 'accessibility', label: 'Accessibility', icon: 'eye' },
      {
        value: 'communication',
        label: 'Communication',
        icon: 'message-circle',
      },
      { value: 'integrations', label: 'Integrations', icon: 'link' },
      { value: 'preferences', label: 'Preferences', icon: 'sliders' },
    ];
    res.render('settings/index', {
      title: 'Settings',
      description: 'Application settings and preferences',
      currentSection: 'settings',
      currentPage: 'Overview',
      settingsCategories,
      activeCategory: 'account',
      layout: req.headers['hx-request'] ? false : 'main',
    });
  } catch (error) {
    logger.error('Error loading settings page:', error);
    res.status(500).send('Internal Server Error');
  }
};
