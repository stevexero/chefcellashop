'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';

interface OrderLineItem {
  order_item_id: string;
  product_id: string;
  size_id: string | null;
  color_id: string | null;
  quantity: number;
  price: number;
  products: {
    product_name: string;
    product_images: { image_url: string }[];
  };
  sizes: { size: string } | null;
  colors: { color_name: string } | null;
}

interface OrderSummaryProps {
  paymentId: string;
  clientSecret: string;
  redirectStatus: string;
}

export default function OrderSummary({
  paymentId,
  clientSecret,
  redirectStatus,
}: OrderSummaryProps) {
  const [orderItems, setOrderItems] = useState<OrderLineItem[]>([]);
  const [customerDetails, setCustomerDetails] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    address: {
      street_address: string;
      street_address_2: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  } | null>(null);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createOrder = async () => {
      if (redirectStatus !== 'succeeded') {
        setError('Payment was not successful');
        setLoading(false);
        return;
      }

      if (!paymentId) {
        setError('Payment ID is missing');
        setLoading(false);
        return;
      }

      const cartId = Cookies.get('cartId');
      const shippingAddressId = Cookies.get('shippingAddressId');

      console.log('All cookies:', Cookies.get());
      console.log('cartId:', Cookies.get('cartId'));
      console.log('shippingAddressId:', Cookies.get('shippingAddressId'));

      if (!shippingAddressId) {
        setError('Missing required shippingAddressId information');
        setLoading(false);
        return;
      }

      if (!cartId) {
        setError('Missing required cartId information');
        setLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('paymentId', paymentId);
        formData.append('cartId', cartId);
        formData.append('shippingAddressId', shippingAddressId);

        const response = await fetch('/api/create-order', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create order');
        }

        const data = await response.json();

        console.log(data);

        if (data.error) {
          setError(data.error);
          return;
        }

        if (data.orderItems) {
          setOrderItems(data.orderItems);
        }

        if (data.customerDetails) {
          setCustomerDetails(data.customerDetails);
        }

        if (data.orderNumber) {
          setOrderNumber(data.orderNumber);
        }

        // Clear cookies after successful order
        Cookies.remove('cartId');
        Cookies.remove('shippingAddressId');
      } catch (error) {
        console.error('Order creation error:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to create order'
        );
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [paymentId, clientSecret, redirectStatus]);

  useEffect(() => {
    console.log('customerDetails:', customerDetails);
  }, [customerDetails]);

  if (loading) {
    return (
      <div className='flex items-center justify-center'>
        <div
          className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]'
          role='status'
        >
          <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-red-500 text-xl'>
        <h1 className='text-4xl font-extrabold mb-2'>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className='mt-10 text-left space-y-8'>
      {/* Order Number Section */}
      {orderNumber && (
        <div className='bg-white/10 p-6 rounded-lg'>
          <h3 className='text-2xl font-bold mb-4'>Order Confirmation</h3>
          <p className='text-lg'>
            Your order number is:{' '}
            <span className='font-bold'>#{orderNumber}</span>
          </p>
          <p className='text-sm text-gray-600 mt-2'>
            Please keep this number for your records
          </p>
        </div>
      )}

      {/* Customer Details Section */}
      {customerDetails && (
        <div className='p-6 rounded-lg'>
          <p className='text-xl mb-4'>
            Shipping updates will be sent to{' '}
            <span className='font-bold'>{customerDetails.email}</span>
          </p>
          <h3 className='text-2xl font-bold mb-4'>Customer Details</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='font-semibold'>Name</p>
              <p>{`${customerDetails.firstName} ${customerDetails.lastName}`}</p>
            </div>
            <div>
              <p className='font-semibold'>Email</p>
              <p>{customerDetails.email}</p>
            </div>
            <div className='col-span-2'>
              <p className='font-semibold'>Shipping Address</p>
              <p>{customerDetails.address.street_address}</p>
              {customerDetails.address.street_address_2 && (
                <p>{customerDetails.address.street_address_2}</p>
              )}
              <p>
                {`${customerDetails.address.city}, ${customerDetails.address.state} ${customerDetails.address.postal_code}`}
              </p>
              <p>{customerDetails.address.country}</p>
            </div>
          </div>
        </div>
      )}

      {/* Order Items Section */}
      <div>
        <h3 className='text-2xl font-bold mb-4'>Order Items</h3>
        <div className='space-y-4'>
          {orderItems.map((item, index) => (
            <div key={index} className='flex items-center gap-4 p-4 rounded-lg'>
              <div className='relative w-20 h-20'>
                <Image
                  src={item.products.product_images[0]?.image_url || '/NIA.jpg'}
                  alt={item.products.product_name}
                  fill
                  className='object-contain'
                />
              </div>
              <div className='flex-1'>
                <h4 className='font-bold'>
                  {item.products.product_name
                    .replaceAll('-', ' ')
                    .toUpperCase()}
                </h4>
                <div className='flex flex-row gap-4 text-sm font-semibold text-black'>
                  <p>Size: {item.sizes?.size || 'N/A'}</p>
                  <p>Color: {item.colors?.color_name || 'N/A'}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
