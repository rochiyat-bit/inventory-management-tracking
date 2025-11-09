import { z } from 'zod';

/**
 * Warehouse Validation Schemas
 */

export const warehouseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name too long'),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(10, 'Code must not exceed 10 characters')
    .regex(/^[A-Z0-9-]+$/, 'Code must contain only uppercase letters, numbers, and hyphens'),
  address: z.string().min(10, 'Address must be at least 10 characters').max(500, 'Address too long'),
  managerId: z.string().uuid('Invalid manager ID').optional().nullable(),
});

export const updateWarehouseSchema = warehouseSchema.partial().extend({
  id: z.string().uuid('Invalid warehouse ID'),
});

export const warehouseQuerySchema = z.object({
  search: z.string().optional(),
  managerId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type WarehouseInput = z.infer<typeof warehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;
export type WarehouseQuery = z.infer<typeof warehouseQuerySchema>;
