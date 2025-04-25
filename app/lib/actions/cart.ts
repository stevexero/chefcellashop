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
  console.log('========== userId ==========', userId);

  const session = await getSession();
  console.log('========== session ==========', session);
  let cartId = session.cartId;
  console.log('========== cartId ==========', cartId);

  const { data: product, error } = await supabase
    .from('products')
    .select('base_price')
    .eq('product_id', productId)
    .single();

  if (error) {
    return { error: error.message };
  }
  console.log('========== product ==========', product);

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
  console.log('========== price ==========', price);

  if (userId) {
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('cart_id')
      .eq('user_id', userId)
      .single();

    if (cartError && cartError.code !== 'PGRST116')
      return { error: cartError.message };
    cartId = cart?.cart_id;
    console.log('========== userId cartId ==========', cartId);
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
    console.log('========== cartId ==========', cartId);
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
    console.log('Verifying cart exists:', cartId);
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

  const { data: existingItem, error: fetchError } = await supabase
    .from('cart_items')
    .select('cart_item_id, quantity')
    .eq('cart_id', cartId)
    .eq('product_id', productId)
    .match({ size_id: sizeId, color_id: colorId })
    .single();

  if (fetchError && fetchError.code !== 'PGRST116')
    return { error: fetchError.message };

  console.log('========== existingItem ==========', existingItem);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('cart_item_id', existingItem.cart_item_id);

    if (updateError) return { error: updateError.message };

    console.log('========== existingItem ==========', existingItem);
  } else {
    console.log('---===---=== cartId ---===---===', cartId);
    console.log('---===---=== productId ---===---===', productId);
    console.log('---===---=== sizeId ---===---===', sizeId);
    console.log('---===---=== colorId ---===---===', colorId);
    console.log('---===---=== quantity ---===---===', quantity);
    console.log('---===---=== price ---===---===', price);
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

    console.log('========== data ==========', data);

    if (error) {
      console.error('Error inserting cart item:', error);
      return { error: error.message };
    }

    console.log('========== data ==========', data);
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
