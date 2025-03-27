import { createClient } from '@/app/utils/supabase/server';

export async function fetchCategories() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from('categories').select('*');

    if (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch product categories.');
    }

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch categories.');
  }
}
