import pino from 'pino';

/**
 * Minimal logger configuration safe for SSR in React Router
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});
