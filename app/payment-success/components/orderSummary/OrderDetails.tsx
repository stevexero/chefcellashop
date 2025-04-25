'use client';

import { useState } from 'react';
import Image from 'next/image';
import { OrderDetailsProps } from '@/app/types/types';

export default function OrderDetails({
  order,
  customerDetails,
  orderItems,
}: OrderDetailsProps) {
  const [status, setStatus] = useState(order.status);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(
    order.tracking_number || ''
  );
  const [trackingCompany, setTrackingCompany] = useState(
    order.tracking_company || ''
  );
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      if (newStatus === 'shipped') {
        setShowTrackingForm(true);
        setIsUpdating(false);
        return;
      }

      console.log('Sending status update request:', {
        orderId: order.order_id,
        newStatus,
      });

      const response = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.order_id,
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update status');
      }

      if (result.data) {
        console.log('Status update successful:', result);
        setStatus(result.data.status);
        setIsEditing(false);
      } else {
        throw new Error('No data returned from server');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(
        error instanceof Error ? error.message : 'Failed to update order status'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTrackingSubmit = async () => {
    if (!trackingNumber || !trackingCompany) {
      alert('Please fill in both tracking number and company');
      return;
    }

    setIsUpdating(true);
    try {
      const requestData = {
        orderId: order.order_id,
        status: 'shipped',
        trackingNumber,
        trackingCompany,
      };

      console.log('Sending tracking update request:', requestData);

      const response = await fetch('/api/update-order-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      console.log('Received response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update status');
      }

      if (result.data) {
        console.log('Status update successful:', result);
        setStatus('shipped');
        setIsEditing(false);
        setShowTrackingForm(false);
      } else {
        throw new Error('No data returned from server');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(
        error instanceof Error ? error.message : 'Failed to update order status'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='md:space-y-8'>
      {/* Order Header */}
      <div className='text-center'>
        <h1 className='text-4xl font-extrabold mb-2'>Order Details</h1>
        <p className='text-2xl'>Order #{order.order_number}</p>
      </div>

      {/* Order Status */}
      <div className='text-center'>
        {isEditing ? (
          <div className='flex flex-col items-center justify-center gap-4'>
            <select
              value={status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className='px-3 py-1 border rounded'
              disabled={isUpdating}
            >
              <option value='pending'>Pending</option>
              <option value='cancelled'>Cancelled</option>
              <option value='exception'>Exception</option>
              <option value='shipped'>Shipped</option>
              <option value='delivered'>Delivered</option>
            </select>

            {showTrackingForm && (
              <div className='flex flex-col gap-2 w-full max-w-md'>
                <input
                  type='text'
                  placeholder='Tracking Company (e.g., USPS, FedEx)'
                  value={trackingCompany}
                  onChange={(e) => setTrackingCompany(e.target.value)}
                  className='px-3 py-1 border rounded'
                />
                <input
                  type='text'
                  placeholder='Tracking Number'
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className='px-3 py-1 border rounded'
                />
                <button
                  onClick={handleTrackingSubmit}
                  disabled={isUpdating}
                  className='px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400'
                >
                  {isUpdating ? 'Updating...' : 'Save & Send Shipping Email'}
                </button>
                <button
                  onClick={() => {
                    setShowTrackingForm(false);
                    setStatus(order.status);
                  }}
                  disabled={isUpdating}
                  className='px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400'
                >
                  Cancel
                </button>
              </div>
            )}

            {!showTrackingForm && (
              <div className='flex gap-2'>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isUpdating}
                  className='px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400'
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className='flex items-center justify-center gap-2'>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold
              ${
                status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : status === 'shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : status === 'processing'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status.toUpperCase()}
            </span>
            {status === 'shipped' && order.tracking_number && (
              <div className='text-sm text-gray-600'>
                {order.tracking_company}: {order.tracking_number}
              </div>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className='px-3 py-1 text-sm text-blue-500 hover:text-blue-600'
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Customer Details */}
      <div className='bg-white/10 p-6 rounded-lg'>
        <h2 className='text-2xl font-bold mb-4'>Customer Information</h2>
        <div className='flex flex-col md:grid md:grid-cols-2 md:gap-4'>
          <div>
            <p className='font-semibold'>Name</p>
            <p>{`${customerDetails.first_name} ${customerDetails.last_name}`}</p>
          </div>
          <div>
            <p className='font-semibold'>Email</p>
            <p>{customerDetails.email}</p>
          </div>
          <div className='col-span-2'>
            <p className='font-semibold'>Shipping Address</p>
            <p>{order.addresses.street_address}</p>
            {order.addresses.street_address_2 && (
              <p>{order.addresses.street_address_2}</p>
            )}
            <p>
              {`${order.addresses.city}, ${order.addresses.state} ${order.addresses.postal_code}`}
            </p>
            <p>{order.addresses.country}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h2 className='text-2xl font-bold mb-4'>Order Items</h2>
        <div className='md:space-y-4'>
          {orderItems.map((item, index) => (
            <div
              key={index}
              className='flex items-center md:gap-4 p-4 bg-white/10 rounded-lg'
            >
              <div className='relative w-10 h-10 md:w-20 md:h-20'>
                <Image
                  src={
                    item?.products?.product_images.find(
                      (image) => image.color_id === item.colors?.color_id
                    )?.image_url ||
                    item?.products?.product_images[0]?.image_url ||
                    '/NIA.jpg'
                  }
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
                <div className='flex flex-row gap-4 text-sm font-semibold'>
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

      {/* Order Summary */}
      <div className='text-right'>
        <h3 className='text-2xl font-bold'>
          Total Amount: ${order.amount.toFixed(2)}
        </h3>
        <p className='text-sm text-gray-600'>
          Order Date: {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
