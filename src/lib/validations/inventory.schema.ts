import { z } from 'zod';

/**
 * Inventory Validation Schemas
 */

export const inventorySchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  warehouseId: z.string().uuid('Invalid warehouse ID'),
  quantity: z.coerce.number().int().min(0, 'Quantity must be 0 or greater'),
  locationCode: z.string().max(50, 'Location code too long').optional(),
});

export const updateInventorySchema = inventorySchema.partial().extend({
  id: z.string().uuid('Invalid inventory ID'),
});

export const inventoryQuerySchema = z.object({
  productId: z.string().uuid().optional(),
  warehouseId: z.string().uuid().optional(),
  lowStock: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const stockAdjustmentSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  warehouseId: z.string().uuid('Invalid warehouse ID'),
  quantity: z.coerce.number().int(),
  reason: z.string().min(5, 'Reason must be at least 5 characters').max(500, 'Reason too long'),
  referenceNumber: z.string().max(50, 'Reference number too long').optional(),
});

export const stockTransferSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  fromWarehouseId: z.string().uuid('Invalid source warehouse ID'),
  toWarehouseId: z.string().uuid('Invalid destination warehouse ID'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  reason: z.string().max(500, 'Reason too long').optional(),
  referenceNumber: z.string().max(50, 'Reference number too long').optional(),
}).refine((data) => data.fromWarehouseId !== data.toWarehouseId, {
  message: 'Source and destination warehouses must be different',
  path: ['toWarehouseId'],
});

export type InventoryInput = z.infer<typeof inventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type InventoryQuery = z.infer<typeof inventoryQuerySchema>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
export type StockTransferInput = z.infer<typeof stockTransferSchema>;
