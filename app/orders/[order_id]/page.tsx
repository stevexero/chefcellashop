import { createClient } from '@/app/utils/supabase/server';
import OrderDetails from '@/app/components/orderDetails/OrderDetails';

interface OrderPageProps {
  params: Promise<{
    order_id: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const supabase = await createClient();
  const { order_id } = await params;

  // Fetch order details with related data
  const { data: order, error } = await supabase
    .from('orders')
    .select(
      `
      *,
      addresses (
        street_address,
        street_address_2,
        city,
        state,
        postal_code,
        country
      ),
      order_line_items (
        quantity,
        price,
        products (
          product_name,
          product_images (image_url)
        ),
        sizes (size),
        colors (color_name)
      )
    `
    )
    .eq('order_id', order_id)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return <div>Error loading order details</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  // Get customer details based on user type
  let customerDetails;
  if (order.profile_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, last_name')
      .eq('profile_id', order.profile_id)
      .single();

    if (profile) {
      customerDetails = {
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
      };
    }
  } else if (order.temp_user_id) {
    const { data: tempUser } = await supabase
      .from('temp_users')
      .select('email, first_name, last_name')
      .eq('temp_user_id', order.temp_user_id)
      .single();

    if (tempUser) {
      customerDetails = {
        email: tempUser.email,
        first_name: tempUser.first_name,
        last_name: tempUser.last_name,
      };
    }
  }

  if (!customerDetails) {
    return <div>Customer details not found</div>;
  }

  return (
    <div className='p-4 md:container md:mx-auto md:px-4 md:py-8'>
      <OrderDetails
        order={order}
        customerDetails={customerDetails}
        orderItems={order.order_line_items}
      />
    </div>
  );
}
