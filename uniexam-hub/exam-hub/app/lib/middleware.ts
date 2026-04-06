// Middleware utilities for React Router v7
// These helpers are used in loaders and actions for authentication and authorization

import { redirect } from 'react-router';
import { authService } from '../services/auth.service';
import type { User } from './types';

/**
 * Get authenticated user from request
 * Throws error if not authenticated
 */
export async function requireAuth(request: Request): Promise<Omit<User, 'password_hash'>> {
  const authHeader = request.headers.get('Authorization');
  
  try {
    const user = await authService.authenticateRequest(authHeader);
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
  const authHeader = request.headers.get('Authorization');
  
  try {
    const user = await authService.authenticateRequest(authHeader);
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
  const authHeader = request.headers.get('Authorization');
  
  try {
    const user = await authService.requireAdmin(authHeader);
    return user;
  } catch (error) {
    if (error instanceof Error && error.message === 'Admin access required') {
      throw new Response('Forbidden: Admin access required', { status: 403 });
    }
    throw redirect('/auth/login?redirect=' + encodeURIComponent(new URL(request.url).pathname));
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

/**
 * Extract and validate JSON body from request
 */
export async function getJsonBody<T = any>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch (error) {
    throw new Response('Invalid JSON body', { status: 400 });
  }
}

/**
 * Extract and validate form data from request
 */
export async function getFormData(request: Request): Promise<FormData> {
  try {
    return await request.formData();
  } catch (error) {
    throw new Response('Invalid form data', { status: 400 });
  }
}

/**
 * Create JSON response with proper headers
 */
export function jsonResponse<T = any>(data: T, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create error response
 */
export function errorResponse(message: string, status: number = 400): Response {
  return jsonResponse({ error: message }, status);
}

/**
 * Create success response
 */
export function successResponse<T = any>(data: T, message?: string): Response {
  return jsonResponse({
    success: true,
    message,
    data,
  });
}

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
 * Validate required fields in data
 */
export function validateRequired<T extends Record<string, any>>(
  data: T,
  fields: (keyof T)[]
): void {
  const missing = fields.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Response(
      `Missing required fields: ${missing.join(', ')}`,
      { status: 400 }
    );
  }
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
