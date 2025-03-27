import { NextResponse } from 'next/server';
import { createGuestCustomerAction } from '@/app/lib/actions/actions';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await createGuestCustomerAction(formData);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating guest customer:', error);
    return NextResponse.json(
      { error: 'Failed to create guest customer' },
      { status: 500 }
    );
  }
}
