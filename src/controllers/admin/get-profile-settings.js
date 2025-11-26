import logger from '../../utils/logger.js';
import config from '../../config/index.js';

// Profile Settings
export const getProfileSettings = async (req, res) => {
  try {
    logger.info('Admin profile settings page accessed');

    // Load profile settings from config with fallbacks
    const profileSettings = {
      account: {
        displayName: 'Administrator',
        email: 'admin@accelerator.com',
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

    res.render('admin/other-pages/profile-settings', {
      title: 'Profile Settings',
      currentPage: 'profile-settings',
      currentSection: 'main',
      profileSettings,
    });
  } catch (error) {
    logger.error('Error loading profile settings:', error);
    res.render('admin/other-pages/profile-settings', {
      title: 'Profile Settings',
      currentPage: 'profile-settings',
      currentSection: 'main',
      profileSettings: {},
    });
  }
};
