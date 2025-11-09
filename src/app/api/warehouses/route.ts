import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { Warehouse, User } from '@/lib/db/models';
import { warehouseSchema, warehouseQuerySchema } from '@/lib/validations';
import { successResponse, paginatedResponse } from '@/lib/utils/api-response';
import { withErrorHandler } from '@/lib/utils/error-handler';
import { withAuth, withManager } from '@/lib/auth/middleware';
import { createAuditLog, getIpAddress } from '@/lib/utils/audit';

/**
 * GET /api/warehouses
 * List warehouses with pagination and filtering
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const query = warehouseQuerySchema.parse({
    search: searchParams.get('search'),
    managerId: searchParams.get('managerId'),
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  });

  const where: { [key: string]: unknown } = {};

  if (query.search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query.search}%` } },
      { code: { [Op.iLike]: `%${query.search}%` } },
      { address: { [Op.iLike]: `%${query.search}%` } },
    ];
  }

  if (query.managerId) {
    where.managerId = query.managerId;
  }

  const offset = (query.page - 1) * query.limit;

  const { count, rows } = await Warehouse.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'manager',
        attributes: ['id', 'name', 'email'],
      },
    ],
    limit: query.limit,
    offset,
    order: [['name', 'ASC']],
  });

  return paginatedResponse(rows, count, query.page, query.limit);
});

/**
 * POST /api/warehouses
 * Create new warehouse (Manager or Admin only)
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  return withManager(request, async (req, user) => {
    const body = await req.json();
    const data = warehouseSchema.parse(body);

    const warehouse = await Warehouse.create(data as any);

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: 'CREATE',
      entityType: 'Warehouse',
      entityId: warehouse.id,
      changes: { created: warehouse.toJSON() },
      ipAddress: getIpAddress(req),
    });

    return successResponse(warehouse, 'Warehouse created successfully', 201);
  });
});
