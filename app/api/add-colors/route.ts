import { addColorsAction } from '@/app/lib/actions/actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await addColorsAction(formData);
  return NextResponse.json(result);
}
