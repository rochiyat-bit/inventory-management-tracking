import { NextRequest } from 'next/server';
import { Product, Category } from '@/lib/db/models';
import { productSchema } from '@/lib/validations';
import { successResponse, notFoundResponse } from '@/lib/utils/api-response';
import { withErrorHandler } from '@/lib/utils/error-handler';
import { withAuth } from '@/lib/auth/middleware';
import { createAuditLog, getIpAddress, getDiff } from '@/lib/utils/audit';

/**
 * GET /api/products/[id]
 * Get product by ID
 */
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;

  const product = await Product.findByPk(id, {
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
    ],
  });

  if (!product) {
    return notFoundResponse('Product not found');
  }

  return successResponse(product);
});

/**
 * PUT /api/products/[id]
 * Update product
 */
export const PUT = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  return withAuth(request, async (req, user) => {
    const { id } = await params;
    const body = await req.json();

    const product = await Product.findByPk(id);

    if (!product) {
      return notFoundResponse('Product not found');
    }

    const oldData = product.toJSON();
    const data = productSchema.partial().parse(body);

    await product.update(data);

    // Create audit log
    const changes = getDiff(oldData, product.toJSON());
    await createAuditLog({
      userId: user.id,
      action: 'UPDATE',
      entityType: 'Product',
      entityId: product.id,
      changes,
      ipAddress: getIpAddress(req),
    });

    return successResponse(product, 'Product updated successfully');
  });
});

/**
 * DELETE /api/products/[id]
 * Delete product (soft delete)
 */
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  return withAuth(request, async (req, user) => {
    const { id } = await params;

    const product = await Product.findByPk(id);

    if (!product) {
      return notFoundResponse('Product not found');
    }

    await product.destroy();

    // Create audit log
    await createAuditLog({
      userId: user.id,
      action: 'DELETE',
      entityType: 'Product',
      entityId: product.id,
      changes: { deleted: product.toJSON() },
      ipAddress: getIpAddress(req),
    });

    return successResponse(null, 'Product deleted successfully');
  });
});
