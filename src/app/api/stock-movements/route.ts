import { NextRequest } from 'next/server';
import { Op } from 'sequelize';
import { sequelize } from '@/lib/db';
import { StockMovement, Product, Warehouse, User, Inventory } from '@/lib/db/models';
import {
  stockMovementQuerySchema,
  stockAdjustmentSchema,
  stockTransferSchema,
} from '@/lib/validations';
import { successResponse, paginatedResponse, errorResponse } from '@/lib/utils/api-response';
import { withErrorHandler } from '@/lib/utils/error-handler';
import { withAuth, withManager } from '@/lib/auth/middleware';
import { createAuditLog, getIpAddress } from '@/lib/utils/audit';

/**
 * GET /api/stock-movements
 * List stock movements with pagination and filtering
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const query = stockMovementQuerySchema.parse({
    productId: searchParams.get('productId'),
    type: searchParams.get('type'),
    warehouseId: searchParams.get('warehouseId'),
    startDate: searchParams.get('startDate'),
    endDate: searchParams.get('endDate'),
    page: searchParams.get('page') || '1',
    limit: searchParams.get('limit') || '10',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  });

  const where: { [key: string]: unknown } = {};

  if (query.productId) {
    where.productId = query.productId;
  }

  if (query.type) {
    where.type = query.type;
  }

  if (query.warehouseId) {
    where[Op.or] = [
      { fromWarehouseId: query.warehouseId },
      { toWarehouseId: query.warehouseId },
    ];
  }

  if (query.startDate || query.endDate) {
    where.createdAt = {};
    if (query.startDate) {
      where.createdAt[Op.gte] = new Date(query.startDate);
    }
    if (query.endDate) {
      where.createdAt[Op.lte] = new Date(query.endDate);
    }
  }

  const offset = (query.page - 1) * query.limit;

  const { count, rows } = await StockMovement.findAndCountAll({
    where,
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku', 'barcode'],
      },
      {
        model: Warehouse,
        as: 'fromWarehouse',
        attributes: ['id', 'name', 'code'],
      },
      {
        model: Warehouse,
        as: 'toWarehouse',
        attributes: ['id', 'name', 'code'],
      },
      {
        model: User,
        as: 'creator',
        attributes: ['id', 'name', 'email'],
      },
    ],
    limit: query.limit,
    offset,
    order: [[query.sortBy, query.sortOrder.toUpperCase()]],
  });

  return paginatedResponse(rows, count, query.page, query.limit);
});

/**
 * POST /api/stock-movements/adjustment
 * Stock adjustment (Manager or Admin only)
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(async () => {
    return withManager(request, async (req, user) => {
      const body = await req.json();
      const { type } = body;

      if (type === 'adjustment') {
        return handleStockAdjustment(body, user, req);
      } else if (type === 'transfer') {
        return handleStockTransfer(body, user, req);
      } else {
        return errorResponse('Invalid stock movement type');
      }
    });
  })();
}

/**
 * Handle stock adjustment
 */
async function handleStockAdjustment(
  body: unknown,
  user: { id: string; role: string },
  req: NextRequest
) {
  const data = stockAdjustmentSchema.parse(body);

  const transaction = await sequelize.transaction();

  try {
    // Find or create inventory record
    let inventory = await Inventory.findOne({
      where: {
        productId: data.productId,
        warehouseId: data.warehouseId,
      },
      transaction,
    });

    if (!inventory) {
      inventory = await Inventory.create(
        {
          productId: data.productId,
          warehouseId: data.warehouseId,
          quantity: 0,
        } as any,
        { transaction }
      );
    }

    // Update inventory
    const newQuantity = inventory.quantity + data.quantity;
    if (newQuantity < 0) {
      await transaction.rollback();
      return errorResponse('Insufficient stock for adjustment');
    }

    await inventory.update(
      { quantity: newQuantity, updatedBy: user.id },
      { transaction }
    );

    // Create stock movement record
    const movement = await StockMovement.create(
      {
        productId: data.productId,
        type: 'adjustment',
        quantity: Math.abs(data.quantity),
        reason: data.reason,
        referenceNumber: data.referenceNumber,
        toWarehouseId: data.quantity > 0 ? data.warehouseId : null,
        fromWarehouseId: data.quantity < 0 ? data.warehouseId : null,
        createdBy: user.id,
      } as any,
      { transaction }
    );

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: 'STOCK_ADJUSTMENT',
      entityType: 'Inventory',
      entityId: inventory.id,
      changes: {
        oldQuantity: inventory.quantity - data.quantity,
        newQuantity: inventory.quantity,
        adjustment: data.quantity,
      },
      ipAddress: getIpAddress(req),
    });

    await transaction.commit();

    return successResponse(
      { movement, inventory },
      'Stock adjusted successfully',
      201
    );
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

/**
 * Handle stock transfer
 */
async function handleStockTransfer(
  body: unknown,
  user: { id: string; role: string },
  req: NextRequest
) {
  const data = stockTransferSchema.parse(body);

  const transaction = await sequelize.transaction();

  try {
    // Get source inventory
    const sourceInventory = await Inventory.findOne({
      where: {
        productId: data.productId,
        warehouseId: data.fromWarehouseId,
      },
      transaction,
    });

    if (!sourceInventory || sourceInventory.quantity < data.quantity) {
      await transaction.rollback();
      return errorResponse('Insufficient stock for transfer');
    }

    // Update source inventory
    await sourceInventory.update(
      {
        quantity: sourceInventory.quantity - data.quantity,
        updatedBy: user.id,
      },
      { transaction }
    );

    // Get or create destination inventory
    let destInventory = await Inventory.findOne({
      where: {
        productId: data.productId,
        warehouseId: data.toWarehouseId,
      },
      transaction,
    });

    if (!destInventory) {
      destInventory = await Inventory.create(
        {
          productId: data.productId,
          warehouseId: data.toWarehouseId,
          quantity: 0,
        } as any,
        { transaction }
      );
    }

    // Update destination inventory
    await destInventory.update(
      {
        quantity: destInventory.quantity + data.quantity,
        updatedBy: user.id,
      },
      { transaction }
    );

    // Create stock movement record
    const movement = await StockMovement.create(
      {
        productId: data.productId,
        type: 'transfer',
        quantity: data.quantity,
        reason: data.reason,
        referenceNumber: data.referenceNumber,
        fromWarehouseId: data.fromWarehouseId,
        toWarehouseId: data.toWarehouseId,
        createdBy: user.id,
      } as any,
      { transaction }
    );

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: 'STOCK_TRANSFER',
      entityType: 'Inventory',
      entityId: sourceInventory.id,
      changes: {
        fromWarehouse: data.fromWarehouseId,
        toWarehouse: data.toWarehouseId,
        quantity: data.quantity,
      },
      ipAddress: getIpAddress(req),
    });

    await transaction.commit();

    return successResponse(
      { movement, sourceInventory, destInventory },
      'Stock transferred successfully',
      201
    );
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
