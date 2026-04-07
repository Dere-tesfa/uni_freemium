/**
 * Shared response and validation utilities that are client-safe
 */

/**
 * Create JSON response with proper headers (works on server, but safe to import in client components for type reference)
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
