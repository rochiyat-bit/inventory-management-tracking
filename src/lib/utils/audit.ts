import { AuditLog } from '../db/models';
import { logger } from './logger';

/**
 * Audit logging utilities
 */

interface AuditLogData {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await AuditLog.create({
      ...data,
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Failed to create audit log:', error);
    // Don't throw error to prevent disrupting the main operation
  }
}

/**
 * Get diff between old and new objects
 */
export function getDiff<T extends Record<string, unknown>>(
  oldObj: T,
  newObj: T
): Record<string, { old: unknown; new: unknown }> {
  const changes: Record<string, { old: unknown; new: unknown }> = {};

  Object.keys(newObj).forEach((key) => {
    if (oldObj[key] !== newObj[key]) {
      changes[key] = {
        old: oldObj[key],
        new: newObj[key],
      };
    }
  });

  return changes;
}

/**
 * Extract IP address from request
 */
export function getIpAddress(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return realIp || undefined;
}
