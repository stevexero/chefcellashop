import { fetchSizes } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await fetchSizes();
  return NextResponse.json(result);
}
