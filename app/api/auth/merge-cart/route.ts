import { NextResponse } from 'next/server';
import { mergeGuestCart } from '@/app/lib/actions/actions';
import { getSession, setSession } from '@/app/lib/session';
import { headers } from 'next/headers';

export async function GET() {
  try {
    await mergeGuestCart();
    const session = await getSession();
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const redirectTo =
      'redirectTo' in session && session.redirectTo
        ? session.redirectTo
        : '/dashboard';

    // Clear the redirectTo from session
    await setSession({ redirectTo: undefined });

    return NextResponse.redirect(new URL(redirectTo, baseUrl));
  } catch (error) {
    console.error('Error merging cart:', error);
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    return NextResponse.redirect(new URL('/dashboard', baseUrl));
  }
}
