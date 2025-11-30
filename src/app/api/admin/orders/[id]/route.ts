import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

// PATCH - Update order status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return errorResponse('Unauthorized', 401);
    }

    const { status } = await req.json();

    if (!status) {
      return errorResponse('Status is required', 400);
    }

    const validStatuses = ['UNPAID', 'PAID', 'PACKED', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return errorResponse('Invalid status', 400);
    }

    const { id } = await params;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return successResponse(order, 'Order status updated successfully');
  } catch (error) {
    console.error('Failed to update order:', error);
    return errorResponse('Failed to update order', 500);
  }
}
