import { addSizeAction } from '@/app/lib/actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const sizeText = await request.text();
  const result = await addSizeAction(sizeText);
  return NextResponse.json(result);
}
