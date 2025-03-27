'use server';

import { createClient } from '@/app/utils/supabase/server';
import { getSession } from '../session';

export async function createOrderAction(formData: FormData) {
  const paymentId = formData.get('paymentId') as string;
  const cartId = formData.get('cartId') as string;
  const shippingAddressId = formData.get('shippingAddressId') as string;

  const supabase = await createClient();

  // Get cart details
  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select('user_id')
    .eq('cart_id', cartId)
    .single();

  if (cartError) return { error: cartError.message };

  // Get cart items
  const { data: cartItems, error: itemsError } = await supabase
    .from('cart_items')
    .select(
      `
      *,
      products (
        product_name,
        product_images (image_url)
      ),
      sizes (size),
      colors (color_name)
    `
    )
    .eq('cart_id', cartId);

  if (itemsError) return { error: itemsError.message };

  // Calculate total amount
  const amount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Get customer details based on user type
  let customerDetails;
  if (cart.user_id) {
    // For authenticated users
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('profile_id', cart.user_id)
      .single();

    if (profileError) return { error: profileError.message };
    customerDetails = {
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
    };
  } else {
    // For guest users
    const session = await getSession();
    if (!session.tempUserId) {
      return { error: 'Missing guest user information' };
    }

    const { data: tempUser, error: tempUserError } = await supabase
      .from('temp_users')
      .select('email, first_name, last_name')
      .eq('temp_user_id', session.tempUserId)
      .single();

    if (tempUserError) return { error: tempUserError.message };
    customerDetails = {
      email: tempUser.email,
      firstName: tempUser.first_name,
      lastName: tempUser.last_name,
    };
  }

  // Get shipping address
  const { data: address, error: addressError } = await supabase
    .from('addresses')
    .select('*')
    .eq('address_id', shippingAddressId)
    .single();

  if (addressError) return { error: addressError.message };

  // Create order with either profile_id or temp_user_id, but not both
  const orderData: {
    payment_id: string;
    amount: number;
    shipping_address_id: string;
    profile_id?: string | null;
    temp_user_id?: string | null;
  } = {
    payment_id: paymentId,
    amount,
    shipping_address_id: shippingAddressId,
  };

  if (cart.user_id) {
    orderData.profile_id = cart.user_id;
    orderData.temp_user_id = null;
  } else {
    const session = await getSession();
    if (!session.tempUserId) {
      return { error: 'Missing guest user information' };
    }
    orderData.profile_id = null;
    orderData.temp_user_id = session.tempUserId;
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData])
    .select('order_id')
    .single();

  if (orderError) return { error: orderError.message };

  // Create order line items
  const orderLineItems = cartItems.map((item) => ({
    order_id: order.order_id,
    product_id: item.product_id,
    size_id: item.size_id,
    color_id: item.color_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: lineItemsError } = await supabase
    .from('order_line_items')
    .insert(orderLineItems);

  if (lineItemsError) return { error: lineItemsError.message };

  // Delete cart items and cart
  const { error: deleteItemsError } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId);

  if (deleteItemsError) return { error: deleteItemsError.message };

  const { error: deleteCartError } = await supabase
    .from('carts')
    .delete()
    .eq('cart_id', cartId);

  if (deleteCartError) return { error: deleteCartError.message };

  return {
    message: 'Order created successfully',
    orderItems: cartItems,
    customerDetails: {
      ...customerDetails,
      address: {
        street_address: address.street_address,
        street_address_2: address.street_address_2,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
      },
    },
  };
}
