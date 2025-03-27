import { NextResponse } from 'next/server';
import { createAddressAction } from '@/app/lib/actions/actions';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const result = await createAddressAction(formData);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    );
  }
}
