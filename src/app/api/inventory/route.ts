import { NextRequest } from 'next/server';
import { Inventory, Product, Warehouse } from '@/lib/db/models';
import { inventoryQuerySchema } from '@/lib/validations';
import { paginatedResponse } from '@/lib/utils/api-response';
import { withErrorHandler } from '@/lib/utils/error-handler';

/**
 * GET /api/inventory
 * List inventory with pagination and filtering
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const query = inventoryQuerySchema.parse({
    productId: searchParams.get('productId'),
    warehouseId: searchParams.get('warehouseId'),
    lowStock: searchParams.get('lowStock'),
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
  });

  const where: { [key: string]: unknown } = {};

  if (query.productId) {
    where.productId = query.productId;
  }

  if (query.warehouseId) {
    where.warehouseId = query.warehouseId;
  }

  const offset = (query.page - 1) * query.limit;

  let inventoryQuery: any = {
    where,
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku', 'barcode', 'minStock', 'reorderPoint'],
      },
      {
        model: Warehouse,
        as: 'warehouse',
        attributes: ['id', 'name', 'code'],
      },
    ],
    limit: query.limit,
    offset,
    order: [['updatedAt', 'DESC']],
  };

  // Low stock filter
  if (query.lowStock) {
    inventoryQuery.include[0].where = {
      reorderPoint: {
        $gte: '$Inventory.quantity$',
      },
    };
  }

  const { count, rows } = await Inventory.findAndCountAll(inventoryQuery);

  return paginatedResponse(rows, count, query.page, query.limit);
});
