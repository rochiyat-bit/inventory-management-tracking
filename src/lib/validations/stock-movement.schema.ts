import { z } from 'zod';

/**
 * Stock Movement Validation Schemas
 */

export const stockMovementSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  type: z.enum(['in', 'out', 'adjustment', 'transfer'], {
    required_error: 'Movement type is required',
  }),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  referenceNumber: z.string().max(50, 'Reference number too long').optional(),
  reason: z.string().max(500, 'Reason too long').optional(),
  fromWarehouseId: z.string().uuid('Invalid source warehouse ID').optional().nullable(),
  toWarehouseId: z.string().uuid('Invalid destination warehouse ID').optional().nullable(),
});

export const stockMovementQuerySchema = z.object({
  productId: z.string().uuid().optional(),
  type: z.enum(['in', 'out', 'adjustment', 'transfer']).optional(),
  warehouseId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'quantity', 'type']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const reportQuerySchema = z.object({
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  warehouseId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  reportType: z.enum(['stock-summary', 'stock-movement', 'low-stock']).default('stock-summary'),
  format: z.enum(['json', 'pdf', 'excel']).default('json'),
});

export type StockMovementInput = z.infer<typeof stockMovementSchema>;
export type StockMovementQuery = z.infer<typeof stockMovementQuerySchema>;
export type ReportQuery = z.infer<typeof reportQuerySchema>;
