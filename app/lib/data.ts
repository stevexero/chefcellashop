import { supabase } from '../utils/supabase';

export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(image_url)');

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
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(image_url), product_sizes(size)')
      .eq('product_id', id)
      .single();

    if (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch product details.');
    }

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}
