import db from './src/services/supabase.js';
import config from './src/config/index.js';
import logger from './src/utils/logger.js';

const defaultSettings = {
  general: {
    siteName: process.env.SITE_NAME || 'Accelerator',
    siteDescription:
      process.env.SITE_DESCRIPTION || 'Project Management Platform',
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
    timezone: process.env.TIMEZONE || 'UTC',
  },
  server: {
    clusterMode: config.clusterMode,
    maxWorkers: config.maxWorkers,
    healthCheckInterval: config.healthCheckInterval,
    gracefulShutdownTimeout: config.gracefulShutdownTimeout,
    requestTimeoutGlobal: config.requestTimeoutGlobal,
    compressionLevel: config.compressionLevel,
    staticCacheMaxAge: config.staticCacheMaxAge,
    trustProxy: config.trustProxy,
  },
  database: {
    connectionRetryAttempts: config.database.connectionRetryAttempts,
    connectionRetryDelay: config.database.connectionRetryDelay,
    sslMode: config.database.sslMode,
    schemaVersion: config.database.schemaVersion,
    migrationPath: config.database.migrationPath,
    backupRetentionDays: config.database.backupRetentionDays,
    backupSchedule: config.database.backupSchedule,
    connectionPoolMin: config.database.connectionPoolMin,
    connectionPoolMax: config.database.connectionPoolMax,
    statementTimeout: config.database.statementTimeout,
    idleTimeout: config.database.idleTimeout,
  },
  security: {
    twoFactorAuth: process.env.TWO_FACTOR_AUTH === 'true',
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 60,
    passwordPolicy: process.env.PASSWORD_POLICY !== 'false',
    minPasswordLength: parseInt(process.env.MIN_PASSWORD_LENGTH) || 8,
  },
  email: {
    provider: config.email.provider,
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT) || 587,
    smtpUsername: process.env.SMTP_USERNAME || 'noreply@accelerator.com',
    emailNotifications: process.env.EMAIL_NOTIFICATIONS !== 'false',
    fromName: config.email.fromName,
    fromAddress: config.email.fromAddress,
  },
  ui: {
    customCssUrl: config.ui.customCssUrl,
    logoUrl: config.ui.logoUrl,
    primaryColor: config.ui.primaryColor,
    accentColor: config.ui.accentColor,
    fontFamily: config.ui.fontFamily,
    sidebarCollapsedDefault: config.ui.sidebarCollapsedDefault,
    itemsPerPageDefault: config.ui.itemsPerPageDefault,
    timezoneDisplayFormat: config.ui.timezoneDisplayFormat,
    numberFormatLocale: config.ui.numberFormatLocale,
    currencySymbol: config.ui.currencySymbol,
    dateTimeFormatPreferences: config.ui.dateTimeFormatPreferences,
  },
  performance: {
    cacheStrategy: config.performance.cacheStrategy,
    cacheCompressionEnabled: config.performance.cacheCompressionEnabled,
    staticAssetsVersion: config.performance.staticAssetsVersion,
    apiResponseCacheTtl: config.performance.apiResponseCacheTtl,
    databaseQueryCacheTtl: config.performance.databaseQueryCacheTtl,
    sessionStoreType: config.performance.sessionStoreType,
    rateLimitStoreType: config.performance.rateLimitStoreType,
    fileUploadMaxSize: config.performance.fileUploadMaxSize,
    imageOptimizationQuality: config.performance.imageOptimizationQuality,
  },
  logging: {
    format: config.logging.format,
    maxSize: config.logging.maxSize,
    maxFiles: config.logging.maxFiles,
    transports: config.logging.transports,
    prometheusMetricsEnabled: config.logging.prometheusMetricsEnabled,
    errorReportingLevel: config.logging.errorReportingLevel,
    auditLogRetentionDays: config.logging.auditLogRetentionDays,
  },
  api: {
    versioningStrategy: config.api.versioningStrategy,
    documentationEnabled: config.api.documentationEnabled,
    graphqlEnabled: config.api.graphqlEnabled,
    restApiEnabled: config.api.restApiEnabled,
    websocketEnabled: config.api.websocketEnabled,
    fileStorageProvider: config.api.fileStorageProvider,
    smsProvider: config.api.smsProvider,
  },
  business: {
    collaborationToolsEnabled: config.business.collaborationToolsEnabled,
    billingCycleDefault: config.business.billingCycleDefault,
    enterpriseFeaturesEnabled: config.business.enterpriseFeaturesEnabled,
  },
  userManagement: {
    teamHierarchyEnabled: config.userManagement.teamHierarchyEnabled,
    bulkImportEnabled: config.userManagement.bulkImportEnabled,
    profilePictureMaxSize: config.userManagement.profilePictureMaxSize,
    bioCharacterLimit: config.userManagement.bioCharacterLimit,
  },
  backup: {
    autoUpdateEnabled: config.backup.autoUpdateEnabled,
  },
  compliance: {
    gdprComplianceEnabled: config.compliance.gdprComplianceEnabled,
    cookieConsentRequired: config.compliance.cookieConsentRequired,
    dataExportEnabled: config.compliance.dataExportEnabled,
    rightToForgetImplemented: config.compliance.rightToForgetImplemented,
    auditTrailEnabled: config.compliance.auditTrailEnabled,
    legalHoldEnabled: config.compliance.legalHoldEnabled,
  },
  ai: {
    provider: config.ai.provider,
    modelDefault: config.ai.modelDefault,
    temperature: config.ai.temperature,
    maxTokens: config.ai.maxTokens,
    timeout: config.ai.timeout,
    retryAttempts: config.ai.retryAttempts,
    rateLimitRequests: config.ai.rateLimitRequests,
    rateLimitTokens: config.ai.rateLimitTokens,
    agentPersonality: config.ai.agentPersonality,
    agentMemorySize: config.ai.agentMemorySize,
    agentAutonomyLevel: config.ai.agentAutonomyLevel,
    agentResponseFormat: config.ai.agentResponseFormat,
    contentGenerationEnabled: config.ai.contentGenerationEnabled,
    contentModerationLevel: config.ai.contentModerationLevel,
    biAnalyticsEnabled: config.ai.biAnalyticsEnabled,
    biReportFrequency: config.ai.biReportFrequency,
    biInsightThreshold: config.ai.biInsightThreshold,
    biPredictionHorizon: config.ai.biPredictionHorizon,
    learningAdaptationEnabled: config.ai.learningAdaptationEnabled,
    userFeedbackCollection: config.ai.userFeedbackCollection,
    personalizationLevel: config.ai.personalizationLevel,
    contextAwareness: config.ai.contextAwareness,
    multiModalEnabled: config.ai.multiModalEnabled,
    dataRetention: config.ai.dataRetention,
    dataAnonymization: config.ai.dataAnonymization,
    usageAuditLog: config.ai.usageAuditLog,
    contentWatermarking: config.ai.contentWatermarking,
    biasMonitoring: config.ai.biasMonitoring,
    complianceMode: config.ai.complianceMode,
    fallbackMode: config.ai.fallbackMode,
    costTrackingEnabled: config.ai.costTrackingEnabled,
    costBudgetMonthly: config.ai.costBudgetMonthly,
    performanceMetrics: config.ai.performanceMetrics,
    cacheAiResponses: config.ai.cacheAiResponses,
    loadBalancing: config.ai.loadBalancing,
    workflowAutomationEnabled: config.ai.workflowAutomationEnabled,
    apiRateLimitAi: config.ai.apiRateLimitAi,
    schedulerEnabled: config.ai.schedulerEnabled,
    notificationAiEvents: config.ai.notificationAiEvents,
  },
};

async function populateSettings() {
  try {
    const updates = [];
    for (const [category, catSettings] of Object.entries(defaultSettings)) {
      for (const [key, value] of Object.entries(catSettings)) {
        let type = 'string';
        if (typeof value === 'boolean') type = 'boolean';
        else if (typeof value === 'number') type = 'number';
        else if (Array.isArray(value)) type = 'array';
        else if (typeof value === 'object') type = 'object';
        updates.push({ category, key, value, type });
      }
    }
    await db.bulkUpdateSettings(updates);
    logger.info(`Populated ${updates.length} default settings`);
  } catch (error) {
    logger.error('Error populating settings:', error);
  }
}

populateSettings();
