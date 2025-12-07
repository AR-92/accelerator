import logger from '../../utils/logger.js';
import { ServerDataService } from '../../services/serverDataService.js';

// Placeholder for settings-related controllers
export const getSettings = async (req, res) => {
  try {
    logger.info('Settings page accessed');

    const user = req.user;
    if (!user) {
      return res.redirect('/auth/login');
    }

    // Fetch real user data
    const userCredits = await ServerDataService.getUserCredits(user.id);

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
    const userProfile = {
      name:
        `${user.firstName} ${user.lastName}`.trim() ||
        user.email?.split('@')[0] ||
        'User',
      avatar: user.user_metadata?.avatar || '/images/avatar.png',
      level: user.user_metadata?.level || 1,
      joinDate: user.created_at || new Date().toISOString().split('T')[0],
      totalContributions: 10, // This could be calculated from actual data
      reputation: userCredits?.reputation || 0,
    };
    res.render('pages/settings/index', {
      title: 'Settings',
      description: 'Application settings and preferences',
      currentSection: 'settings',
      currentPage: 'Overview',
      settingsCategories,
      activeCategory: 'overview',
      layout: req.headers['hx-request'] ? false : 'settings',
      user: user,
      currentCredits: userCredits?.balance || 0,
      userProfile,
      showSearch: true,
    });
  } catch (error) {
    logger.error('Error loading settings page:', error);
    res.status(500).send('Internal Server Error');
  }
};
