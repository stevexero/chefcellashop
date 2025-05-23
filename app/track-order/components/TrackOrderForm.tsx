'use client';

import React, { useState } from 'react';
import { trackOrder } from '@/app/track-order/data';
import OrderItem from './OrderItem';
import { OrderDetails } from '@/app/types/types';

export default function TrackOrderForm() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const orderNumber = formData.get('order-number') as string;
    const email = formData.get('email') as string;

    const result = await trackOrder(orderNumber, email);

    if (result.success && result.orderDetails) {
      setOrderDetails(result.orderDetails);
      setError('');
    } else {
      setError(result.message || 'An error occurred');
      setOrderDetails(null);
    }
  }

  return (
    <main className='max-w-3xl mx-auto px-4 py-12'>
      <form className='flex flex-col' onSubmit={handleSubmit}>
        <label htmlFor='order-number' className='block'>
          Order Number
        </label>
        <input
          type='text'
          id='order-number'
          name='order-number'
          required
          className='w-full p-2 border border-gray-300 rounded-md'
        />
        <label htmlFor='email' className='block mt-8'>
          Email
        </label>
        <input
          type='email'
          id='email'
          name='email'
          required
          className='w-full p-2 border border-gray-300 rounded-md'
        />
        <button
          type='submit'
          className='mt-8 block w-full bg-black text-white px-4 py-2 rounded-md cursor-pointer'
        >
          Track Order
        </button>
      </form>

      {error && (
        <div className='mt-4 p-4 bg-red-100 text-red-700 rounded-md'>
          {error}
        </div>
      )}

      {orderDetails && (
        <div className='mt-8 p-4 border border-gray-200 rounded-md'>
          <div className='mb-6'>
            <h2 className='text-2xl font-bold mb-2'>
              Order #{orderDetails.orderNumber}
            </h2>
            <p className='text-gray-600'>Status: {orderDetails.orderStatus}</p>
            <p className='text-gray-600'>
              Purchase Date:{' '}
              {new Date(orderDetails.orderDate).toLocaleDateString()}
            </p>
            <p className='text-gray-600'>
              Total Amount: ${orderDetails.orderAmount}
            </p>
          </div>

          <div className='mb-6'>
            <h3 className='text-xl font-semibold mb-2'>Customer Details</h3>
            <p>
              {orderDetails.customer.first_name}{' '}
              {orderDetails.customer.last_name}
            </p>
            <p>{orderDetails.customer.email}</p>
          </div>

          <div>
            <h3 className='text-xl font-semibold mb-2'>Order Items</h3>
            <div className='space-y-2'>
              {orderDetails.orderItems.map((item, index) => (
                <OrderItem key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
