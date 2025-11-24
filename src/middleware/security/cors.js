import cors from 'cors';
import config from '../../config/index.js';

// CORS configuration
export const corsMiddleware = cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'HX-Request',
    'HX-Current-URL',
  ],
});
