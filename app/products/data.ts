import { createClient } from '@/app/lib/supabase/server';

export async function fetchProducts() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        '*, product_images(image_url, color_id), product_colors(color:colors(color_id, color_name, color_hex_code)), product_sizes(size:sizes(size_id))'
      );

    if (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch product data.');
    }

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product data.');
  }
}

export async function fetchProductById(id: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        '*, product_images(image_url, color_id), categories(category_id, category_name), product_colors(color:colors(color_id, color_name, color_hex_code)), product_sizes(size_id, price_mod, size:sizes(size_id, size))'
      )
      .eq('product_id', id)
      .single();

    if (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch product details.');
    }

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product details.');
  }
}
