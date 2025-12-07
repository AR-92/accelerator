import logger from '../../utils/logger.js';
import config from '../../config/index.js';
import db from '../../services/supabase.js';

// Profile Settings
export const getProfileSettings = async (req, res) => {
  try {
    logger.info('Admin profile settings page accessed');

    // Get user_id from auth
    const userId = req.user?.id || 'admin-user-id'; // Fallback for development

    // Load settings from DB first, fallback to config
    let dbSettings = {};
    try {
      const data = await db.read('user_settings', null, { user_id: userId });
      data.forEach((row) => {
        if (!dbSettings[row.category]) dbSettings[row.category] = {};
        let parsedValue = row.value;
        if (row.type === 'boolean') parsedValue = Boolean(row.value);
        else if (row.type === 'number') parsedValue = Number(row.value);
        else if (row.type === 'array' || row.type === 'object')
          parsedValue = JSON.parse(row.value);
        dbSettings[row.category][row.key] = parsedValue;
      });
    } catch (error) {
      logger.warn(
        'Failed to load profile settings from DB, using config fallback:',
        error.message
      );
    }

    // Default settings from config/env and user data
    const user = req.user;
    const defaultSettings = {
      account: {
        displayName: user?.user_metadata?.firstName
          ? `${user.user_metadata.firstName} ${user.user_metadata.lastName || ''}`.trim()
          : user?.email?.split('@')[0] || 'Administrator',
        email: user?.email || 'admin@accelerator.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        bio: 'System administrator with expertise in project management and team coordination.',
      },
      privacy: {
        profileVisibility: true,
        activityStatus: true,
        dataAnalytics: false,
      },
      notifications: {
        emailNotifications: true,
        systemAlerts: true,
        userActivity: true,
        marketingUpdates: false,
        frequency: 'immediate',
      },
      appearance: {
        theme: 'light',
        language: 'en',
        dateFormat: 'mdy',
      },
      ai: {
        aiAssistantEnabled: config.ai.schedulerEnabled,
        preferredAiPersonality: config.ai.agentPersonality,
        aiNotificationsEnabled: config.ai.notificationAiEvents,
        aiLearningEnabled: config.ai.learningAdaptationEnabled,
        aiDataSharing: config.ai.dataAnonymization,
        aiContentPreferences: config.ai.contentBrandingVoice,
        aiResponseStyle: config.ai.agentResponseFormat,
        aiFeedbackEnabled: config.ai.userFeedbackCollection,
      },
      security: {
        twoFactorEnabled: process.env.TWO_FACTOR_AUTH === 'true',
        sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 60,
        loginAlerts: true,
        passwordChangeAlerts: true,
        deviceTracking: true,
        biometricEnabled: false,
      },
      accessibility: {
        highContrastMode: false,
        fontSize: 'medium',
        screenReaderEnabled: false,
        keyboardNavigation: true,
        reducedMotion: false,
      },
      communication: {
        timezone: config.ui.timezoneDisplayFormat,
        language: config.ui.numberFormatLocale,
        dateFormat: config.ui.dateTimeFormatPreferences,
        timeFormat: '12h',
        currency: config.ui.currencySymbol,
        units: 'metric',
      },
      integrations: {
        slackConnected: config.email.slackWebhookUrl ? true : false,
        discordConnected: config.email.discordWebhookUrl ? true : false,
        googleConnected: false,
        githubConnected: false,
        calendarSync: false,
        contactSync: false,
      },
      preferences: {
        dashboardLayout: 'grid',
        defaultView: 'overview',
        autoSave: true,
        keyboardShortcuts: true,
        darkModeSchedule: 'manual',
        emailDigest: 'daily',
        notificationSound: true,
      },
    };

    // Merge DB settings with defaults
    const profileSettings = {};
    for (const category in defaultSettings) {
      profileSettings[category] = {
        ...defaultSettings[category],
        ...(dbSettings[category] || {}),
      };
    }

    // Profile settings categories for filter navigation
    const profileSettingsCategories = [
      { value: 'all', label: 'All Settings', icon: 'settings' },
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

    // Get active category from query param or default to 'all'
    const activeCategory = req.query.category || 'all';

    res.render('admin/other-pages/profile-settings', {
      title: 'Profile Settings',
      currentPage: 'profile-settings',
      currentSection: 'main',
      profileSettings,
      settingsCategories: profileSettingsCategories,
      activeCategory,
    });
  } catch (error) {
    logger.error('Error loading profile settings:', error);
    res.render('admin/other-pages/profile-settings', {
      title: 'Profile Settings',
      currentPage: 'profile-settings',
      currentSection: 'main',
      profileSettings: {},
      settingsCategories: [],
      activeCategory: 'all',
    });
  }
};

// Save profile settings
export const postProfileSettings = async (req, res) => {
  try {
    logger.info('Saving profile settings');

    const userId = req.user?.id || 'admin-user-id'; // Fallback for development
    const updates = [];
    const categoryMappings = {
      displayName: { category: 'account', type: 'string' },
      email: { category: 'account', type: 'string' },
      phone: { category: 'account', type: 'string' },
      location: { category: 'account', type: 'string' },
      bio: { category: 'account', type: 'string' },
      profileVisibility: { category: 'privacy', type: 'boolean' },
      activityStatus: { category: 'privacy', type: 'boolean' },
      dataAnalytics: { category: 'privacy', type: 'boolean' },
      emailNotifications: { category: 'notifications', type: 'boolean' },
      systemAlerts: { category: 'notifications', type: 'boolean' },
      userActivity: { category: 'notifications', type: 'boolean' },
      marketingUpdates: { category: 'notifications', type: 'boolean' },
      notificationFrequency: { category: 'notifications', type: 'string' },
      theme: { category: 'appearance', type: 'string' },
      language: { category: 'appearance', type: 'string' },
      dateFormat: { category: 'appearance', type: 'string' },
      aiAssistantEnabled: { category: 'ai', type: 'boolean' },
      preferredAiPersonality: { category: 'ai', type: 'string' },
      aiNotificationsEnabled: { category: 'ai', type: 'boolean' },
      aiLearningEnabled: { category: 'ai', type: 'boolean' },
      aiDataSharing: { category: 'ai', type: 'boolean' },
      aiContentPreferences: { category: 'ai', type: 'string' },
      aiResponseStyle: { category: 'ai', type: 'string' },
      aiFeedbackEnabled: { category: 'ai', type: 'boolean' },
      twoFactorEnabled: { category: 'security', type: 'boolean' },
      sessionTimeout: { category: 'security', type: 'number' },
      loginAlerts: { category: 'security', type: 'boolean' },
      passwordChangeAlerts: { category: 'security', type: 'boolean' },
      deviceTracking: { category: 'security', type: 'boolean' },
      biometricEnabled: { category: 'security', type: 'boolean' },
      highContrastMode: { category: 'accessibility', type: 'boolean' },
      fontSize: { category: 'accessibility', type: 'string' },
      screenReaderEnabled: { category: 'accessibility', type: 'boolean' },
      keyboardNavigation: { category: 'accessibility', type: 'boolean' },
      reducedMotion: { category: 'accessibility', type: 'boolean' },
      timezone: { category: 'communication', type: 'string' },
      communicationLanguage: { category: 'communication', type: 'string' },
      communicationDateFormat: { category: 'communication', type: 'string' },
      timeFormat: { category: 'communication', type: 'string' },
      currency: { category: 'communication', type: 'string' },
      units: { category: 'communication', type: 'string' },
      calendarSync: { category: 'integrations', type: 'boolean' },
      contactSync: { category: 'integrations', type: 'boolean' },
      dashboardLayout: { category: 'preferences', type: 'string' },
      defaultView: { category: 'preferences', type: 'string' },
      autoSave: { category: 'preferences', type: 'boolean' },
      keyboardShortcuts: { category: 'preferences', type: 'boolean' },
      darkModeSchedule: { category: 'preferences', type: 'string' },
      emailDigest: { category: 'preferences', type: 'string' },
      notificationSound: { category: 'preferences', type: 'boolean' },
    };

    for (const [key, value] of Object.entries(req.body)) {
      if (categoryMappings[key]) {
        const { category, type } = categoryMappings[key];
        let parsedValue = value;
        if (type === 'boolean')
          parsedValue = value === 'on' || value === 'true';
        else if (type === 'number') parsedValue = Number(value);
        updates.push({
          user_id: userId,
          category,
          key,
          value: parsedValue,
          type,
        });
      }
    }

    if (updates.length > 0) {
      await db.bulkUpdateSettings(updates, 'user_settings');
    }

    // Redirect back with success message
    if (req.session)
      req.session.successMessage = 'Profile settings saved successfully!';
    res.redirect('/admin/other-pages/profile-settings');
  } catch (error) {
    logger.error('Error saving profile settings:', error);
    if (req.session)
      req.session.errorMessage = 'Failed to save profile settings.';
    res.redirect('/admin/other-pages/profile-settings');
  }
};
