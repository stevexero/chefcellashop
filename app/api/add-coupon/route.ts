import { addCoupon } from '@/app/dashboard/components/coupons/actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const coupon = await request.json();
  const result = await addCoupon(coupon);
  return NextResponse.json(result);
}
