import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/app/lib/actions/orders';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { orderId, status, trackingNumber, trackingCompany } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await updateOrderStatus(
      orderId,
      status,
      trackingNumber,
      trackingCompany
    );

    if (result.error) {
      console.error('Error in updateOrderStatus:', result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in update-order-status route:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
