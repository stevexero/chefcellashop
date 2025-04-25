import { createClient } from '@/app/lib/supabase/server';

export async function fetchUserProfileByUserId(id: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('profile_id', id);

    if (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch user profile data.');
    }

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

export async function getOrders() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch orders');
  }

  return data;
}

export async function getProfilesWithEmailRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('email_request_sent', true);

  if (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profiles with email requests');
  }

  return data;
}
