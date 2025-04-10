export * from './categories';
export * from './colors';
export * from './trackOrder';
export * from './products';
export * from './carts';

import { createClient } from '../../utils/supabase/server';

export async function fetchUser() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch user data.');
    }

    return data.session?.user;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user data.');
  }
}

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

export async function fetchSizes() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from('sizes').select('*');

    if (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch sizes data.');
    }

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sizes data.');
  }
}
