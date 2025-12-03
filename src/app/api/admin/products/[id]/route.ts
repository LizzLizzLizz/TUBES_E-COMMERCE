import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for product updates
const productUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  price: z.number().positive().finite().optional(),
  stock: z.number().int().nonnegative().finite().optional(),
  images: z.string().optional(),
  categoryId: z.string().optional(),
  variantType: z.string().optional().nullable(),
  variants: z.array(z.object({
    name: z.string().min(1),
    stock: z.string().or(z.number()),
  })).optional(),
});

// PATCH - Update product
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();

    // ✅ SECURITY FIX: Validate input
    const validationResult = productUpdateSchema.safeParse({
      ...body,
      price: body.price ? parseFloat(body.price) : undefined,
      stock: body.stock !== undefined ? parseInt(body.stock, 10) : undefined,
    });

    if (!validationResult.success) {
      return errorResponse(
        'Validation failed: ' + validationResult.error.issues.map(e => e.message).join(', '),
        400
      );
    }

    const { name, description, price, stock, images, categoryId, variantType, variants } = validationResult.data;

    const updateData: any = {};
    
    // ✅ SECURITY FIX: Sanitize text inputs
    if (name) {
      updateData.name = DOMPurify.sanitize(name, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
      });
    }
    
    if (description !== undefined) {
      updateData.description = DOMPurify.sanitize(description, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: []
      });
    }
    
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (images !== undefined) updateData.images = images;
    if (categoryId) updateData.categoryId = categoryId;
    if (variantType !== undefined) updateData.variantType = variantType || null;

    // Handle variant updates: delete all old variants and create new ones
    if (variantType !== undefined) {
      // Delete existing variants
      await (prisma as any).variant.deleteMany({
        where: { productId: id },
      });

      // Create new variants if provided
      if (variants && variants.length > 0) {
        updateData.variants = {
          create: variants.map(v => ({
            name: DOMPurify.sanitize(v.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
            stock: typeof v.stock === 'string' ? parseInt(v.stock, 10) : v.stock,
          })),
        };
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        variants: true,
      } as any,
    });

    return successResponse(product, 'Product updated successfully');
  } catch (error) {
    console.error('Failed to update product:', error);
    return errorResponse('Failed to update product', 500);
  }
}

// DELETE - Delete product
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return errorResponse('Unauthorized', 401);
    }

    // Check if product has any orders
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: id },
    });

    if (orderItems) {
      return errorResponse(
        'Tidak dapat menghapus produk yang sudah memiliki pesanan. Nonaktifkan produk dengan mengubah stok menjadi 0.',
        400
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return successResponse(null, 'Product deleted successfully');
  } catch (error) {
    console.error('Failed to delete product:', error);
    return errorResponse('Failed to delete product', 500);
  }
}
