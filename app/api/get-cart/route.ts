import { NextResponse } from 'next/server';
import { fetchCartItems } from '@/app/lib/data/carts';

export async function GET() {
  try {
    const { items, cartId } = await fetchCartItems();
    return NextResponse.json({ items, cartId });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}
