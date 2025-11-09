import { z } from 'zod';

/**
 * Product Validation Schemas
 */

export const productSchema = z.object({
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU must not exceed 50 characters')
    .regex(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens'),
  barcode: z
    .string()
    .min(8, 'Barcode must be at least 8 characters')
    .max(50, 'Barcode must not exceed 50 characters')
    .optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  unit: z.string().min(1, 'Unit is required').max(20, 'Unit too long').default('pcs'),
  minStock: z.coerce.number().int().min(0, 'Min stock must be 0 or greater').default(0),
  maxStock: z.coerce.number().int().min(1, 'Max stock must be at least 1').default(1000),
  reorderPoint: z.coerce.number().int().min(0, 'Reorder point must be 0 or greater').default(10),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const updateProductSchema = productSchema.partial().extend({
  id: z.string().uuid('Invalid product ID'),
});

export const productQuerySchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'sku', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const bulkProductImportSchema = z.array(
  z.object({
    sku: z.string().min(3).max(50),
    barcode: z.string().min(8).max(50).optional(),
    name: z.string().min(2).max(255),
    description: z.string().max(1000).optional(),
    categoryId: z.string().uuid(),
    unit: z.string().min(1).max(20).default('pcs'),
    minStock: z.number().int().min(0).default(0),
    maxStock: z.number().int().min(1).default(1000),
    reorderPoint: z.number().int().min(0).default(10),
    status: z.enum(['active', 'inactive']).default('active'),
  })
);

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
export type BulkProductImport = z.infer<typeof bulkProductImportSchema>;
