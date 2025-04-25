import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/app/lib/supabase/server';

const ALGO = 'aes-256-gcm';
const KEY = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY!, 'hex'); // 32 bytes

interface EncryptedData {
  cipher_text: Buffer;
  iv: Buffer;
  auth_tag: Buffer;
}

function encrypt(text: string): EncryptedData {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return {
    cipher_text: encrypted,
    iv,
    auth_tag: authTag,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { imap_user, imap_pass, smtp_user, smtp_pass } = await req.json();
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const imapEnc = encrypt(imap_pass);
    const smtpEnc = smtp_pass
      ? encrypt(smtp_pass)
      : { cipher_text: null, iv: null, auth_tag: null };

    const { error } = await supabase
      .from('email_credentials')
      .upsert({
        profile_id: user.id,
        imap_user,
        imap_pass: imapEnc.cipher_text,
        smtp_user,
        smtp_pass: smtpEnc.cipher_text,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in save-mail-creds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
