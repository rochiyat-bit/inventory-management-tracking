import { z } from 'zod';

/**
 * Category Validation Schemas
 */

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  parentId: z.string().uuid('Invalid parent category ID').optional().nullable(),
});

export const updateCategorySchema = categorySchema.partial().extend({
  id: z.string().uuid('Invalid category ID'),
});

export const categoryQuerySchema = z.object({
  search: z.string().optional(),
  parentId: z.string().uuid().optional().nullable(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQuery = z.infer<typeof categoryQuerySchema>;
