import helmet from 'helmet';

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        'https://wgmuxgylmvrsttdxwarw.supabase.co',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdn.jsdelivr.net',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
        'https://cdnjs.cloudflare.com',
      ],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-hashes'",
        "'unsafe-eval'",
        'https://unpkg.com',
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});
