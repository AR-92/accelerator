/**
 * Centralized Configuration Service
 * Manages all environment variables and provides typed access
 */
class ConfigService {
  constructor() {
    this.env = process.env;
  }

  // Server Configuration
  get port() {
    return this.env.PORT || 3000;
  }

  get nodeEnv() {
    return this.env.NODE_ENV || 'development';
  }

  get isProduction() {
    return this.nodeEnv === 'production';
  }

  get isDevelopment() {
    return this.nodeEnv === 'development';
  }

  // Session Configuration
  get sessionSecret() {
    return this.env.SESSION_SECRET || 'your-secret-key-change-in-production';
  }

  // CORS Configuration
  get allowedOrigins() {
    return (
      this.env.ALLOWED_ORIGINS?.split(',') || [
        this.env.BASE_URL || 'http://localhost:3000',
      ]
    );
  }

  get baseUrl() {
    return this.env.BASE_URL || 'http://localhost:3000';
  }

  // Database Configuration
  get dbHost() {
    return this.env.DB_HOST || 'localhost';
  }

  get dbPort() {
    return parseInt(this.env.DB_PORT) || 5432;
  }

  get dbName() {
    return this.env.DB_NAME || 'accelerator_db';
  }

  get dbUser() {
    return this.env.DB_USER || 'postgres';
  }

  get dbPassword() {
    return this.env.DB_PASSWORD || '';
  }

  get dbSsl() {
    return this.env.DB_SSL === 'true';
  }

  // Logging Configuration
  get logLevel() {
    return this.env.LOG_LEVEL || 'info';
  }

  // Database Migration Flag
  get skipDbMigration() {
    return this.env.SKIP_DB_MIGRATION === 'true';
  }
}

module.exports = ConfigService;
