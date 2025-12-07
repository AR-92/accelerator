import crypto from 'crypto';

// In-memory CSRF token store with proper cleanup
class CsrfTokenStore {
  constructor() {
    this.tokens = new Map();
    this.maxTokens = 10000; // Prevent memory leaks
    this.tokenExpiry = 60 * 60 * 1000; // 1 hour
    this.cleanupInterval = 15 * 60 * 1000; // Cleanup every 15 minutes

    // Periodic cleanup
    setInterval(() => this.cleanup(), this.cleanupInterval);
  }

  generate() {
    const token = crypto.randomBytes(32).toString('hex');
    const now = Date.now();

    // Clean up if we have too many tokens
    if (this.tokens.size >= this.maxTokens) {
      this.cleanup();
    }

    this.tokens.set(token, {
      created: now,
      used: false,
      expires: now + this.tokenExpiry,
    });

    return token;
  }

  verify(token) {
    const tokenData = this.tokens.get(token);

    if (!tokenData) {
      return false;
    }

    const now = Date.now();

    // Check if expired
    if (now > tokenData.expires) {
      this.tokens.delete(token);
      return false;
    }

    // Check if already used
    if (tokenData.used) {
      return false;
    }

    // Mark as used (one-time use)
    tokenData.used = true;
    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [token, data] of this.tokens) {
      if (now > data.expires || data.used) {
        this.tokens.delete(token);
      }
    }
  }

  invalidate(token) {
    this.tokens.delete(token);
  }
}

// Singleton instance
const csrfStore = new CsrfTokenStore();

export const csrfProtection = (req, res, next) => {
  try {
    // Generate CSRF token
    const token = csrfStore.generate();

    // Add token to res.locals for templates
    res.locals.csrfToken = token;

    next();
  } catch (error) {
    console.error('CSRF token generation error:', error);
    res.status(500).json({ error: 'Failed to generate security token' });
  }
};

// Middleware to verify CSRF token
export const verifyCsrfToken = (req, res, next) => {
  const token = req.body._csrf || req.headers['x-csrf-token'];

  if (!token) {
    return res.status(403).json({ error: 'CSRF token missing' });
  }

  // For logout operations, allow token reuse (don't mark as used)
  const isLogout = req.path === '/auth/logout';
  if (isLogout) {
    const tokenData = csrfStore.tokens.get(token);
    if (!tokenData) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    const now = Date.now();
    if (now > tokenData.expires) {
      csrfStore.tokens.delete(token);
      return res.status(403).json({ error: 'Expired CSRF token' });
    }
    // Don't mark as used for logout
  } else {
    // For other operations, use one-time tokens
    if (!csrfStore.verify(token)) {
      return res.status(403).json({ error: 'Invalid or expired CSRF token' });
    }
  }

  next();
};
