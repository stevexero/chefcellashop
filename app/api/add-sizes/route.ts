import { addSizesAction } from '@/app/lib/actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await addSizesAction(formData);
  return NextResponse.json(result);
}
