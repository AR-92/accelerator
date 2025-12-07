import logger from '../utils/logger.js';

// Simple in-memory cache for HTMX responses
class HtmxCache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  get(key) {
    const item = this.cache.get(key);
    if (item && Date.now() - item.timestamp < item.ttl) {
      return item.data;
    }
    // Remove expired item
    if (item) this.cache.delete(key);
    return null;
  }

  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  clear() {
    this.cache.clear();
  }

  // Clean up expired entries periodically
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp >= item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

const htmxCache = new HtmxCache();

// Clean up expired cache entries every 10 minutes
setInterval(() => htmxCache.cleanup(), 10 * 60 * 1000);

// HTMX caching middleware
export const htmxCacheMiddleware = (ttl = 300000) => {
  // 5 minutes default
  return (req, res, next) => {
    // Only cache HTMX requests
    if (!req.headers['hx-request']) return next();

    const cacheKey = `${req.method}:${req.originalUrl}:${req.user?.id || 'anonymous'}`;
    const cached = htmxCache.get(cacheKey);

    if (cached) {
      logger.debug(`HTMX cache hit: ${cacheKey}`);
      res.set('X-HTMX-Cache', 'HIT');
      res.send(cached);
      return;
    }

    // Intercept the response
    const originalSend = res.send;
    res.send = function (data) {
      // Cache the response
      htmxCache.set(cacheKey, data, ttl);
      res.set('X-HTMX-Cache', 'MISS');
      originalSend.call(this, data);
    };

    next();
  };
};

// Clear HTMX cache for a user
export const clearUserHtmxCache = (userId) => {
  const keysToDelete = [];
  for (const key of htmxCache.cache.keys()) {
    if (key.includes(`:${userId}:`)) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach((key) => htmxCache.cache.delete(key));
  logger.info(`Cleared HTMX cache for user: ${userId}`);
};

// Clear all HTMX cache
export const clearAllHtmxCache = () => {
  htmxCache.clear();
  logger.info('Cleared all HTMX cache');
};
