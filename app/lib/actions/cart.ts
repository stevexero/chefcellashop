'use server';

import { createClient } from '@/app/lib/supabase/server';
import { getSession, setSession } from '../session';

/********************/
/* Add Item To Cart */
/********************/
export async function addItemToCartAction(formData: FormData) {
  const productId = formData.get('productId') as string;
  const colorId = (formData.get('colorId') as string | null) || null;
  const quantityStr = formData.get('quantity') as string;
  const quantity = parseInt(quantityStr, 10) || 1;
  let sizeId = (formData.get('sizeId') as string | null) || null;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const session = await getSession();
  let cartId = session.cartId;

  // 1) Determine unit price
  const { data: product, error } = await supabase
    .from('products')
    .select('base_price')
    .eq('product_id', productId)
    .single();

  if (error) {
    return { error: error.message };
  }

  if (sizeId === 'one-size') {
    sizeId = null;
  }

  let price = product.base_price;
  if (sizeId) {
    const { data: sizeMod, error: sizeError } = await supabase
      .from('product_sizes')
      .select('price_mod')
      .eq('product_id', productId)
      .eq('size_id', sizeId)
      .single();
    if (sizeError && sizeError.code !== 'PGRST116') {
      return { error: sizeError.message };
    }
    price = product.base_price + (sizeMod?.price_mod || 0);
  }

  // 2) Resolve or create cart
  if (userId) {
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('cart_id')
      .eq('user_id', userId)
      .single();

    if (cartError && cartError.code !== 'PGRST116')
      return { error: cartError.message };
    cartId = cart?.cart_id;
  } else if (cartId) {
    const { error: cartError } = await supabase
      .from('carts')
      .select('cart_id')
      .eq('cart_id', cartId)
      .is('user_id', null)
      .single();

    if (cartError && cartError.code !== 'PGRST116') {
      cartId = null;
      await setSession({ cartId: undefined });
    }
  }

  if (!cartId) {
    console.log('Creating new cart...');
    const { data: newCart, error: newCartError } = await supabase
      .from('carts')
      .insert([{ user_id: userId }])
      .select('cart_id')
      .single();

    if (newCartError) {
      console.error('Error creating cart:', newCartError);
      return { error: newCartError.message };
    }

    console.log('New cart created:', newCart);
    cartId = newCart.cart_id;

    if (!userId) {
      console.log('Setting session with cartId:', cartId);
      await setSession({ cartId });
    }
  } else {
    // Verify cart exists
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('cart_id')
      .eq('cart_id', cartId)
      .single();

    if (cartError || !cart) {
      console.log('Cart not found, creating new one...');
      // Cart doesn't exist, create a new one
      const { data: newCart, error: newCartError } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select('cart_id')
        .single();

      if (newCartError) {
        console.error('Error creating new cart:', newCartError);
        return { error: newCartError.message };
      }

      cartId = newCart.cart_id;
      if (!userId) {
        await setSession({ cartId });
      }
    }
  }

  // 3) Upsert cart_items row
  let cartItemId: string;
  const { data: existingItem, error: fetchError } = await supabase
    .from('cart_items')
    .select('cart_item_id, quantity')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .match({ size_id: sizeId, color_id: colorId })
    .single();

  if (fetchError && fetchError.code !== 'PGRST116')
    return { error: fetchError.message };

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('cart_item_id', existingItem.cart_item_id);

    if (updateError) return { error: updateError.message };

    cartItemId = existingItem.cart_item_id;
  } else {
    const { data, error } = await supabase
      .from('cart_items')
      .insert([
        {
          cart_id: cartId,
          product_id: productId,
          size_id: sizeId,
          color_id: colorId,
          quantity,
          price,
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error inserting cart item:', error);
      return { error: error.message };
    }

    cartItemId = data.cart_item_id;
  }

  // 4) Look for an existing coupon on any item in this cart
  const { data: existingCouponRow, error: couponFetchErr } = await supabase
    .from('cart_items')
    .select('coupon_id')
    .eq('cart_id', cartId)
    .not('coupon_id', 'is', null)
    .limit(1)
    .maybeSingle();
  if (couponFetchErr) {
    console.error('Error fetching existing coupon:', couponFetchErr);
  }

  console.log('========== existingCouponRow ==========', existingCouponRow);

  // only continue if there really is one
  if (existingCouponRow?.coupon_id) {
    const couponId = existingCouponRow.coupon_id;

    console.log('========== couponId ==========', couponId);

    // 5) Fetch coupon rules
    const { data: coupon, error: couponErr } = await supabase
      .from('coupons')
      .select('type, amount_off, percent_off')
      .eq('coupon_id', couponId)
      .single();

    console.log('========== coupon ==========', coupon);

    if (!couponErr && coupon) {
      // 6) compute discounted_price off your unit price
      let discountedPrice = price;

      console.log('========== price ==========', price);
      console.log(
        '========== coupon.percent_off ==========',
        coupon.percent_off
      );
      console.log('========== coupon.amount_off ==========', coupon.amount_off);
      console.log('========== coupon.type ==========', coupon.type);

      if (coupon.type === 'percent_off') {
        discountedPrice = Number(
          (price * (1 - coupon.percent_off! / 100)).toFixed(2)
        );
      } else if (coupon.type === 'amount_off') {
        discountedPrice = Number((price - coupon.amount_off!).toFixed(2));
      }

      // 7) write it back onto just the new/updated item
      await supabase
        .from('cart_items')
        .update({
          coupon_id: couponId,
          old_price: price,
          price: discountedPrice,
        })
        .eq('cart_item_id', cartItemId);
    }
  }

  return { message: 'Item added to cart successfully', cartId };
}

/*******************************/
/* Update Cart Quantity Action */
/*******************************/
export async function updateCartQuantityAction(formData: FormData) {
  const cartItemId = formData.get('cart_item_id') as string;
  const quantity = parseInt(formData.get('quantity') as string, 10);
  const supabase = await createClient();

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('cart_item_id', cartItemId);

  if (error) {
    return { message: error.message };
  }

  return { message: 'Cart item quantity updated successfully' };
}

/*************************/
/* Delete Item From Cart */
/*************************/
export async function deleteItemFromCartAction(formData: FormData) {
  const cartItemId = formData.get('cart_item_id') as string;
  const supabase = await createClient();

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_item_id', cartItemId);

  if (error) {
    return { message: error.message };
  }

  return { message: 'Item removed from cart' };
}
