import { createClient } from '../utils/supabase/server';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

interface CartItem {
  cart_item_id: string;
  product_id: string;
  size_id: string | null;
  color_id: string | null;
  quantity: number;
  price: number;
  products: { product_name: string }[]; // Changed to array
  sizes: { size: string }[] | null; // Changed to array or null
  colors: { color_name: string }[] | null; // Changed to array or null
}

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

export async function fetchCartItems() {
  const supabase = await createClient();

  // Get authenticated user (if any)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id || null;

  // Find the cart
  let cartQueryBuilder = supabase.from('carts').select('cart_id');

  if (userId) {
    cartQueryBuilder = cartQueryBuilder.eq('user_id', userId);
  } else {
    cartQueryBuilder = cartQueryBuilder.is('user_id', null);
  }

  const { data: cart, error: cartError } =
    (await cartQueryBuilder.single()) as PostgrestSingleResponse<{
      cart_id: string;
    }>;
  if (cartError && cartError.code !== 'PGRST116') {
    // No rows found is OK
    throw new Error(cartError.message);
  }

  if (!cart) {
    return { items: [] }; // Empty cart if none exists
  }

  const cartId = cart.cart_id;

  // Fetch cart items with details
  const { data: items, error: itemsError } = await supabase
    .from('cart_items')
    .select(
      `
          cart_item_id,
          product_id,
          size_id,
          color_id,
          quantity,
          price,
          products (
            product_name
          ),
          sizes (
            size
          ),
          colors (
            color_name
          )
        `
    )
    .eq('cart_id', cartId);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  // Adjust the items to match CartItem interface
  const adjustedItems = (items || []).map((item) => ({
    ...item,
    products: Array.isArray(item.products)
      ? item.products
      : item.products
      ? [item.products]
      : [],
    sizes: item.sizes
      ? Array.isArray(item.sizes)
        ? item.sizes
        : [item.sizes]
      : null,
    colors: item.colors
      ? Array.isArray(item.colors)
        ? item.colors
        : [item.colors]
      : null,
  })) as CartItem[];

  return { items: adjustedItems };
}

// export async function fetchCartByCartId(id: string) {

// }
