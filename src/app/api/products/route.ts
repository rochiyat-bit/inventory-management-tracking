import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { Product, Category } from '@/lib/db/models';
import { productSchema, productQuerySchema } from '@/lib/validations';
import { successResponse, paginatedResponse } from '@/lib/utils/api-response';
import { withErrorHandler } from '@/lib/utils/error-handler';
import { withAuth } from '@/lib/auth/middleware';
import { generateNextBarcode } from '@/lib/utils/barcode';
import { createAuditLog, getIpAddress } from '@/lib/utils/audit';

/**
 * GET /api/products
 * List products with pagination and filtering
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const query = productQuerySchema.parse({
    search: searchParams.get('search'),
    categoryId: searchParams.get('categoryId'),
    status: searchParams.get('status'),
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  });

  const where: { [key: string]: unknown } = {};

  if (query.search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${query.search}%` } },
      { sku: { [Op.iLike]: `%${query.search}%` } },
      { barcode: { [Op.iLike]: `%${query.search}%` } },
    ];
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.status) {
    where.status = query.status;
  }

  const offset = (query.page - 1) * query.limit;

  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
    ],
    limit: query.limit,
    offset,
    order: [[query.sortBy, query.sortOrder.toUpperCase()]],
  });

  return paginatedResponse(rows, count, query.page, query.limit);
});

/**
 * POST /api/products
 * Create new product
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  return withAuth(request, async (req, user) => {
    const body = await req.json();

    // Generate barcode if not provided
    if (!body.barcode) {
      const lastProduct = await Product.findOne({
        order: [['createdAt', 'DESC']],
      });
      body.barcode = generateNextBarcode(lastProduct?.barcode);
    }

    const data = productSchema.parse(body);

    const product = await Product.create(data as any);

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: 'CREATE',
      entityType: 'Product',
      entityId: product.id,
      changes: { created: product.toJSON() },
      ipAddress: getIpAddress(req),
    });

    return successResponse(product, 'Product created successfully', 201);
  });
});
