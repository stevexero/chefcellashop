import crypto from 'crypto';
import { createClient } from '@/app/lib/supabase/server';

const supabase = createClient();

const ALGO = 'aes-256-gcm';
const KEY = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY, 'hex'); // 32 bytes

function encrypt(text) {
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

export default async function handler(req, res) {
  const { imap_user, imap_pass, smtp_user, smtp_pass } = req.body;
  const { user, error: authErr } = await supabase.auth.api.getUserByCookie(req);
  if (authErr || !user) return res.status(401).json({ error: 'Unauthorized' });

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
    .select(); // return the row if you like
  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ ok: true });
}
