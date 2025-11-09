import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

/**
 * API Response Utilities
 * Standardized API response formatting
 */

export function successResponse<T>(data: T, message?: string, status = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message }),
  };
  return NextResponse.json(response, { status });
}

export function errorResponse(error: string, status = 400): NextResponse {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return NextResponse.json(response, { status });
}

export function validationErrorResponse(errors: Record<string, string[]>): NextResponse {
  const response: ApiResponse = {
    success: false,
    error: 'Validation failed',
    data: errors,
  };
  return NextResponse.json(response, { status: 422 });
}

export function notFoundResponse(message = 'Resource not found'): NextResponse {
  return errorResponse(message, 404);
}

export function unauthorizedResponse(message = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = 'Forbidden'): NextResponse {
  return errorResponse(message, 403);
}

export function serverErrorResponse(message = 'Internal server error'): NextResponse {
  return errorResponse(message, 500);
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message?: string
): NextResponse {
  const totalPages = Math.ceil(total / limit);
  const response: ApiResponse<typeof data> = {
    success: true,
    data: {
      data,
      total,
      page,
      limit,
      totalPages,
    },
    ...(message && { message }),
  };
  return NextResponse.json(response);
}
