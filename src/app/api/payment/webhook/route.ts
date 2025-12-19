import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import crypto from 'crypto';

// Add GET handler for health check (Midtrans test)
export async function GET() {
  return Response.json({ status: 'ok', message: 'Webhook endpoint is active' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Log incoming webhook for debugging
    console.log('Webhook received:', JSON.stringify(body, null, 2));
    
    const {
      order_id,
      transaction_status,
      status_code,
      fraud_status,
      signature_key,
      gross_amount,
    } = body;

    // Handle Midtrans test notification
    if (!order_id || !transaction_status) {
      console.log('Test notification or missing required fields');
      return Response.json({ status: 'ok', message: 'Test notification received' });
    }

    // Verify signature - Midtrans uses status_code NOT transaction_status
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    
    // Try multiple formats for gross_amount
    const amountInt = String(gross_amount).split('.')[0]; // "170000"
    const amountOriginal = String(gross_amount); // "170000.00"
    
    // Try signature with integer amount
    const expectedSignatureInt = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${amountInt}${serverKey}`)
      .digest('hex');
    
    // Try signature with original amount (with decimals)
    const expectedSignatureOriginal = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${amountOriginal}${serverKey}`)
      .digest('hex');

    const signatureMatch = signature_key === expectedSignatureInt || signature_key === expectedSignatureOriginal;

    console.log('Signature verification:', {
      received: signature_key,
      expectedInt: expectedSignatureInt,
      expectedOriginal: expectedSignatureOriginal,
      order_id,
      status_code,
      transaction_status,
      amountInt,
      amountOriginal,
      serverKey: serverKey.substring(0, 10) + '...',
      matchInt: signature_key === expectedSignatureInt,
      matchOriginal: signature_key === expectedSignatureOriginal,
      match: signatureMatch
    });

    if (!signatureMatch) {
      console.error('Invalid signature');
      // Return 200 but log the error - Midtrans expects 200 even for invalid signatures
      return Response.json({ 
        status: 'error', 
        message: 'Invalid signature' 
      }, { status: 200 });
    }

    // Find order
    console.log('Searching for order:', order_id);
    
    const order = await prisma.order.findFirst({
      where: { id: order_id },
    });

    console.log('Order found:', order ? 'YES' : 'NO', order ? { id: order.id, status: order.status } : null);

    if (!order) {
      console.error('Order not found:', order_id);
      // Return 200 even if order not found - Midtrans expects 200
      return Response.json({ 
        status: 'error', 
        message: 'Order not found' 
      }, { status: 200 });
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

    console.log('Updating order:', { 
      order_id, 
      old_status: order.status, 
      new_status: newStatus,
      transaction_status,
      fraud_status 
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { 
        status: newStatus
      },
    });

    console.log(`Order ${order_id} updated successfully:`, {
      id: updatedOrder.id,
      status: updatedOrder.status
    });

    // Always return 200 status for Midtrans
    return Response.json({
      status: 'success',
      message: 'Webhook processed successfully',
      data: { order_id, status: newStatus }
    }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    // Always return 200 even on error - Midtrans expects this
    return Response.json({
      status: 'error',
      message: 'Webhook processing failed'
    }, { status: 200 });
  }
}
