import crypto from 'crypto';

// Simple CSRF token implementation
export const csrfProtection = (req, res, next) => {
  // Generate CSRF token
  const token = crypto.randomBytes(32).toString('hex');

  // Store token in session (for simplicity, using a Map - in production use proper session store)
  if (!global.csrfTokens) {
    global.csrfTokens = new Map();
  }

  // Clean up old tokens (simple cleanup)
  const now = Date.now();
  for (const [key, data] of global.csrfTokens) {
    if (now - data.created > 3600000) {
      // 1 hour
      global.csrfTokens.delete(key);
    }
  }

  global.csrfTokens.set(token, { created: now, used: false });

  // Add token to res.locals for templates
  res.locals.csrfToken = token;

  next();
};

// Middleware to verify CSRF token
export const verifyCsrfToken = (req, res, next) => {
  const token = req.body._csrf || req.headers['x-csrf-token'];

  if (!token) {
    return res.status(403).json({ error: 'CSRF token missing' });
  }

  if (!global.csrfTokens || !global.csrfTokens.has(token)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  const tokenData = global.csrfTokens.get(token);
  if (tokenData.used) {
    return res.status(403).json({ error: 'CSRF token already used' });
  }

  // Mark token as used
  tokenData.used = true;

  next();
};
