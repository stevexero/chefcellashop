import { NextResponse } from 'next/server';
import { addItemToCartAction } from '@/app/lib/actions/actions';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await addItemToCartAction(formData);

  if (result instanceof Response) {
    return result;
  }

  return NextResponse.json(result);
}
