import { NextResponse } from 'next/server';
import { fetchCartItems } from '@/app/checkout/data';

export async function GET() {
  try {
    const { items, cartId } = await fetchCartItems();

    return NextResponse.json({ items, cartId });
  } catch (error) {
    console.error('Error fetching cart:', error);

    return NextResponse.json({ items: [], cartId: null });
  }
}
