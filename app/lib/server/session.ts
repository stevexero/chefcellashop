import { sealData, unsealData } from 'iron-session';
import { cookies } from 'next/headers';

const sessionPassword =
  process.env.SESSION_SECRET || 'your-32-char-secret-here';

interface Session {
  cartId?: string | null;
  redirectTo?: string;
  tempUserId?: string | null;
}

export async function getServerSession(): Promise<Session> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return { cartId: null };
  }

  const sessionData = await unsealData(sessionCookie, {
    password: sessionPassword,
  });
  return sessionData as Session;
}

export async function setServerSession(data: Session) {
  const cookieStore = await cookies();
  const sealedData = await sealData(data, { password: sessionPassword });
  cookieStore.set('session', sealedData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}
