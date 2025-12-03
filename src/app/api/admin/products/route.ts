import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().max(5000, 'Description too long').optional(),
  price: z.number().positive('Price must be positive').finite(),
  stock: z.number().int().nonnegative('Stock must be non-negative').finite(),
  images: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  variantType: z.string().optional(),
  variants: z.array(z.object({
    name: z.string().min(1, 'Variant name required'),
    stock: z.string().or(z.number()),
  })).optional(),
});

// POST - Create new product
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();

    // ✅ SECURITY FIX: Validate input with Zod
    const validationResult = productSchema.safeParse({
      ...body,
      price: parseFloat(body.price),
      stock: parseInt(body.stock, 10),
    });

    if (!validationResult.success) {
      return errorResponse(
        'Validation failed: ' + validationResult.error.issues.map(e => e.message).join(', '),
        400
      );
    }

    const { name, description, price, stock, images, categoryId, variantType, variants } = validationResult.data;

    // ✅ SECURITY FIX: Sanitize text inputs to prevent XSS
    const sanitizedName = DOMPurify.sanitize(name, {
      ALLOWED_TAGS: [],  // Strip all HTML tags
      ALLOWED_ATTR: []
    });

    const sanitizedDescription = DOMPurify.sanitize(description || '', {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],  // Allow basic formatting
      ALLOWED_ATTR: []
    });

    const product = await prisma.product.create({
      data: {
        name: sanitizedName,
        description: sanitizedDescription,
        price,
        stock,
        images: images || '',
        categoryId,
        variantType: variantType || null,
        ...(variantType && variants && variants.length > 0 ? {
          variants: {
            create: variants.map(v => ({
              name: DOMPurify.sanitize(v.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
              stock: typeof v.stock === 'string' ? parseInt(v.stock, 10) : v.stock,
            })),
          },
        } : {}),
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return successResponse(product, 'Product created successfully', 201);
  } catch (error) {
    console.error('Failed to create product:', error);
    return errorResponse('Failed to create product', 500);
  }
}
