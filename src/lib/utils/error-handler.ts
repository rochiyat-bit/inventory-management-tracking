import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from './logger';
import { errorResponse, validationErrorResponse, serverErrorResponse } from './api-response';

/**
 * Centralized error handling for API routes
 */

export function handleError(error: unknown): NextResponse {
  // Log error
  logger.error('API Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    error.errors.forEach((err) => {
      const path = err.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(err.message);
    });
    return validationErrorResponse(errors);
  }

  // Sequelize errors
  if (error && typeof error === 'object' && 'name' in error) {
    const err = error as { name: string; message?: string };

    // Unique constraint violation
    if (err.name === 'SequelizeUniqueConstraintError') {
      return errorResponse('A record with this value already exists', 409);
    }

    // Foreign key constraint violation
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return errorResponse('Referenced record does not exist', 400);
    }

    // Validation error
    if (err.name === 'SequelizeValidationError') {
      return errorResponse(err.message || 'Validation failed', 422);
    }
  }

  // Generic error with message
  if (error instanceof Error) {
    return errorResponse(error.message);
  }

  // Unknown error
  return serverErrorResponse('An unexpected error occurred');
}

/**
 * Async error wrapper for API route handlers
 */
export function withErrorHandler<T extends (...args: unknown[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: unknown[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error);
    }
  }) as T;
}
