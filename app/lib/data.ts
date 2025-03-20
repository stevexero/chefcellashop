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
      .select(
        '*, product_images(image_url), product_colors(color:colors(color_id, color_name, color_hex_code)), product_sizes(size:sizes(size_id))'
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
        '*, product_images(image_url), categories(category_id, category_name), product_colors(color:colors(color_id, color_name, color_hex_code)), product_sizes(size_id, price_mod, size:sizes(size_id, size))'
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

// export async function fetchCartByCartId(id: string) {
//
// }
