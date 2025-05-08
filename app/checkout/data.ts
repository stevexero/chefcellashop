import { createClient } from '@/app/lib/supabase/server';
import { getSession } from '@/app/lib/session';
import { CartItem } from '@/app/types/types';

export async function fetchCartItems() {
  const supabase = await createClient();

  const session = await getSession();
  let cartId = session.cartId;

  const { error: cartError } = await supabase
    .from('carts')
    .select('cart_id')
    .eq('cart_id', cartId)
    .is('user_id', null)
    .single();
  if (cartError && cartError.code !== 'PGRST116') cartId = null;

  if (!cartId) return { items: [], cartId: null };

  const { data: items, error: itemsError } = await supabase
    .from('cart_items')
    .select(
      `*,
        cart_item_id,
        cart_id,
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
        ),
        coupon_id,
        old_price,
        coupons (
          coupon_id,
          code
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
    coupon: item.coupons
      ? Array.isArray(item.coupons)
        ? item.coupons
        : [item.coupons]
      : null,
    product_images: item.products?.[0]?.product_images || [],
  })) as CartItem[];

  return { items: adjustedItems, cartId };
}
