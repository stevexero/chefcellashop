'use server';

import { createClient } from '@/app/utils/supabase/server';

export async function createGuestCustomerAction(formData: FormData) {
  const email = formData.get('email') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  const supabase = await createClient();

  const { data: existingUser, error: fetchError } = await supabase
    .from('temp_users')
    .select('temp_user_id')
    .eq('email', email)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { error: fetchError.message };
  }

  if (existingUser) {
    return {
      message: 'Existing customer found',
      userId: existingUser.temp_user_id,
    };
  }

  const { data, error } = await supabase
    .from('temp_users')
    .insert([
      {
        email,
        first_name: firstName,
        last_name: lastName,
      },
    ])
    .select('temp_user_id')
    .single();

  if (error) return { error: error.message };

  return {
    message: 'Guest customer created successfully',
    userId: data.temp_user_id,
  };
}

export async function setCustomerCookiesAction(formData: FormData) {
  const email = formData.get('email') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  const cookies = new Headers();
  cookies.append(
    'Set-Cookie',
    `chefCellaCustomerEmail=${email}; Path=/; Max-Age=2592000`
  );
  cookies.append(
    'Set-Cookie',
    `chefCellaCustomerFirstName=${firstName}; Path=/; Max-Age=2592000`
  );
  cookies.append(
    'Set-Cookie',
    `chefCellaCustomerLastName=${lastName}; Path=/; Max-Age=2592000`
  );

  return { success: true };
}
