import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server Configuration
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clusterMode: process.env.CLUSTER_MODE === 'true',
  maxWorkers: parseInt(process.env.MAX_WORKERS) || 4,
  healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
  gracefulShutdownTimeout:
    parseInt(process.env.GRACEFUL_SHUTDOWN_TIMEOUT) || 30000,
  requestTimeoutGlobal: parseInt(process.env.REQUEST_TIMEOUT_GLOBAL) || 30000,
  compressionLevel: parseInt(process.env.COMPRESSION_LEVEL) || 6,
  staticCacheMaxAge: parseInt(process.env.STATIC_CACHE_MAX_AGE) || 86400000,
  trustProxy: process.env.TRUST_PROXY === 'true',

  // Supabase Configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY, // Server-side key (secret)
    publicKey: process.env.SUPABASE_PUBLIC_KEY, // Client-side key (anon/public)
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Database Configuration
  database: {
    connectionRetryAttempts:
      parseInt(process.env.DB_CONNECTION_RETRY_ATTEMPTS) || 3,
    connectionRetryDelay:
      parseInt(process.env.DB_CONNECTION_RETRY_DELAY) || 1000,
    sslMode: process.env.DB_SSL_MODE || 'require',
    schemaVersion: process.env.DB_SCHEMA_VERSION || '1.0.0',
    migrationPath: process.env.DB_MIGRATION_PATH || './db/migrations',
    backupRetentionDays: parseInt(process.env.DB_BACKUP_RETENTION_DAYS) || 30,
    backupSchedule: process.env.DB_BACKUP_SCHEDULE || '0 2 * * *',
    readReplicaUrls: process.env.DB_READ_REPLICA_URLS
      ? JSON.parse(process.env.DB_READ_REPLICA_URLS)
      : [],
    connectionPoolMin: parseInt(process.env.DB_CONNECTION_POOL_MIN) || 2,
    connectionPoolMax: parseInt(process.env.DB_CONNECTION_POOL_MAX) || 20,
    statementTimeout: parseInt(process.env.DB_STATEMENT_TIMEOUT) || 30000,
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  },

  // Authentication & Security
  auth: {
    providers: process.env.AUTH_PROVIDERS
      ? process.env.AUTH_PROVIDERS.split(',')
      : ['local'],
    passwordResetTokenExpires:
      parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRES) || 3600000,
    accountLockoutDuration:
      parseInt(process.env.ACCOUNT_LOCKOUT_DURATION) || 900000,
    bruteForceProtectionThreshold:
      parseInt(process.env.BRUTE_FORCE_PROTECTION_THRESHOLD) || 5,
    ipWhitelist: process.env.IP_WHITELIST
      ? process.env.IP_WHITELIST.split(',')
      : [],
    ipBlacklist: process.env.IP_BLACKLIST
      ? process.env.IP_BLACKLIST.split(',')
      : [],
    sessionCookieSecure: process.env.SESSION_COOKIE_SECURE === 'true',
    sessionCookieHttpOnly: process.env.SESSION_COOKIE_HTTPONLY !== 'false',
    csrfProtectionEnabled: process.env.CSRF_PROTECTION_ENABLED !== 'false',
    apiKeyRotationPeriod:
      parseInt(process.env.API_KEY_ROTATION_PERIOD) || 7776000000,
    mfaBackupCodesCount: parseInt(process.env.MFA_BACKUP_CODES_COUNT) || 10,
    passwordHistoryCount: parseInt(process.env.PASSWORD_HISTORY_COUNT) || 5,
    accountDeactivationGracePeriod:
      parseInt(process.env.ACCOUNT_DEACTIVATION_GRACE_PERIOD) || 2592000000,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Email & Notification Configuration
  email: {
    provider: process.env.EMAIL_PROVIDER || 'smtp',
    fromName: process.env.EMAIL_FROM_NAME || 'Accelerator',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@accelerator.com',
    templatesPath: process.env.EMAIL_TEMPLATES_PATH || './views/emails',
    queueSize: parseInt(process.env.EMAIL_QUEUE_SIZE) || 1000,
    retryAttempts: parseInt(process.env.EMAIL_RETRY_ATTEMPTS) || 3,
    webhookSecret: process.env.EMAIL_WEBHOOK_SECRET,
    notificationChannels: process.env.NOTIFICATION_CHANNELS
      ? process.env.NOTIFICATION_CHANNELS.split(',')
      : ['email'],
    slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
    pushNotificationKeys: process.env.PUSH_NOTIFICATION_KEYS,
    batchSize: parseInt(process.env.EMAIL_BATCH_SIZE) || 50,
    rateLimitPerHour: parseInt(process.env.EMAIL_RATE_LIMIT_PER_HOUR) || 1000,
  },

  // UI & Appearance
  ui: {
    customCssUrl: process.env.CUSTOM_CSS_URL,
    logoUrl: process.env.LOGO_URL,
    faviconUrl: process.env.FAVICON_URL,
    primaryColor: process.env.PRIMARY_COLOR || '#3b82f6',
    accentColor: process.env.ACCENT_COLOR || '#10b981',
    fontFamily: process.env.FONT_FAMILY || 'Inter, sans-serif',
    sidebarCollapsedDefault: process.env.SIDEBAR_COLLAPSED_DEFAULT === 'true',
    itemsPerPageDefault: parseInt(process.env.ITEMS_PER_PAGE_DEFAULT) || 25,
    timezoneDisplayFormat: process.env.TIMEZONE_DISPLAY_FORMAT || 'long',
    numberFormatLocale: process.env.NUMBER_FORMAT_LOCALE || 'en-US',
    currencySymbol: process.env.CURRENCY_SYMBOL || '$',
    dateTimeFormatPreferences:
      process.env.DATE_TIME_FORMAT_PREFERENCES || 'MM/dd/yyyy hh:mm a',
  },

  // Performance & Caching
  performance: {
    redisUrl: process.env.REDIS_URL,
    cacheStrategy: process.env.CACHE_STRATEGY || 'lru',
    cacheCompressionEnabled: process.env.CACHE_COMPRESSION_ENABLED !== 'false',
    cdnUrl: process.env.CDN_URL,
    staticAssetsVersion: process.env.STATIC_ASSETS_VERSION || '1.0.0',
    apiResponseCacheTtl: parseInt(process.env.API_RESPONSE_CACHE_TTL) || 300,
    databaseQueryCacheTtl:
      parseInt(process.env.DATABASE_QUERY_CACHE_TTL) || 600,
    sessionStoreType: process.env.SESSION_STORE_TYPE || 'memory',
    rateLimitStoreType: process.env.RATE_LIMIT_STORE_TYPE || 'memory',
    fileUploadMaxSize: parseInt(process.env.FILE_UPLOAD_MAX_SIZE) || 10485760,
    imageOptimizationQuality:
      parseInt(process.env.IMAGE_OPTIMIZATION_QUALITY) || 80,
  },

  // Logging & Monitoring
  logging: {
    format: process.env.LOG_FORMAT || 'json',
    maxSize: parseInt(process.env.LOG_MAX_SIZE) || 10485760,
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
    transports: process.env.LOG_TRANSPORTS
      ? process.env.LOG_TRANSPORTS.split(',')
      : ['console', 'file'],
    sentryDsn: process.env.SENTRY_DSN,
    newRelicLicenseKey: process.env.NEW_RELIC_LICENSE_KEY,
    datadogApiKey: process.env.DATADOG_API_KEY,
    prometheusMetricsEnabled: process.env.PROMETHEUS_METRICS_ENABLED === 'true',
    healthCheckEndpoints: process.env.HEALTH_CHECK_ENDPOINTS
      ? process.env.HEALTH_CHECK_ENDPOINTS.split(',')
      : ['/health', '/api/health'],
    errorReportingLevel: process.env.ERROR_REPORTING_LEVEL || 'error',
    auditLogRetentionDays:
      parseInt(process.env.AUDIT_LOG_RETENTION_DAYS) || 365,
  },

  // API & Integration
  api: {
    versioningStrategy: process.env.API_VERSIONING_STRATEGY || 'header',
    webhookSecret: process.env.WEBHOOK_SECRET,
    thirdPartyApiKeys: process.env.THIRD_PARTY_API_KEYS
      ? JSON.parse(process.env.THIRD_PARTY_API_KEYS)
      : {},
    integrationEndpoints: process.env.INTEGRATION_ENDPOINTS
      ? JSON.parse(process.env.INTEGRATION_ENDPOINTS)
      : {},
    documentationEnabled: process.env.API_DOCUMENTATION_ENABLED !== 'false',
    graphqlEnabled: process.env.GRAPHQL_ENABLED === 'true',
    restApiEnabled: process.env.REST_API_ENABLED !== 'false',
    websocketEnabled: process.env.WEBSOCKET_ENABLED === 'true',
    fileStorageProvider: process.env.FILE_STORAGE_PROVIDER || 'local',
    smsProvider: process.env.SMS_PROVIDER,
  },

  // Business Logic Settings
  business: {
    projectStatusWorkflow: process.env.PROJECT_STATUS_WORKFLOW
      ? process.env.PROJECT_STATUS_WORKFLOW.split(',')
      : ['draft', 'in-progress', 'review', 'completed'],
    businessModelTemplates: process.env.BUSINESS_MODEL_TEMPLATES
      ? process.env.BUSINESS_MODEL_TEMPLATES.split(',')
      : ['startup', 'enterprise', 'nonprofit'],
    financialCurrencyDefault: process.env.FINANCIAL_CURRENCY_DEFAULT || 'USD',
    learningModuleSequence: process.env.LEARNING_MODULE_SEQUENCE
      ? process.env.LEARNING_MODULE_SEQUENCE.split(',')
      : ['basics', 'intermediate', 'advanced'],
    contentApprovalWorkflow: process.env.CONTENT_APPROVAL_WORKFLOW || 'auto',
    collaborationToolsEnabled:
      process.env.COLLABORATION_TOOLS_ENABLED !== 'false',
    billingCycleDefault: process.env.BILLING_CYCLE_DEFAULT || 'monthly',
    enterpriseFeaturesEnabled:
      process.env.ENTERPRISE_FEATURES_ENABLED === 'true',
    customWorkflowEngines: process.env.CUSTOM_WORKFLOW_ENGINES
      ? JSON.parse(process.env.CUSTOM_WORKFLOW_ENGINES)
      : [],
    automationRules: process.env.AUTOMATION_RULES
      ? JSON.parse(process.env.AUTOMATION_RULES)
      : [],
    kpiDashboardConfig: process.env.KPI_DASHBOARD_CONFIG
      ? JSON.parse(process.env.KPI_DASHBOARD_CONFIG)
      : {},
    reportGenerationSchedule:
      process.env.REPORT_GENERATION_SCHEDULE || 'weekly',
  },

  // User Management
  userManagement: {
    rolesDefinitions: process.env.USER_ROLES_DEFINITIONS
      ? process.env.USER_ROLES_DEFINITIONS.split(',')
      : ['admin', 'user', 'moderator'],
    permissionMatrix: process.env.PERMISSION_MATRIX
      ? JSON.parse(process.env.PERMISSION_MATRIX)
      : {},
    onboardingFlow: process.env.USER_ONBOARDING_FLOW
      ? process.env.USER_ONBOARDING_FLOW.split(',')
      : ['welcome', 'tutorial', 'setup'],
    profileCompletionRequirements: process.env.PROFILE_COMPLETION_REQUIREMENTS
      ? process.env.PROFILE_COMPLETION_REQUIREMENTS.split(',')
      : ['name', 'email', 'bio'],
    teamHierarchyEnabled: process.env.TEAM_HIERARCHY_ENABLED !== 'false',
    invitationExpiry: parseInt(process.env.USER_INVITATION_EXPIRY) || 604800000,
    bulkImportEnabled: process.env.BULK_USER_IMPORT_ENABLED === 'true',
    deactivationPolicy: process.env.USER_DEACTIVATION_POLICY || 'soft-delete',
    profilePictureMaxSize:
      parseInt(process.env.PROFILE_PICTURE_MAX_SIZE) || 2097152,
    bioCharacterLimit: parseInt(process.env.BIO_CHARACTER_LIMIT) || 500,
  },

  // Backup & Maintenance
  backup: {
    storageLocation: process.env.BACKUP_STORAGE_LOCATION || './backups',
    encryptionKey: process.env.BACKUP_ENCRYPTION_KEY,
    maintenanceWindowSchedule:
      process.env.MAINTENANCE_WINDOW_SCHEDULE || '0 3 * * 0',
    autoUpdateEnabled: process.env.AUTO_UPDATE_ENABLED === 'true',
    dependencyUpdateSchedule:
      process.env.DEPENDENCY_UPDATE_SCHEDULE || 'monthly',
    databaseMaintenanceScripts: process.env.DATABASE_MAINTENANCE_SCRIPTS
      ? JSON.parse(process.env.DATABASE_MAINTENANCE_SCRIPTS)
      : [],
    logRotationPolicy: process.env.LOG_ROTATION_POLICY || 'daily',
    tempFileCleanupInterval:
      parseInt(process.env.TEMP_FILE_CLEANUP_INTERVAL) || 3600000,
    cacheInvalidationSchedule:
      process.env.CACHE_INVALIDATION_SCHEDULE || '0 */6 * * *',
  },

  // Compliance & Legal
  compliance: {
    gdprComplianceEnabled: process.env.GDPR_COMPLIANCE_ENABLED !== 'false',
    dataRetentionPolicies: process.env.DATA_RETENTION_POLICIES
      ? JSON.parse(process.env.DATA_RETENTION_POLICIES)
      : {},
    cookieConsentRequired: process.env.COOKIE_CONSENT_REQUIRED !== 'false',
    privacyPolicyUrl: process.env.PRIVACY_POLICY_URL,
    termsOfServiceUrl: process.env.TERMS_OF_SERVICE_URL,
    dataExportEnabled: process.env.DATA_EXPORT_ENABLED !== 'false',
    rightToForgetImplemented:
      process.env.RIGHT_TO_FORGET_IMPLEMENTED !== 'false',
    auditTrailEnabled: process.env.AUDIT_TRAIL_ENABLED !== 'false',
    complianceReportingSchedule:
      process.env.COMPLIANCE_REPORTING_SCHEDULE || 'quarterly',
    legalHoldEnabled: process.env.LEGAL_HOLD_ENABLED === 'true',
  },

  // AI & LLM Configuration
  ai: {
    provider: process.env.AI_PROVIDER || 'openai',
    modelDefault: process.env.AI_MODEL_DEFAULT || 'gpt-4',
    apiKey: process.env.AI_API_KEY,
    apiBaseUrl: process.env.AI_API_BASE_URL || 'https://api.openai.com/v1',
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
    maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 2000,
    timeout: parseInt(process.env.AI_TIMEOUT) || 30000,
    retryAttempts: parseInt(process.env.AI_RETRY_ATTEMPTS) || 3,
    rateLimitRequests: parseInt(process.env.AI_RATE_LIMIT_REQUESTS) || 60,
    rateLimitTokens: parseInt(process.env.AI_RATE_LIMIT_TOKENS) || 100000,
    agentTypesEnabled: process.env.AGENT_TYPES_ENABLED
      ? process.env.AGENT_TYPES_ENABLED.split(',')
      : ['content-writer', 'business-analyst', 'learning-assistant'],
    agentPersonality: process.env.AGENT_PERSONALITY || 'professional',
    agentLanguage: process.env.AGENT_LANGUAGE || 'en',
    agentMemorySize: parseInt(process.env.AGENT_MEMORY_SIZE) || 10,
    agentToolsEnabled: process.env.AGENT_TOOLS_ENABLED
      ? process.env.AGENT_TOOLS_ENABLED.split(',')
      : ['web-search', 'calculator'],
    agentAutonomyLevel: process.env.AGENT_AUTONOMY_LEVEL || 'supervised',
    agentResponseFormat: process.env.AGENT_RESPONSE_FORMAT || 'markdown',
    contentGenerationEnabled:
      process.env.CONTENT_GENERATION_ENABLED !== 'false',
    contentModerationLevel: process.env.CONTENT_MODERATION_LEVEL || 'medium',
    contentSafetyFilters: process.env.CONTENT_SAFETY_FILTERS
      ? process.env.CONTENT_SAFETY_FILTERS.split(',')
      : ['hate-speech', 'violence', 'misinformation'],
    contentBrandingVoice: process.env.CONTENT_BRANDING_VOICE
      ? process.env.CONTENT_BRANDING_VOICE.split(',')
      : ['professional', 'helpful', 'innovative'],
    contentLengthPreferences: process.env.CONTENT_LENGTH_PREFERENCES
      ? JSON.parse(process.env.CONTENT_LENGTH_PREFERENCES)
      : { short: 300, medium: 800, long: 2000 },
    contentTemplates: process.env.CONTENT_TEMPLATES
      ? JSON.parse(process.env.CONTENT_TEMPLATES)
      : {},
    contentReviewRequired: process.env.CONTENT_REVIEW_REQUIRED !== 'false',
    biAnalyticsEnabled: process.env.BI_ANALYTICS_ENABLED !== 'false',
    biDataSources: process.env.BI_DATA_SOURCES
      ? process.env.BI_DATA_SOURCES.split(',')
      : ['internal'],
    biReportFrequency: process.env.BI_REPORT_FREQUENCY || 'weekly',
    biInsightThreshold: parseFloat(process.env.BI_INSIGHT_THRESHOLD) || 0.8,
    biPredictionHorizon: parseInt(process.env.BI_PREDICTION_HORIZON) || 6,
    biMetricsTracking: process.env.BI_METRICS_TRACKING
      ? process.env.BI_METRICS_TRACKING.split(',')
      : ['revenue', 'growth', 'user-engagement'],
    biAlertThresholds: process.env.BI_ALERT_THRESHOLDS
      ? JSON.parse(process.env.BI_ALERT_THRESHOLDS)
      : {},
    learningAdaptationEnabled:
      process.env.LEARNING_ADAPTATION_ENABLED !== 'false',
    userFeedbackCollection: process.env.USER_FEEDBACK_COLLECTION !== 'false',
    modelFineTuningSchedule:
      process.env.MODEL_FINE_TUNING_SCHEDULE || 'monthly',
    personalizationLevel: process.env.PERSONALIZATION_LEVEL || 'medium',
    contextAwareness: process.env.CONTEXT_AWARENESS !== 'false',
    multiModalEnabled: process.env.MULTI_MODAL_ENABLED === 'true',
    dataRetention: parseInt(process.env.AI_DATA_RETENTION) || 2592000000,
    dataAnonymization: process.env.AI_DATA_ANONYMIZATION !== 'false',
    usageAuditLog: process.env.AI_USAGE_AUDIT_LOG !== 'false',
    contentWatermarking: process.env.AI_CONTENT_WATERMARKING !== 'false',
    biasMonitoring: process.env.AI_BIAS_MONITORING !== 'false',
    complianceMode: process.env.AI_COMPLIANCE_MODE || 'gdpr',
    fallbackMode: process.env.AI_FALLBACK_MODE || 'disabled',
    costTrackingEnabled: process.env.COST_TRACKING_ENABLED !== 'false',
    costBudgetMonthly: parseInt(process.env.COST_BUDGET_MONTHLY) || 100,
    performanceMetrics: process.env.PERFORMANCE_METRICS !== 'false',
    cacheAiResponses: process.env.CACHE_AI_RESPONSES !== 'false',
    loadBalancing: process.env.AI_LOAD_BALANCING === 'true',
    fallbackProvider: process.env.AI_FALLBACK_PROVIDER,
    workflowAutomationEnabled:
      process.env.WORKFLOW_AUTOMATION_ENABLED !== 'false',
    triggerConditions: process.env.TRIGGER_CONDITIONS
      ? JSON.parse(process.env.TRIGGER_CONDITIONS)
      : {},
    integrationWebhooks: process.env.INTEGRATION_WEBHOOKS
      ? JSON.parse(process.env.INTEGRATION_WEBHOOKS)
      : {},
    apiRateLimitAi: parseInt(process.env.API_RATE_LIMIT_AI) || 100,
    schedulerEnabled: process.env.AI_SCHEDULER_ENABLED !== 'false',
    notificationAiEvents: process.env.NOTIFICATION_AI_EVENTS !== 'false',
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  },
};

export default config;
