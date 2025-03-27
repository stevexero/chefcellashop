import { NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/client';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return NextResponse.json({ isAuthenticated: !!user });
}
