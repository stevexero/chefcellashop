import { fetchUserProfileByUserId } from '@/app/lib/data/data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  const result = await fetchUserProfileByUserId(userId);
  return NextResponse.json(result);
}
