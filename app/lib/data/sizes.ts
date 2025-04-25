import { createClient } from '@/app/lib/supabase/server';

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
