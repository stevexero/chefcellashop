export * from './categories';
export * from './colors';

import { createClient } from '../../utils/supabase/server';
import { getSession } from '../session';

interface ProductImage {
  image_url: string;
}

interface CartItem {
  cart_item_id: string;
  product_id: string;
  size_id: string | null;
  color_id: string | null;
  quantity: number;
  price: number;
  products: { product_name: string }[];
  sizes: { size: string }[] | null;
  colors: { color_name: string }[] | null;
  product_images: ProductImage[];
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

export async function fetchCartItems() {
  const supabase = await createClient();

  // Get authenticated user (if any)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const session = await getSession();
  let cartId = session.cartId;

  if (userId) {
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('cart_id')
      .eq('user_id', userId)
      .single();
    if (cartError && cartError.code !== 'PGRST116')
      throw new Error(cartError.message);
    cartId = cart?.cart_id || null;
  } else if (cartId) {
    const { error: cartError } = await supabase
      .from('carts')
      .select('cart_id')
      .eq('cart_id', cartId)
      .is('user_id', null)
      .single();
    if (cartError && cartError.code !== 'PGRST116') cartId = null;
  }

  if (!cartId) return { items: [], cartId: null };

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
        product_name,
        product_images (
          image_url
        )
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

  if (itemsError) throw new Error(itemsError.message);

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
    product_images: item.products?.[0]?.product_images || [],
  })) as CartItem[];

  return { items: adjustedItems, cartId };

  // Find the cart
  // let cartQueryBuilder = supabase.from('carts').select('cart_id');

  // if (userId) {
  //   cartQueryBuilder = cartQueryBuilder.eq('user_id', userId);
  // } else {
  //   cartQueryBuilder = cartQueryBuilder.is('user_id', null);
  // }

  // const { data: cart, error: cartError } =
  //   (await cartQueryBuilder.single()) as PostgrestSingleResponse<{
  //     cart_id: string;
  //   }>;
  // if (cartError && cartError.code !== 'PGRST116') {
  //   // No rows found is OK
  //   throw new Error(cartError.message);
  // }

  // if (!cart) {
  //   return { items: [], cartId: null }; // Empty cart if none exists
  // }

  // const cartId = cart.cart_id;

  // Fetch cart items with details
  // const { data: items, error: itemsError } = await supabase
  //   .from('cart_items')
  //   .select(
  //     `
  //         cart_item_id,
  //         product_id,
  //         size_id,
  //         color_id,
  //         quantity,
  //         price,
  //         products (
  //           product_name,
  //           product_images (
  //               image_url
  //           )
  //         ),
  //         sizes (
  //           size
  //         ),
  //         colors (
  //           color_name
  //         )
  //       `
  //   )
  //   .eq('cart_id', cartId);

  // if (itemsError) {
  //   throw new Error(itemsError.message);
  // }

  // // Adjust the items to match CartItem interface
  // const adjustedItems = (items || []).map((item) => ({
  //   ...item,
  //   products: Array.isArray(item.products)
  //     ? item.products
  //     : item.products
  //     ? [item.products]
  //     : [],
  //   sizes: item.sizes
  //     ? Array.isArray(item.sizes)
  //       ? item.sizes
  //       : [item.sizes]
  //     : null,
  //   colors: item.colors
  //     ? Array.isArray(item.colors)
  //       ? item.colors
  //       : [item.colors]
  //     : null,
  //   product_images: item.products?.[0]?.product_images || [],
  // })) as CartItem[];

  // return { items: adjustedItems, cartId };
}

// export async function fetchCartByCartId(id: string) {

// }
