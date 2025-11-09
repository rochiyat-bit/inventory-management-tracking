import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { Category } from '@/lib/db/models';
import { categorySchema, categoryQuerySchema } from '@/lib/validations';
import { successResponse, paginatedResponse } from '@/lib/utils/api-response';
import { withErrorHandler } from '@/lib/utils/error-handler';
import { withAuth } from '@/lib/auth/middleware';
import { createAuditLog, getIpAddress } from '@/lib/utils/audit';

/**
 * GET /api/categories
 * List categories with pagination and filtering
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const query = categoryQuerySchema.parse({
    search: searchParams.get('search'),
    parentId: searchParams.get('parentId'),
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  });

  const where: { [key: string]: unknown } = {};

  if (query.search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query.search}%` } },
      { description: { [Op.iLike]: `%${query.search}%` } },
    ];
  }

  if (query.parentId !== undefined) {
    where.parentId = query.parentId;
  }

  const offset = (query.page - 1) * query.limit;

  const { count, rows } = await Category.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: 'parent',
        attributes: ['id', 'name'],
      },
      {
        model: Category,
        as: 'subcategories',
        attributes: ['id', 'name'],
      },
    ],
    limit: query.limit,
    offset,
    order: [['name', 'ASC']],
  });

  return paginatedResponse(rows, count, query.page, query.limit);
});

/**
 * POST /api/categories
 * Create new category
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  return withAuth(request, async (req, user) => {
    const body = await req.json();
    const data = categorySchema.parse(body);

    const category = await Category.create(data as any);

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: 'CREATE',
      entityType: 'Category',
      entityId: category.id,
      changes: { created: category.toJSON() },
      ipAddress: getIpAddress(req),
    });

    return successResponse(category, 'Category created successfully', 201);
  });
});
