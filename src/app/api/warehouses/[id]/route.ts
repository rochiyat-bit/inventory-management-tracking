import { NextRequest } from 'next/server';
import { Warehouse, User } from '@/lib/db/models';
import { warehouseSchema } from '@/lib/validations';
import { successResponse, notFoundResponse } from '@/lib/utils/api-response';
import { withErrorHandler } from '@/lib/utils/error-handler';
import { withManager } from '@/lib/auth/middleware';
import { createAuditLog, getIpAddress, getDiff } from '@/lib/utils/audit';

/**
 * GET /api/warehouses/[id]
 * Get warehouse by ID
 */
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const warehouse = await Warehouse.findByPk(id, {
    include: [
      {
        model: User,
        as: 'manager',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });

  if (!warehouse) {
    return notFoundResponse('Warehouse not found');
  }

  return successResponse(warehouse);
});

/**
 * PUT /api/warehouses/[id]
 * Update warehouse (Manager or Admin only)
 */
export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  return withManager(request, async (req, user) => {
    const { id } = await params;
    const body = await req.json();

    const warehouse = await Warehouse.findByPk(id);

    if (!warehouse) {
      return notFoundResponse('Warehouse not found');
    }

    const oldData = warehouse.toJSON();
    const data = warehouseSchema.partial().parse(body);

    await warehouse.update(data);

    // Create audit log
    const changes = getDiff(oldData, warehouse.toJSON());
    await createAuditLog({
      userId: user.id,
      action: 'UPDATE',
      entityType: 'Warehouse',
      entityId: warehouse.id,
      changes,
      ipAddress: getIpAddress(req),
    });

    return successResponse(warehouse, 'Warehouse updated successfully');
  });
});

/**
 * DELETE /api/warehouses/[id]
 * Delete warehouse (Manager or Admin only)
 */
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  return withManager(request, async (req, user) => {
    const { id } = await params;

    const warehouse = await Warehouse.findByPk(id);

    if (!warehouse) {
      return notFoundResponse('Warehouse not found');
    }

    await warehouse.destroy();

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: 'DELETE',
      entityType: 'Warehouse',
      entityId: warehouse.id,
      changes: { deleted: warehouse.toJSON() },
      ipAddress: getIpAddress(req),
    });

    return successResponse(null, 'Warehouse deleted successfully');
  });
});
