import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return errorResponse('Unauthorized', 401);
    }

    const { id: orderId } = await params;

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    // Check if the order belongs to the user
    if (order.user.email !== session.user.email) {
      return errorResponse('Unauthorized', 403);
    }

    // Check if order can be cancelled (only UNPAID or PAID status)
    if (order.status !== 'UNPAID' && order.status !== 'PAID') {
      return errorResponse('Pesanan tidak dapat dibatalkan. Status sudah terlalu lanjut.', 400);
    }

    // Get order items to restore stock
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId },
    });

    // Update order status to CANCELLED and restore stock in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Restore stock for each item
      for (const item of orderItems) {
        if (item.variantId) {
          // Restore variant stock
          await tx.variant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        } else {
          // Restore product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      // Update order status
      return await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });
    });

    return successResponse(updatedOrder, 'Pesanan berhasil dibatalkan');
  } catch (error) {
    console.error('Cancel order error:', error);
    return errorResponse('Failed to cancel order', 500);
  }
}
