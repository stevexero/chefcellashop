'use server';

import { createClient } from '@/app/lib/supabase/server';
import { sendEmail } from '@/app/utils/email';
import { generateMailingListEmail } from '@/app/utils/emailTemplates';

export async function addToMailingList(formData: FormData) {
  const email = formData.get('email')?.toString().trim();

  if (!email) {
    return { error: 'Email is required' };
  }

  const supabase = await createClient();

  const { data: existingEmail } = await supabase
    .from('mailing_list')
    .select('email')
    .eq('email', email)
    .single();

  if (existingEmail) {
    return { error: 'This email is already subscribed!' };
  }

  const { data, error } = await supabase
    .from('mailing_list')
    .insert({ email })
    .select()
    .single();

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  await sendEmail({
    user: process.env.SMTP_USER_MAILING_LIST || '',
    from: process.env.SMTP_FROM_MAILING_LIST || '',
    pass: process.env.SMTP_PASSWORD_MAILING_LIST || '',
    to: data.email,
    subject: 'Welcome to the Chef Cella mailing list!',
    html: generateMailingListEmail(data.email),
  });

  return { message: 'Thank you for subscribing!' };
}
