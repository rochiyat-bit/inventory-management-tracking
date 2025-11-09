import { NextRequest, NextResponse } from 'next/server';
import { auth } from './index';
import { unauthorizedResponse, forbiddenResponse } from '../utils/api-response';

/**
 * Authentication and Authorization Middleware
 */

/**
 * Middleware to require authentication
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: { id: string; role: string }) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user) {
    return unauthorizedResponse('Authentication required');
  }

  return handler(request, session.user as { id: string; role: string });
}

/**
 * Middleware to require specific roles
 */
export async function withRole(
  request: NextRequest,
  roles: string | string[],
  handler: (request: NextRequest, user: { id: string; role: string }) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user) {
    return unauthorizedResponse('Authentication required');
  }

  const user = session.user as { id: string; role: string };
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(user.role)) {
    return forbiddenResponse('Insufficient permissions');
  }

  return handler(request, user);
}

/**
 * Middleware to check if user is admin
 */
export async function withAdmin(
  request: NextRequest,
  handler: (request: NextRequest, user: { id: string; role: string }) => Promise<NextResponse>
): Promise<NextResponse> {
  return withRole(request, 'admin', handler);
}

/**
 * Middleware to check if user is admin or manager
 */
export async function withManager(
  request: NextRequest,
  handler: (request: NextRequest, user: { id: string; role: string }) => Promise<NextResponse>
): Promise<NextResponse> {
  return withRole(request, ['admin', 'manager'], handler);
}
