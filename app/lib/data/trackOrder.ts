'use server';

import { createClient } from '@/app/utils/supabase/server';

type TrackOrderResponse = {
  success: boolean;
  message?: string;
  orderDetails?: {
    orderNumber: string;
    orderAmount: number;
    orderStatus: string;
    orderDate: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
    };
    orderItems: Array<{
      name: string;
      quantity: number;
      base_price: number;
      color: string;
      size: string;
    }>;
  };
};

export async function trackOrder(
  orderNumber: string,
  email: string
): Promise<TrackOrderResponse> {
  try {
    if (!orderNumber || !email) {
      return {
        success: false,
        message: 'Please provide both order number and email',
      };
    }

    const supabase = await createClient();

    const { data: user, error: userError } = await supabase
      .from('temp_users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError) {
      throw new Error('User not found');
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .eq('temp_user_id', user.temp_user_id)
      .single();

    if (orderError || !order) {
      return {
        success: false,
        message: 'Order not found',
      };
    }

    const { data: customer, error: customerError } = await supabase
      .from('temp_users')
      .select('*')
      .eq('temp_user_id', order.temp_user_id)
      .single();
    if (customerError) {
      throw new Error('Customer not found');
    }

    console.log('customer', customer);

    const { data: orderItems, error: orderItemsError } = await supabase
      .from('order_line_items')
      .select(
        `
        *,
        products (
          product_name,
          base_price
        ),
        sizes (
          size
        ),
        colors (
          color_name
        )
      `
      )
      .eq('order_id', order.order_id);

    if (orderItemsError) {
      throw new Error('Order items not found');
    }

    console.log('orderItems', orderItems);

    orderItems.forEach(async (item) => {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', item.product_id)
        .single();

      if (productError) {
        throw new Error('Product not found');
      }

      console.log('product', product);
    });

    return {
      success: true,
      orderDetails: {
        orderStatus: order.status,
        orderNumber: order.order_number,
        orderAmount: order.amount,
        orderDate: order.created_at,
        customer: customer,
        orderItems: orderItems.map((item) => ({
          name: item.products.product_name,
          quantity: item.quantity,
          base_price: item.products.base_price,
          color: item.colors?.color_name || 'N/A',
          size: item.sizes?.size || 'N/A',
        })),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message:
        'Unable to find order. Please check your order number and email.',
    };
  }
}
