'use server';

import { createClient } from '@/app/utils/supabase/server';
import { getSession } from '../session';
import { sendEmail } from '@/app/utils/email';
import {
  generateOrderConfirmationEmail,
  generateShippingEmail,
  generateDeliveryEmail,
} from '@/app/utils/emailTemplates';

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
    .select('order_id, order_number')
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

  try {
    await sendEmail({
      to: customerDetails.email,
      subject: `Order Confirmation #${order.order_number} - Chef Cella`,
      html: generateOrderConfirmationEmail({
        firstName: customerDetails.firstName,
        lastName: customerDetails.lastName,
        orderNumber: order.order_number,
        orderItems: cartItems,
        address: {
          street_address: address.street_address,
          street_address_2: address.street_address_2,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country,
        },
        totalAmount: amount,
      }),
    });
  } catch (emailError) {
    console.error('Failed to send order confirmation email:', emailError);
  }

  return {
    message: 'Order created successfully',
    orderItems: cartItems,
    orderNumber: order.order_number,
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

export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  trackingNumber?: string,
  trackingCompany?: string
) {
  const supabase = await createClient();

  console.log('Updating order status with data:', {
    orderId,
    newStatus,
    trackingNumber,
    trackingCompany,
  });

  const updateData: {
    status: string;
    tracking_number?: string;
    tracking_company?: string;
  } = { status: newStatus };

  if (trackingNumber && trackingCompany) {
    updateData.tracking_number = trackingNumber;
    updateData.tracking_company = trackingCompany;
  }

  console.log('Update data being sent to Supabase:', updateData);

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('order_id', orderId)
    .select('order_id, status, order_number, tracking_number, tracking_company')
    .single();

  if (error) {
    console.error('Error updating order status:', error);
    return { error: error.message };
  }

  console.log('Order status updated successfully:', data);

  // Get customer details for email notifications
  const { data: orderDetails, error: orderError } = await supabase
    .from('orders')
    .select(
      `
      order_id,
      order_number,
      profile_id,
      temp_user_id
    `
    )
    .eq('order_id', orderId)
    .single();

  if (orderError) {
    console.error('Error fetching order details:', orderError);
    return { error: orderError.message };
  }

  if (!orderDetails) {
    throw new Error('Order details not found');
  }

  // Get customer details based on whether it's a profile or temp_user
  let customerEmail, customerName;
  if (orderDetails.profile_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('profile_id', orderDetails.profile_id)
      .single();

    if (profile) {
      customerEmail = profile.email;
      customerName = `${profile.first_name} ${profile.last_name}`;
    }
  } else if (orderDetails.temp_user_id) {
    const { data: tempUser } = await supabase
      .from('temp_users')
      .select('email, first_name, last_name')
      .eq('temp_user_id', orderDetails.temp_user_id)
      .single();

    if (tempUser) {
      customerEmail = tempUser.email;
      customerName = `${tempUser.first_name} ${tempUser.last_name}`;
    }
  }

  if (!customerEmail || !customerName) {
    throw new Error('Customer details not found');
  }

  // Send appropriate email based on status
  try {
    if (newStatus === 'shipped' && trackingNumber && trackingCompany) {
      console.log('Sending shipping email to:', customerEmail);
      await sendEmail({
        to: customerEmail,
        subject: `Your Order #${orderDetails.order_number} Has Been Shipped!`,
        html: generateShippingEmail({
          firstName: customerName,
          orderNumber: orderDetails.order_number,
          trackingCompany,
          trackingNumber,
        }),
      });
    } else if (newStatus === 'delivered') {
      console.log('Sending delivery email to:', customerEmail);
      await sendEmail({
        to: customerEmail,
        subject: `Your Order #${orderDetails.order_number} Has Been Delivered!`,
        html: generateDeliveryEmail({
          firstName: customerName,
          orderNumber: orderDetails.order_number,
        }),
      });
    }
  } catch (emailError) {
    console.error('Failed to send email:', emailError);
    if (emailError instanceof Error) {
      console.error('Error details:', {
        message: emailError.message,
        stack: emailError.stack,
      });
    }
  }

  return { success: true, data };
}
