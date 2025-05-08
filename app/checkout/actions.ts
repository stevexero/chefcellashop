'use server';

import { createClient } from '@/app/lib/supabase/server';

/******************/
/* Create Address */
/******************/
export async function createAddressAction(formData: FormData) {
  const tempUserId = formData.get('profileId') as string;
  const streetAddress = formData.get('street_address') as string;
  const streetAddress2 = formData.get('street_address_2') as string;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const postalCode = formData.get('postal_code') as string;
  const country = formData.get('country') as string;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('addresses')
    .insert([
      {
        temp_user_id: tempUserId,
        street_address: streetAddress,
        street_address_2: streetAddress2,
        city: city,
        state: state,
        postal_code: postalCode,
        country: country,
      },
    ])
    .select('address_id')
    .single();

  if (error) return { error: error.message };
  return {
    message: 'Address created successfully',
    addressId: data.address_id,
  };
}

/****************/
/* Apply Coupon */
/****************/
export async function applyCouponAction(coupon: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', coupon)
    .single();

  if (error) return { error: error.message };
  return {
    message: 'Coupon applied successfully',
    coupon: data,
  };
}

/*********************/
/* Update Cart Total */
/*********************/
export async function updateCartTotalAction(
  // cartId: string,
  cartItemId: string,
  price: number,
  oldPrice: number,
  couponId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cart_items')
    .update({ price: price, old_price: oldPrice, coupon_id: couponId })
    // .eq('cart_id', cartId)
    .eq('cart_item_id', cartItemId)
    .select('*');

  if (error) return { error: error.message };
  return {
    message: 'Cart total updated successfully',
    cart: data,
  };
}

/*****************/
/* Remove Coupon */
/*****************/
export async function removeCouponAction(cartId: string) {
  const supabase = await createClient();

  // 1) grab every cart_item_id + its old_price
  const { data: items, error: fetchErr } = await supabase
    .from('cart_items')
    .select('cart_item_id, old_price')
    .eq('cart_id', cartId);

  if (fetchErr) {
    console.error('Error fetching cart items for coupon removal:', fetchErr);
    return { error: fetchErr.message };
  }

  // 2) for each, restore price and clear the coupon fields
  const updatePromises = items!.map((item) =>
    supabase
      .from('cart_items')
      .update({
        price: item.old_price, // restore original price
        old_price: null, // clear the backup field
        coupon_id: null, // detach the coupon
      })
      .eq('cart_item_id', item.cart_item_id)
      .select('*')
  );

  // 3) run them in parallel
  const settled = await Promise.all(updatePromises);

  // 4) collect all updated rows
  const updated = settled
    .filter((r) => !r.error)
    .map((r) => r.data!)
    .flat();

  return {
    message: 'Coupon removed successfully',
    cart: updated,
  };
}
