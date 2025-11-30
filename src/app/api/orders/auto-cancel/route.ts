import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Check for authorization header (simple API key for cron jobs)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current time minus 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Find all unpaid orders older than 15 minutes
    const expiredOrders = await prisma.order.findMany({
      where: {
        status: 'UNPAID',
        createdAt: {
          lte: fifteenMinutesAgo,
        },
      },
      include: {
        items: true,
      },
    });

    if (expiredOrders.length === 0) {
      return NextResponse.json({
        message: 'No expired orders found',
        cancelled: 0,
      });
    }

    // Cancel orders and restore stock in transactions
    const cancelledOrderIds: string[] = [];
    
    for (const order of expiredOrders) {
      try {
        await prisma.$transaction(async (tx) => {
          // Restore stock for each item
          for (const item of order.items) {
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

          // Update order status to CANCELLED
          await tx.order.update({
            where: { id: order.id },
            data: { status: 'CANCELLED' },
          });
        });

        cancelledOrderIds.push(order.id);
      } catch (error) {
        console.error(`Failed to cancel order ${order.id}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Expired orders cancelled successfully',
      cancelled: cancelledOrderIds.length,
      orderIds: cancelledOrderIds,
    });
  } catch (error) {
    console.error('Error in auto-cancel cron:', error);
    return NextResponse.json(
      { error: 'Error cancelling expired orders' },
      { status: 500 }
    );
  }
}

// Also allow GET for manual testing
export async function GET(request: Request) {
  return POST(request);
}
