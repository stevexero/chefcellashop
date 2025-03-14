import { NextResponse } from 'next/server';
import { updateProfileAction } from '@/app/lib/actions';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await updateProfileAction(formData);
  return NextResponse.json(result);
}
