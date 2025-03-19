import { fetchCategories } from '@/app/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await fetchCategories();
  return NextResponse.json(result);
}
