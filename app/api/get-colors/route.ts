import { fetchColors } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await fetchColors();
  return NextResponse.json(result);
}
