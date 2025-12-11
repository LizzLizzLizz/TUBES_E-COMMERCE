import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_id,
      transaction_status,
      fraud_status,
      signature_key,
      gross_amount,
    } = body;

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${transaction_status}${gross_amount}${serverKey}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      console.error('Invalid signature');
      return errorResponse('Invalid signature', 403);
    }

    // Find order
    const order = await prisma.order.findFirst({
      where: { id: order_id },
    });

    if (!order) {
      console.error('Order not found:', order_id);
      return errorResponse('Order not found', 404);
    }

    // Update order status based on transaction status
    let newStatus: 'UNPAID' | 'PAID' | 'PACKED' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' = 'UNPAID';

    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        newStatus = 'PAID';
      }
    } else if (transaction_status === 'settlement') {
      newStatus = 'PAID';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny' || transaction_status === 'expire') {
      newStatus = 'CANCELLED';
    } else if (transaction_status === 'pending') {
      newStatus = 'UNPAID';
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: newStatus },
    });

    console.log(`Order ${order_id} updated to status: ${newStatus}`);

    return successResponse(
      { order_id, status: newStatus },
      'Webhook processed successfully'
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return errorResponse('Webhook processing failed', 500);
  }
}
