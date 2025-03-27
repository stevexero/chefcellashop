import { NextResponse } from 'next/server';
import { updateCartQuantityAction } from '@/app/lib/actions/actions';

export async function PUT(request: Request) {
  const formData = await request.formData();
  const result = await updateCartQuantityAction(formData);

  return NextResponse.json(result);
}
