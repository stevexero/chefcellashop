import { NextResponse } from 'next/server';
import { deleteItemFromCartAction } from '@/app/lib/actions/actions';

export async function DELETE(request: Request) {
  const formData = await request.formData();
  const result = await deleteItemFromCartAction(formData);

  return NextResponse.json(result);
}
