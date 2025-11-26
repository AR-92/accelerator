import db from './src/services/supabase.js';
import config from './src/config/index.js';
import logger from './src/utils/logger.js';

// Get user ID from command line or use default
const userId = process.argv[2] || 'admin-user-id';

const defaultUserSettings = {
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

async function populateUserSettings() {
  try {
    const updates = [];
    for (const [category, catSettings] of Object.entries(defaultUserSettings)) {
      for (const [key, value] of Object.entries(catSettings)) {
        let type = 'string';
        if (typeof value === 'boolean') type = 'boolean';
        else if (typeof value === 'number') type = 'number';
        else if (Array.isArray(value)) type = 'array';
        else if (typeof value === 'object') type = 'object';
        updates.push({ user_id: userId, category, key, value, type });
      }
    }
    await db.bulkUpdateSettings(updates, 'user_settings');
    logger.info(`Populated ${updates.length} default user settings`);
  } catch (error) {
    logger.error('Error populating user settings:', error);
  }
}

populateUserSettings();
