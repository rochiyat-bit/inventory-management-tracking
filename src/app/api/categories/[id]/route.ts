import { NextRequest } from 'next/server';
import { Category } from '@/lib/db/models';
import { categorySchema } from '@/lib/validations';
import { successResponse, notFoundResponse } from '@/lib/utils/api-response';
import { withErrorHandler } from '@/lib/utils/error-handler';
import { withAuth } from '@/lib/auth/middleware';
import { createAuditLog, getIpAddress, getDiff } from '@/lib/utils/audit';

/**
 * GET /api/categories/[id]
 * Get category by ID
 */
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const category = await Category.findByPk(id, {
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
  });

  if (!category) {
    return notFoundResponse('Category not found');
  }

  return successResponse(category);
});

/**
 * PUT /api/categories/[id]
 * Update category
 */
export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  return withAuth(request, async (req, user) => {
    const { id } = await params;
    const body = await req.json();

    const category = await Category.findByPk(id);

    if (!category) {
      return notFoundResponse('Category not found');
    }

    const oldData = category.toJSON();
    const data = categorySchema.partial().parse(body);

    await category.update(data);

    // Create audit log
    const changes = getDiff(oldData, category.toJSON());
    await createAuditLog({
      userId: user.id,
      action: 'UPDATE',
      entityType: 'Category',
      entityId: category.id,
      changes,
      ipAddress: getIpAddress(req),
    });

    return successResponse(category, 'Category updated successfully');
  });
});

/**
 * DELETE /api/categories/[id]
 * Delete category (soft delete)
 */
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  return withAuth(request, async (req, user) => {
    const { id } = await params;

    const category = await Category.findByPk(id);

    if (!category) {
      return notFoundResponse('Category not found');
    }

    await category.destroy();

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: 'DELETE',
      entityType: 'Category',
      entityId: category.id,
      changes: { deleted: category.toJSON() },
      ipAddress: getIpAddress(req),
    });

    return successResponse(null, 'Category deleted successfully');
  });
});
