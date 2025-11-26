import logger from '../../utils/logger.js';
import config from '../../config/index.js';
import db from '../../services/supabase.js';

// Admin Settings
export const getSettings = async (req, res) => {
  try {
    logger.info('Admin settings page accessed');

    // Load settings from DB first, fallback to config
    let dbSettings = {};
    try {
      dbSettings = await db.getAllSettings();
    } catch (error) {
      logger.warn(
        'Failed to load settings from DB, using config fallback:',
        error.message
      );
    }

    // Default settings from config/env
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
        readReplicaUrls: config.database.readReplicaUrls,
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
        authProviders: config.auth.providers,
        passwordResetTokenExpires: config.auth.passwordResetTokenExpires,
        accountLockoutDuration: config.auth.accountLockoutDuration,
        bruteForceProtectionThreshold:
          config.auth.bruteForceProtectionThreshold,
        ipWhitelist: config.auth.ipWhitelist,
        ipBlacklist: config.auth.ipBlacklist,
        sessionCookieSecure: config.auth.sessionCookieSecure,
        sessionCookieHttpOnly: config.auth.sessionCookieHttpOnly,
        csrfProtectionEnabled: config.auth.csrfProtectionEnabled,
        apiKeyRotationPeriod: config.auth.apiKeyRotationPeriod,
        mfaBackupCodesCount: config.auth.mfaBackupCodesCount,
        passwordHistoryCount: config.auth.passwordHistoryCount,
        accountDeactivationGracePeriod:
          config.auth.accountDeactivationGracePeriod,
      },
      email: {
        provider: config.email.provider,
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT) || 587,
        smtpUsername: process.env.SMTP_USERNAME || 'noreply@accelerator.com',
        smtpPassword: '••••••••', // Never expose actual password
        emailNotifications: process.env.EMAIL_NOTIFICATIONS !== 'false',
        fromName: config.email.fromName,
        fromAddress: config.email.fromAddress,
        templatesPath: config.email.templatesPath,
        queueSize: config.email.queueSize,
        retryAttempts: config.email.retryAttempts,
        webhookSecret: config.email.webhookSecret ? '••••••••' : '',
        notificationChannels: config.email.notificationChannels,
        slackWebhookUrl: config.email.slackWebhookUrl ? '••••••••' : '',
        discordWebhookUrl: config.email.discordWebhookUrl ? '••••••••' : '',
        pushNotificationKeys: config.email.pushNotificationKeys
          ? '••••••••'
          : '',
        batchSize: config.email.batchSize,
        rateLimitPerHour: config.email.rateLimitPerHour,
      },
      ui: {
        customCssUrl: config.ui.customCssUrl,
        logoUrl: config.ui.logoUrl,
        faviconUrl: config.ui.faviconUrl,
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
        redisUrl: config.performance.redisUrl ? '••••••••' : '',
        cacheStrategy: config.performance.cacheStrategy,
        cacheCompressionEnabled: config.performance.cacheCompressionEnabled,
        cdnUrl: config.performance.cdnUrl,
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
        sentryDsn: config.logging.sentryDsn ? '••••••••' : '',
        newRelicLicenseKey: config.logging.newRelicLicenseKey ? '••••••••' : '',
        datadogApiKey: config.logging.datadogApiKey ? '••••••••' : '',
        prometheusMetricsEnabled: config.logging.prometheusMetricsEnabled,
        healthCheckEndpoints: config.logging.healthCheckEndpoints,
        errorReportingLevel: config.logging.errorReportingLevel,
        auditLogRetentionDays: config.logging.auditLogRetentionDays,
      },
      api: {
        versioningStrategy: config.api.versioningStrategy,
        webhookSecret: config.api.webhookSecret ? '••••••••' : '',
        thirdPartyApiKeys:
          Object.keys(config.api.thirdPartyApiKeys).length > 0
            ? 'Configured'
            : 'Not configured',
        integrationEndpoints:
          Object.keys(config.api.integrationEndpoints).length > 0
            ? 'Configured'
            : 'Not configured',
        documentationEnabled: config.api.documentationEnabled,
        graphqlEnabled: config.api.graphqlEnabled,
        restApiEnabled: config.api.restApiEnabled,
        websocketEnabled: config.api.websocketEnabled,
        fileStorageProvider: config.api.fileStorageProvider,
        smsProvider: config.api.smsProvider,
      },
      business: {
        projectStatusWorkflow: config.business.projectStatusWorkflow,
        businessModelTemplates: config.business.businessModelTemplates,
        financialCurrencyDefault: config.business.financialCurrencyDefault,
        learningModuleSequence: config.business.learningModuleSequence,
        contentApprovalWorkflow: config.business.contentApprovalWorkflow,
        collaborationToolsEnabled: config.business.collaborationToolsEnabled,
        billingCycleDefault: config.business.billingCycleDefault,
        enterpriseFeaturesEnabled: config.business.enterpriseFeaturesEnabled,
        customWorkflowEngines: config.business.customWorkflowEngines,
        automationRules: config.business.automationRules,
        kpiDashboardConfig: config.business.kpiDashboardConfig,
        reportGenerationSchedule: config.business.reportGenerationSchedule,
      },
      userManagement: {
        rolesDefinitions: config.userManagement.rolesDefinitions,
        permissionMatrix: config.userManagement.permissionMatrix,
        onboardingFlow: config.userManagement.onboardingFlow,
        profileCompletionRequirements:
          config.userManagement.profileCompletionRequirements,
        teamHierarchyEnabled: config.userManagement.teamHierarchyEnabled,
        invitationExpiry: config.userManagement.invitationExpiry,
        bulkImportEnabled: config.userManagement.bulkImportEnabled,
        deactivationPolicy: config.userManagement.deactivationPolicy,
        profilePictureMaxSize: config.userManagement.profilePictureMaxSize,
        bioCharacterLimit: config.userManagement.bioCharacterLimit,
      },
      backup: {
        storageLocation: config.backup.storageLocation,
        encryptionKey: config.backup.encryptionKey ? '••••••••' : '',
        maintenanceWindowSchedule: config.backup.maintenanceWindowSchedule,
        autoUpdateEnabled: config.backup.autoUpdateEnabled,
        dependencyUpdateSchedule: config.backup.dependencyUpdateSchedule,
        databaseMaintenanceScripts: config.backup.databaseMaintenanceScripts,
        logRotationPolicy: config.backup.logRotationPolicy,
        tempFileCleanupInterval: config.backup.tempFileCleanupInterval,
        cacheInvalidationSchedule: config.backup.cacheInvalidationSchedule,
      },
      compliance: {
        gdprComplianceEnabled: config.compliance.gdprComplianceEnabled,
        dataRetentionPolicies: config.compliance.dataRetentionPolicies,
        cookieConsentRequired: config.compliance.cookieConsentRequired,
        privacyPolicyUrl: config.compliance.privacyPolicyUrl,
        termsOfServiceUrl: config.compliance.termsOfServiceUrl,
        dataExportEnabled: config.compliance.dataExportEnabled,
        rightToForgetImplemented: config.compliance.rightToForgetImplemented,
        auditTrailEnabled: config.compliance.auditTrailEnabled,
        complianceReportingSchedule:
          config.compliance.complianceReportingSchedule,
        legalHoldEnabled: config.compliance.legalHoldEnabled,
      },
      ai: {
        provider: config.ai.provider,
        modelDefault: config.ai.modelDefault,
        apiKey: config.ai.apiKey ? '••••••••' : '',
        apiBaseUrl: config.ai.apiBaseUrl,
        temperature: config.ai.temperature,
        maxTokens: config.ai.maxTokens,
        timeout: config.ai.timeout,
        retryAttempts: config.ai.retryAttempts,
        rateLimitRequests: config.ai.rateLimitRequests,
        rateLimitTokens: config.ai.rateLimitTokens,
        agentTypesEnabled: config.ai.agentTypesEnabled,
        agentPersonality: config.ai.agentPersonality,
        agentLanguage: config.ai.agentLanguage,
        agentMemorySize: config.ai.agentMemorySize,
        agentToolsEnabled: config.ai.agentToolsEnabled,
        agentAutonomyLevel: config.ai.agentAutonomyLevel,
        agentResponseFormat: config.ai.agentResponseFormat,
        contentGenerationEnabled: config.ai.contentGenerationEnabled,
        contentModerationLevel: config.ai.contentModerationLevel,
        contentSafetyFilters: config.ai.contentSafetyFilters,
        contentBrandingVoice: config.ai.contentBrandingVoice,
        contentLengthPreferences: config.ai.contentLengthPreferences,
        contentTemplates: config.ai.contentTemplates,
        contentReviewRequired: config.ai.contentReviewRequired,
        biAnalyticsEnabled: config.ai.biAnalyticsEnabled,
        biDataSources: config.ai.biDataSources,
        biReportFrequency: config.ai.biReportFrequency,
        biInsightThreshold: config.ai.biInsightThreshold,
        biPredictionHorizon: config.ai.biPredictionHorizon,
        biMetricsTracking: config.ai.biMetricsTracking,
        biAlertThresholds: config.ai.biAlertThresholds,
        learningAdaptationEnabled: config.ai.learningAdaptationEnabled,
        userFeedbackCollection: config.ai.userFeedbackCollection,
        modelFineTuningSchedule: config.ai.modelFineTuningSchedule,
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
        fallbackProvider: config.ai.fallbackProvider,
        workflowAutomationEnabled: config.ai.workflowAutomationEnabled,
        triggerConditions: config.ai.triggerConditions,
        integrationWebhooks: config.ai.integrationWebhooks,
        apiRateLimitAi: config.ai.apiRateLimitAi,
        schedulerEnabled: config.ai.schedulerEnabled,
        notificationAiEvents: config.ai.notificationAiEvents,
      },
    };

    // Deep merge DB settings with defaults
    const settings = {};
    for (const category in defaultSettings) {
      settings[category] = {
        ...defaultSettings[category],
        ...(dbSettings[category] || {}),
      };
    }

    // Settings categories for filter navigation
    const settingsCategories = [
      { value: 'all', label: 'All Settings', icon: 'settings' },
      { value: 'general', label: 'General', icon: 'settings' },
      { value: 'server', label: 'Server', icon: 'server' },
      { value: 'database', label: 'Database', icon: 'database' },
      { value: 'security', label: 'Security', icon: 'shield' },
      { value: 'email', label: 'Email', icon: 'mail' },
      { value: 'ui', label: 'UI & Appearance', icon: 'palette' },
      { value: 'performance', label: 'Performance', icon: 'zap' },
      { value: 'logging', label: 'Logging', icon: 'file-text' },
      { value: 'business', label: 'Business Logic', icon: 'building' },
      { value: 'userManagement', label: 'User Management', icon: 'users' },
      { value: 'backup', label: 'Backup', icon: 'hard-drive' },
      { value: 'compliance', label: 'Compliance', icon: 'check-circle' },
      { value: 'ai', label: 'AI & LLM', icon: 'brain' },
      { value: 'api', label: 'API', icon: 'code' },
    ];

    // Get active category from query param or default to 'all'
    const activeCategory = req.query.category || 'all';

    res.render('admin/other-pages/settings', {
      title: 'Admin Settings',
      currentPage: 'settings',
      currentSection: 'system',
      settings,
      settingsCategories,
      activeCategory,
      successMessage: req.session?.successMessage,
      errorMessage: req.session?.errorMessage,
    });
    // Clear messages after rendering
    if (req.session) {
      delete req.session.successMessage;
      delete req.session.errorMessage;
    }
  } catch (error) {
    logger.error('Error loading admin settings:', error);
    res.render('admin/other-pages/settings', {
      title: 'Admin Settings',
      currentPage: 'settings',
      currentSection: 'system',
      settings: {},
      successMessage: req.session?.successMessage,
      errorMessage: req.session?.errorMessage,
    });
    // Clear messages
    if (req.session) {
      delete req.session.successMessage;
      delete req.session.errorMessage;
    }
  }
};

// Save settings
export const postSettings = async (req, res) => {
  try {
    logger.info('Saving admin settings');

    const updates = [];
    const categoryMappings = {
      // Map form field names to categories and types
      siteName: { category: 'general', type: 'string' },
      siteDescription: { category: 'general', type: 'string' },
      defaultLanguage: { category: 'general', type: 'string' },
      timezone: { category: 'general', type: 'string' },
      clusterMode: { category: 'server', type: 'boolean' },
      maxWorkers: { category: 'server', type: 'number' },
      healthCheckInterval: { category: 'server', type: 'number' },
      gracefulShutdownTimeout: { category: 'server', type: 'number' },
      requestTimeoutGlobal: { category: 'server', type: 'number' },
      compressionLevel: { category: 'server', type: 'number' },
      staticCacheMaxAge: { category: 'server', type: 'number' },
      trustProxy: { category: 'server', type: 'boolean' },
      connectionRetryAttempts: { category: 'database', type: 'number' },
      connectionRetryDelay: { category: 'database', type: 'number' },
      sslMode: { category: 'database', type: 'string' },
      schemaVersion: { category: 'database', type: 'string' },
      migrationPath: { category: 'database', type: 'string' },
      backupRetentionDays: { category: 'database', type: 'number' },
      backupSchedule: { category: 'database', type: 'string' },
      connectionPoolMin: { category: 'database', type: 'number' },
      connectionPoolMax: { category: 'database', type: 'number' },
      statementTimeout: { category: 'database', type: 'number' },
      idleTimeout: { category: 'database', type: 'number' },
      twoFactorAuth: { category: 'security', type: 'boolean' },
      sessionTimeout: { category: 'security', type: 'number' },
      passwordPolicy: { category: 'security', type: 'boolean' },
      minPasswordLength: { category: 'security', type: 'number' },
      emailProvider: { category: 'email', type: 'string' },
      emailFromName: { category: 'email', type: 'string' },
      emailFromAddress: { category: 'email', type: 'string' },
      smtpHost: { category: 'email', type: 'string' },
      smtpPort: { category: 'email', type: 'number' },
      smtpUsername: { category: 'email', type: 'string' },
      smtpPassword: { category: 'email', type: 'string' },
      emailNotifications: { category: 'email', type: 'boolean' },
      emailQueueSize: { category: 'email', type: 'number' },
      customCssUrl: { category: 'ui', type: 'string' },
      logoUrl: { category: 'ui', type: 'string' },
      primaryColor: { category: 'ui', type: 'string' },
      accentColor: { category: 'ui', type: 'string' },
      fontFamily: { category: 'ui', type: 'string' },
      sidebarCollapsedDefault: { category: 'ui', type: 'boolean' },
      itemsPerPageDefault: { category: 'ui', type: 'number' },
      timezoneDisplayFormat: { category: 'ui', type: 'string' },
      numberFormatLocale: { category: 'ui', type: 'string' },
      currencySymbol: { category: 'ui', type: 'string' },
      dateTimeFormatPreferences: { category: 'ui', type: 'string' },
      redisUrl: { category: 'performance', type: 'string' },
      cacheStrategy: { category: 'performance', type: 'string' },
      cacheCompressionEnabled: { category: 'performance', type: 'boolean' },
      cdnUrl: { category: 'performance', type: 'string' },
      staticAssetsVersion: { category: 'performance', type: 'string' },
      apiResponseCacheTtl: { category: 'performance', type: 'number' },
      databaseQueryCacheTtl: { category: 'performance', type: 'number' },
      sessionStoreType: { category: 'performance', type: 'string' },
      rateLimitStoreType: { category: 'performance', type: 'string' },
      fileUploadMaxSize: { category: 'performance', type: 'number' },
      imageOptimizationQuality: { category: 'performance', type: 'number' },
      logFormat: { category: 'logging', type: 'string' },
      logMaxSize: { category: 'logging', type: 'number' },
      logMaxFiles: { category: 'logging', type: 'number' },
      logTransports: { category: 'logging', type: 'string' },
      sentryDsn: { category: 'logging', type: 'string' },
      newRelicLicenseKey: { category: 'logging', type: 'string' },
      datadogApiKey: { category: 'logging', type: 'string' },
      prometheusMetricsEnabled: { category: 'logging', type: 'boolean' },
      healthCheckEndpoints: { category: 'logging', type: 'string' },
      errorReportingLevel: { category: 'logging', type: 'string' },
      auditLogRetentionDays: { category: 'logging', type: 'number' },
      apiVersioningStrategy: { category: 'api', type: 'string' },
      webhookSecret: { category: 'api', type: 'string' },
      apiDocumentationEnabled: { category: 'api', type: 'boolean' },
      graphqlEnabled: { category: 'api', type: 'boolean' },
      restApiEnabled: { category: 'api', type: 'boolean' },
      websocketEnabled: { category: 'api', type: 'boolean' },
      fileStorageProvider: { category: 'api', type: 'string' },
      smsProvider: { category: 'api', type: 'string' },
      projectStatusWorkflow: { category: 'business', type: 'string' },
      businessModelTemplates: { category: 'business', type: 'string' },
      financialCurrencyDefault: { category: 'business', type: 'string' },
      learningModuleSequence: { category: 'business', type: 'string' },
      contentApprovalWorkflow: { category: 'business', type: 'string' },
      collaborationToolsEnabled: { category: 'business', type: 'boolean' },
      billingCycleDefault: { category: 'business', type: 'string' },
      enterpriseFeaturesEnabled: { category: 'business', type: 'boolean' },
      reportGenerationSchedule: { category: 'business', type: 'string' },
      userRolesDefinitions: { category: 'userManagement', type: 'string' },
      userOnboardingFlow: { category: 'userManagement', type: 'string' },
      profileCompletionRequirements: {
        category: 'userManagement',
        type: 'string',
      },
      teamHierarchyEnabled: { category: 'userManagement', type: 'boolean' },
      userInvitationExpiry: { category: 'userManagement', type: 'number' },
      bulkImportEnabled: { category: 'userManagement', type: 'boolean' },
      userDeactivationPolicy: { category: 'userManagement', type: 'string' },
      profilePictureMaxSize: { category: 'userManagement', type: 'number' },
      bioCharacterLimit: { category: 'userManagement', type: 'number' },
      backupStorageLocation: { category: 'backup', type: 'string' },
      backupEncryptionKey: { category: 'backup', type: 'string' },
      maintenanceWindowSchedule: { category: 'backup', type: 'string' },
      autoUpdateEnabled: { category: 'backup', type: 'boolean' },
      dependencyUpdateSchedule: { category: 'backup', type: 'string' },
      logRotationPolicy: { category: 'backup', type: 'string' },
      tempFileCleanupInterval: { category: 'backup', type: 'number' },
      cacheInvalidationSchedule: { category: 'backup', type: 'string' },
      gdprComplianceEnabled: { category: 'compliance', type: 'boolean' },
      cookieConsentRequired: { category: 'compliance', type: 'boolean' },
      privacyPolicyUrl: { category: 'compliance', type: 'string' },
      termsOfServiceUrl: { category: 'compliance', type: 'string' },
      dataExportEnabled: { category: 'compliance', type: 'boolean' },
      rightToForgetImplemented: { category: 'compliance', type: 'boolean' },
      auditTrailEnabled: { category: 'compliance', type: 'boolean' },
      legalHoldEnabled: { category: 'compliance', type: 'boolean' },
      complianceReportingSchedule: { category: 'compliance', type: 'string' },
      aiProvider: { category: 'ai', type: 'string' },
      aiModelDefault: { category: 'ai', type: 'string' },
      aiApiKey: { category: 'ai', type: 'string' },
      aiApiBaseUrl: { category: 'ai', type: 'string' },
      aiTemperature: { category: 'ai', type: 'number' },
      aiMaxTokens: { category: 'ai', type: 'number' },
      aiTimeout: { category: 'ai', type: 'number' },
      aiRetryAttempts: { category: 'ai', type: 'number' },
      aiRateLimitRequests: { category: 'ai', type: 'number' },
      aiRateLimitTokens: { category: 'ai', type: 'number' },
      agentTypesEnabled: { category: 'ai', type: 'string' },
      agentPersonality: { category: 'ai', type: 'string' },
      agentLanguage: { category: 'ai', type: 'string' },
      agentMemorySize: { category: 'ai', type: 'number' },
      agentToolsEnabled: { category: 'ai', type: 'string' },
      agentAutonomyLevel: { category: 'ai', type: 'string' },
      agentResponseFormat: { category: 'ai', type: 'string' },
      contentGenerationEnabled: { category: 'ai', type: 'boolean' },
      contentModerationLevel: { category: 'ai', type: 'string' },
      contentSafetyFilters: { category: 'ai', type: 'string' },
      contentBrandingVoice: { category: 'ai', type: 'string' },
      contentLengthPreferences: { category: 'ai', type: 'string' },
      contentTemplates: { category: 'ai', type: 'string' },
      contentReviewRequired: { category: 'ai', type: 'boolean' },
      biAnalyticsEnabled: { category: 'ai', type: 'boolean' },
      biReportFrequency: { category: 'ai', type: 'string' },
      biInsightThreshold: { category: 'ai', type: 'number' },
      biPredictionHorizon: { category: 'ai', type: 'number' },
      learningAdaptationEnabled: { category: 'ai', type: 'boolean' },
      userFeedbackCollection: { category: 'ai', type: 'boolean' },
      modelFineTuningSchedule: { category: 'ai', type: 'string' },
      personalizationLevel: { category: 'ai', type: 'string' },
      contextAwareness: { category: 'ai', type: 'boolean' },
      multiModalEnabled: { category: 'ai', type: 'boolean' },
      aiDataRetention: { category: 'ai', type: 'number' },
      aiDataAnonymization: { category: 'ai', type: 'boolean' },
      aiUsageAuditLog: { category: 'ai', type: 'boolean' },
      aiContentWatermarking: { category: 'ai', type: 'boolean' },
      aiBiasMonitoring: { category: 'ai', type: 'boolean' },
      aiComplianceMode: { category: 'ai', type: 'string' },
      aiFallbackMode: { category: 'ai', type: 'string' },
      costTrackingEnabled: { category: 'ai', type: 'boolean' },
      costBudgetMonthly: { category: 'ai', type: 'number' },
      performanceMetrics: { category: 'ai', type: 'boolean' },
      cacheAiResponses: { category: 'ai', type: 'boolean' },
      aiLoadBalancing: { category: 'ai', type: 'boolean' },
      aiFallbackProvider: { category: 'ai', type: 'string' },
      workflowAutomationEnabled: { category: 'ai', type: 'boolean' },
      apiRateLimitAi: { category: 'ai', type: 'number' },
      aiSchedulerEnabled: { category: 'ai', type: 'boolean' },
      notificationAiEvents: { category: 'ai', type: 'boolean' },
    };

    for (const [key, value] of Object.entries(req.body)) {
      if (categoryMappings[key]) {
        const { category, type } = categoryMappings[key];
        let parsedValue = value;
        if (type === 'boolean')
          parsedValue = value === 'on' || value === 'true';
        else if (type === 'number') parsedValue = Number(value);
        updates.push({ category, key, value: parsedValue, type });
      }
    }

    if (updates.length > 0) {
      await db.bulkUpdateSettings(updates);
      logger.info(`Updated ${updates.length} settings`);
    }

    // Redirect back with success message
    if (req.session)
      req.session.successMessage = 'Settings saved successfully!';
    res.redirect('/admin/other-pages/settings');
  } catch (error) {
    logger.error('Error saving settings:', error);
    if (req.session) req.session.errorMessage = 'Failed to save settings.';
    res.redirect('/admin/other-pages/settings');
  }
};
