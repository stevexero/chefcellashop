// import { supabase } from '../utils/supabase';
import { createClient } from '../utils/supabase/server';

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

export async function fetchProducts() {
  const supabase = await createClient();

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
  const supabase = await createClient();

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

// export async function fetchCartByCartId(id: string) {
//
// }
