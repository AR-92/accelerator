import logger from '../../utils/logger.js';
import config from '../../config/index.js';

// System Config Page
export const getSystemConfig = async (req, res) => {
  try {
    logger.info('Admin system config page accessed');

    // Gather current system configuration from config object
    const systemConfig = {
      environment: config.nodeEnv,
      port: config.port,
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
        url: config.supabase.url ? 'Configured' : 'Not configured',
        key: config.supabase.key ? 'Configured' : 'Not configured',
        connectionRetryAttempts: config.database.connectionRetryAttempts,
        connectionRetryDelay: config.database.connectionRetryDelay,
        sslMode: config.database.sslMode,
        schemaVersion: config.database.schemaVersion,
        backupRetentionDays: config.database.backupRetentionDays,
        backupSchedule: config.database.backupSchedule,
        readReplicaUrls:
          config.database.readReplicaUrls.length > 0
            ? 'Configured'
            : 'Not configured',
        connectionPoolMin: config.database.connectionPoolMin,
        connectionPoolMax: config.database.connectionPoolMax,
        statementTimeout: config.database.statementTimeout,
        idleTimeout: config.database.idleTimeout,
      },
      auth: {
        providers: config.auth.providers,
        passwordResetTokenExpires: config.auth.passwordResetTokenExpires,
        accountLockoutDuration: config.auth.accountLockoutDuration,
        bruteForceProtectionThreshold:
          config.auth.bruteForceProtectionThreshold,
        ipWhitelist:
          config.auth.ipWhitelist.length > 0 ? 'Configured' : 'Not configured',
        ipBlacklist:
          config.auth.ipBlacklist.length > 0 ? 'Configured' : 'Not configured',
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
        fromName: config.email.fromName,
        fromAddress: config.email.fromAddress,
        templatesPath: config.email.templatesPath,
        queueSize: config.email.queueSize,
        retryAttempts: config.email.retryAttempts,
        webhookSecret: config.email.webhookSecret
          ? 'Configured'
          : 'Not configured',
        notificationChannels: config.email.notificationChannels,
        slackWebhookUrl: config.email.slackWebhookUrl
          ? 'Configured'
          : 'Not configured',
        discordWebhookUrl: config.email.discordWebhookUrl
          ? 'Configured'
          : 'Not configured',
        pushNotificationKeys: config.email.pushNotificationKeys
          ? 'Configured'
          : 'Not configured',
        batchSize: config.email.batchSize,
        rateLimitPerHour: config.email.rateLimitPerHour,
      },
      performance: {
        redisUrl: config.performance.redisUrl ? 'Configured' : 'Not configured',
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
        sentryDsn: config.logging.sentryDsn ? 'Configured' : 'Not configured',
        newRelicLicenseKey: config.logging.newRelicLicenseKey
          ? 'Configured'
          : 'Not configured',
        datadogApiKey: config.logging.datadogApiKey
          ? 'Configured'
          : 'Not configured',
        prometheusMetricsEnabled: config.logging.prometheusMetricsEnabled,
        healthCheckEndpoints: config.logging.healthCheckEndpoints,
        errorReportingLevel: config.logging.errorReportingLevel,
        auditLogRetentionDays: config.logging.auditLogRetentionDays,
      },
      api: {
        versioningStrategy: config.api.versioningStrategy,
        webhookSecret: config.api.webhookSecret
          ? 'Configured'
          : 'Not configured',
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
        customWorkflowEngines:
          config.business.customWorkflowEngines.length > 0
            ? 'Configured'
            : 'Not configured',
        automationRules:
          config.business.automationRules.length > 0
            ? 'Configured'
            : 'Not configured',
        kpiDashboardConfig:
          Object.keys(config.business.kpiDashboardConfig).length > 0
            ? 'Configured'
            : 'Not configured',
        reportGenerationSchedule: config.business.reportGenerationSchedule,
      },
      userManagement: {
        rolesDefinitions: config.userManagement.rolesDefinitions,
        permissionMatrix:
          Object.keys(config.userManagement.permissionMatrix).length > 0
            ? 'Configured'
            : 'Not configured',
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
        encryptionKey: config.backup.encryptionKey
          ? 'Configured'
          : 'Not configured',
        maintenanceWindowSchedule: config.backup.maintenanceWindowSchedule,
        autoUpdateEnabled: config.backup.autoUpdateEnabled,
        dependencyUpdateSchedule: config.backup.dependencyUpdateSchedule,
        databaseMaintenanceScripts:
          config.backup.databaseMaintenanceScripts.length > 0
            ? 'Configured'
            : 'Not configured',
        logRotationPolicy: config.backup.logRotationPolicy,
        tempFileCleanupInterval: config.backup.tempFileCleanupInterval,
        cacheInvalidationSchedule: config.backup.cacheInvalidationSchedule,
      },
      compliance: {
        gdprComplianceEnabled: config.compliance.gdprComplianceEnabled,
        dataRetentionPolicies:
          Object.keys(config.compliance.dataRetentionPolicies).length > 0
            ? 'Configured'
            : 'Not configured',
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
        apiKey: config.ai.apiKey ? 'Configured' : 'Not configured',
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
        contentTemplates:
          Object.keys(config.ai.contentTemplates).length > 0
            ? 'Configured'
            : 'Not configured',
        contentReviewRequired: config.ai.contentReviewRequired,
        biAnalyticsEnabled: config.ai.biAnalyticsEnabled,
        biDataSources: config.ai.biDataSources,
        biReportFrequency: config.ai.biReportFrequency,
        biInsightThreshold: config.ai.biInsightThreshold,
        biPredictionHorizon: config.ai.biPredictionHorizon,
        biMetricsTracking: config.ai.biMetricsTracking,
        biAlertThresholds:
          Object.keys(config.ai.biAlertThresholds).length > 0
            ? 'Configured'
            : 'Not configured',
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
        triggerConditions:
          Object.keys(config.ai.triggerConditions).length > 0
            ? 'Configured'
            : 'Not configured',
        integrationWebhooks:
          Object.keys(config.ai.integrationWebhooks).length > 0
            ? 'Configured'
            : 'Not configured',
        apiRateLimitAi: config.ai.apiRateLimitAi,
        schedulerEnabled: config.ai.schedulerEnabled,
        notificationAiEvents: config.ai.notificationAiEvents,
      },
      cors: {
        origin: config.cors.origin,
        credentials: true,
      },
      rateLimit: {
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
      },
    };

    res.render('admin/other-pages/system-config', {
      title: 'System Configuration',
      currentPage: 'system-config',
      currentSection: 'system',
      config: systemConfig,
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
