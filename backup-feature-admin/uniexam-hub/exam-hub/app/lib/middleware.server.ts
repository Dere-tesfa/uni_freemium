// Middleware utilities for React Router v7
// These helpers are used in loaders and actions for authentication and authorization

import { redirect } from 'react-router';
import { authService } from '../services/auth.service';
import { getSession } from './session.server';
import type { User } from './types';

/**
 * Get authenticated user from request
 * Throws error if not authenticated
 */
export async function requireAuth(request: Request): Promise<Omit<User, 'password_hash'>> {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token") || request.headers.get('Authorization')?.replace('Bearer ', '');
  
  try {
    if (!token) throw new Error('No authentication token provided');
    const user = await authService.getUserFromToken(token);
    if (!user) throw new Error('Invalid or expired token');
    return user;
  } catch (error) {
    throw redirect('/auth/login?redirect=' + encodeURIComponent(new URL(request.url).pathname));
  }
}

/**
 * Get authenticated user from request (optional)
 * Returns null if not authenticated instead of throwing
 */
export async function getAuthUser(request: Request): Promise<Omit<User, 'password_hash'> | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token") || request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) return null;
  
  try {
    const user = await authService.getUserFromToken(token);
    return user;
  } catch (error) {
    return null;
  }
}

/**
 * Require admin role
 * Throws error if not authenticated or not admin
 */
export async function requireAdmin(request: Request): Promise<Omit<User, 'password_hash'>> {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token") || request.headers.get('Authorization')?.replace('Bearer ', '');
  
  try {
    if (!token) throw new Error('No authentication token provided');
    const user = await authService.getUserFromToken(token);
    if (!user) throw new Error('Invalid or expired token');
    if (user.role !== 'admin') {
      throw new Response('Forbidden: Admin access required', { status: 403 });
    }
    return user;
  } catch (error) {
    throw redirect('/admin/login');
  }
}

/**
 * Get user ID from request
 * Returns null if not authenticated
 */
export async function getUserId(request: Request): Promise<string | null> {
  const user = await getAuthUser(request);
  return user?.id || null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(request: Request): Promise<boolean> {
  const user = await getAuthUser(request);
  return user !== null;
}

/**
 * Check if user is admin
 */
export async function isAdmin(request: Request): Promise<boolean> {
  const user = await getAuthUser(request);
  return user?.role === 'admin';
}

import {
  jsonResponse,
  errorResponse,
  successResponse,
  getJsonBody,
  getFormData,
  validateRequired
} from './responses';

export {
  jsonResponse,
  errorResponse,
  successResponse,
  getJsonBody,
  getFormData,
  validateRequired
};

/**
 * Handle errors in loaders and actions
 */
export function handleError(error: unknown): Response {
  console.error('Error:', error);

  if (error instanceof Response) {
    return error;
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse('An unexpected error occurred', 500);
}

/**
 * Parse query parameters from request URL
 */
export function getQueryParams(request: Request): URLSearchParams {
  const url = new URL(request.url);
  return url.searchParams;
}

/**
 * Get pagination parameters from query string
 */
export function getPaginationParams(request: Request): {
  page: number;
  limit: number;
  offset: number;
} {
  const params = getQueryParams(request);
  const page = Math.max(1, parseInt(params.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(params.get('limit') || '10')));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Create paginated response
 */
export function paginatedResponse<T = any>(
  data: T[],
  total: number,
  page: number,
  limit: number
): Response {
  const totalPages = Math.ceil(total / limit);
  
  return jsonResponse({
    data,
    pagination: {
      page,
      limit,
      total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    },
  });
}

/**
 * Check if request method is allowed
 */
export function checkMethod(request: Request, allowedMethods: string[]): void {
  if (!allowedMethods.includes(request.method)) {
    throw new Response(
      `Method ${request.method} not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
      { status: 405 }
    );
  }
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * In production, use Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): void {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return;
  }

  if (record.count >= maxRequests) {
    throw new Response('Too many requests. Please try again later.', {
      status: 429,
      headers: {
        'Retry-After': Math.ceil((record.resetAt - now) / 1000).toString(),
      },
    });
  }

  record.count++;
}

/**
 * CORS headers helper
 */
export function corsHeaders(origin: string = '*'): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Handle CORS preflight request
 */
export function handleCors(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }
  return null;
}

/**
 * Cache control headers
 */
export function cacheHeaders(maxAge: number = 3600): HeadersInit {
  return {
    'Cache-Control': `public, max-age=${maxAge}`,
  };
}

/**
 * No cache headers
 */
export function noCacheHeaders(): HeadersInit {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
}
