import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server Configuration
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Supabase Configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY, // Server-side key (secret)
    publicKey: process.env.SUPABASE_PUBLIC_KEY, // Client-side key (public)
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // UI & Appearance
  ui: {
    primaryColor: process.env.PRIMARY_COLOR || '#3b82f6',
    accentColor: process.env.ACCENT_COLOR || '#10b981',
    fontFamily: process.env.FONT_FAMILY || 'Inter, sans-serif',
  },

  // Performance & Caching
  performance: {
    fileUploadMaxSize: parseInt(process.env.FILE_UPLOAD_MAX_SIZE) || 10485760,
  },

  // Logging & Monitoring
  logging: {
    format: process.env.LOG_FORMAT || 'json',
    maxSize: parseInt(process.env.LOG_MAX_SIZE) || 10485760,
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
    transports: process.env.LOG_TRANSPORTS
      ? process.env.LOG_TRANSPORTS.split(',')
      : ['console', 'file'],
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
