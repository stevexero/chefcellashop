import { NextResponse } from 'next/server';
import { createClient } from '@/app/lib/supabase/server';
import crypto from 'crypto';
import { ImapFlow } from 'imapflow';

const ALGO = 'aes-256-gcm';
const KEY = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY!, 'hex');

function decrypt(cipherText: Buffer, iv: Buffer, authTag: Buffer): string {
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(cipherText),
    decipher.final(),
  ]).toString('utf8');
}

export async function GET() {
  try {
    // 1) authenticate
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2) fetch this user's creds
    const { data: cred, error: credErr } = await supabase
      .from('email_credentials')
      .select('*')
      .eq('profile_id', user.id)
      .single();

    if (credErr || !cred) {
      return NextResponse.json(
        { error: 'No email credentials found' },
        { status: 404 }
      );
    }

    // 3) decrypt
    const imapPass = decrypt(
      cred.imap_pass,
      Buffer.from(cred.iv, 'hex'),
      Buffer.from(cred.auth_tag, 'hex')
    );

    // 4) connect & count unread
    const client = new ImapFlow({
      host: 'gcam1014.siteground.biz',
      port: 993,
      secure: true,
      auth: { user: cred.imap_user, pass: imapPass },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      },
    });

    try {
      await client.connect();
      const uids = await client.search({ seen: false });
      return NextResponse.json({ unread: uids.length });
    } catch (err) {
      console.error('IMAP error:', err);
      return NextResponse.json({ error: 'IMAP error' }, { status: 500 });
    } finally {
      await client.logout();
    }
  } catch (error) {
    console.error('Error in unread-count:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
