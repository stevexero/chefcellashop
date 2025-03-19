import { addColorAction } from '@/app/lib/actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const colorNameAndHex = await request.formData();
  const result = await addColorAction(colorNameAndHex);
  return NextResponse.json(result);
}
