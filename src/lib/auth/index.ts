import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * NextAuth.js v5 Instance
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/**
 * Get current session user
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

/**
 * Require authentication
 * Throws error if user is not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Require specific role
 * Throws error if user doesn't have required role
 */
export async function requireRole(roles: string | string[]) {
  const user = await requireAuth();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }

  return user;
}
