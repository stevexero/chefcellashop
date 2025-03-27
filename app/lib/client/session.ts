'use client';

import Cookies from 'js-cookie';

interface Session {
  cartId?: string | null;
  redirectTo?: string;
  tempUserId?: string | null;
}

export function getClientSession(): Session {
  const sessionCookie = Cookies.get('session');
  if (!sessionCookie) {
    return { cartId: null };
  }
  return JSON.parse(sessionCookie);
}

export function setClientSession(data: Session) {
  Cookies.set('session', JSON.stringify(data), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}
