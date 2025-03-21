import { NextResponse } from 'next/server';
import { fetchCartItems } from '@/app/lib/data';

export async function GET() {
  try {
    const result = await fetchCartItems();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}
