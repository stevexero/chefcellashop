import { createClient } from '@/app/lib/supabase/server';
import crypto from 'crypto';
import { ImapFlow } from 'imapflow';

const supabase = createClient();

const ALGO = 'aes-256-gcm';
const KEY = Buffer.from(process.env.EMAIL_ENCRYPTION_KEY, 'hex');

function decrypt(cipherText, iv, authTag) {
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(cipherText),
    decipher.final(),
  ]).toString('utf8');
}

export default async function handler(req, res) {
  // 1) authenticate
  const { user, error: authErr } = await supabase.auth.api.getUserByCookie(req);
  if (authErr || !user) return res.status(401).json({ error: 'Unauthorized' });

  // 2) fetch this user's creds
  const { data: cred, error: credErr } = await supabase
    .from('email_credentials')
    .select('*')
    .eq('profile_id', user.id)
    .single();
  if (credErr || !cred)
    return res.status(404).json({ error: 'No email credentials found' });

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
  });

  try {
    await client.connect();
    const uids = await client.search({ seen: false });
    return res.status(200).json({ unread: uids.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'IMAP error' });
  } finally {
    await client.logout();
  }
}
