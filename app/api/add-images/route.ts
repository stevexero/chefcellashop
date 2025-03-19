import { addImagesAction } from '@/app/lib/actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await addImagesAction(formData);
  return NextResponse.json(result);
}
