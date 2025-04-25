'use server';

import { createClient } from '@/app/lib/supabase/server';

export async function unsubscribe(formData: FormData) {
  const email = formData.get('email')?.toString().trim();
  const supabase = await createClient();

  if (!email) {
    return { error: 'Email is required' };
  }

  const { data: existingEmail } = await supabase
    .from('mailing_list')
    .select('email')
    .eq('email', email)
    .single();

  if (!existingEmail) {
    return { error: 'Email not found in our mailing list' };
  }

  const { error } = await supabase
    .from('mailing_list')
    .delete()
    .eq('email', existingEmail.email);

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  return { message: 'You have been unsubscribed from the mailing list' };
}
