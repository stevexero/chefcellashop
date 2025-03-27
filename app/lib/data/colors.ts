import { createClient } from '@/app/utils/supabase/server';

export async function fetchColors() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from('colors').select('*');

    if (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch colors data.');
    }

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch colors data.');
  }
}
