import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchProducts() {
  try {
    const products = await supabase.from('products').select('*');

    return products.data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product data.');
  }
}

export async function fetchProductById(id: string) {
  try {
    const product = await supabase
      .from('products')
      .select('*')
      .eq('product_id', id)
      .single();

    return product.data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}
