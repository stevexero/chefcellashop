// 'use server';

// import { createClient } from '@/app/utils/supabase/server';
// import { getSession } from '../session';

// export async function createOrderAction(formData: FormData) {
//   const paymentId = formData.get('paymentId') as string;
//   const cartId = formData.get('cartId') as string;
//   const shippingAddressId = formData.get('shippingAddressId') as string;

//   const supabase = await createClient();

//   // Get cart details
//   const { data: cart, error: cartError } = await supabase
//     .from('carts')
//     .select('user_id')
//     .eq('cart_id', cartId)
//     .single();

//   if (cartError) return { error: cartError.message };

//   // Get cart items
//   const { data: cartItems, error: itemsError } = await supabase
//     .from('cart_items')
//     .select(
//       `
//       *,
//       products (
//         product_name,
//         product_images (image_url)
//       ),
//       sizes (size),
//       colors (color_name)
//     `
//     )
//     .eq('cart_id', cartId);

//   if (itemsError) return { error: itemsError.message };

//   // Calculate total amount
//   const amount = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   // Get customer details
//   const { data: customer, error: customerError } = await supabase
//     .from('temp_users')
//     .select('email, first_name, last_name')
//     .eq('temp_user_id', (await getSession()).tempUserId)
//     .single();

//   if (customerError) return { error: customerError.message };

//   // Get shipping address
//   const { data: address, error: addressError } = await supabase
//     .from('addresses')
//     .select('*')
//     .eq('address_id', shippingAddressId)
//     .single();

//   if (addressError) return { error: addressError.message };

//   // Create order
//   const { data: order, error: orderError } = await supabase
//     .from('orders')
//     .insert([
//       {
//         payment_id: paymentId,
//         amount,
//         shipping_address_id: shippingAddressId,
//         profile_id: cart.user_id || null,
//         temp_user_id: cart.user_id
//           ? null
//           : (await getSession()).tempUserId || null,
//       },
//     ])
//     .select('order_id')
//     .single();

//   if (orderError) return { error: orderError.message };

//   // Create order line items
//   const orderLineItems = cartItems.map((item) => ({
//     order_id: order.order_id,
//     product_id: item.product_id,
//     size_id: item.size_id,
//     color_id: item.color_id,
//     quantity: item.quantity,
//     price: item.price,
//   }));

//   const { error: lineItemsError } = await supabase
//     .from('order_line_items')
//     .insert(orderLineItems);

//   if (lineItemsError) return { error: lineItemsError.message };

//   // Delete cart items and cart
//   const { error: deleteItemsError } = await supabase
//     .from('cart_items')
//     .delete()
//     .eq('cart_id', cartId);

//   if (deleteItemsError) return { error: deleteItemsError.message };

//   const { error: deleteCartError } = await supabase
//     .from('carts')
//     .delete()
//     .eq('cart_id', cartId);

//   if (deleteCartError) return { error: deleteCartError.message };

//   return {
//     message: 'Order created successfully',
//     orderItems: cartItems,
//     customerDetails: {
//       email: customer.email,
//       firstName: customer.first_name,
//       lastName: customer.last_name,
//       address: {
//         street_address: address.street_address,
//         street_address_2: address.street_address_2,
//         city: address.city,
//         state: address.state,
//         postal_code: address.postal_code,
//         country: address.country,
//       },
//     },
//   };
// }
