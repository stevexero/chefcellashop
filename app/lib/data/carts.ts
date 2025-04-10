import { createClient } from '../../utils/supabase/server';
import { getSession } from '../session';
import { CartItem } from '@/app/types/types';

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
            image_url,
            color_id
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
}
