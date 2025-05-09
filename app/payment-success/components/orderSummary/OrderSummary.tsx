'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import OrderItem from './OrderItem';
import CustomerDetails from './CustomerDetails';
import OrderNumber from './OrderNumber';
import {
  OrderLineItemProps,
  CustomerDetailsProps,
  OrderSummaryProps,
} from '@/app/types/types';

export default function OrderSummary({
  paymentId,
  redirectStatus,
}: OrderSummaryProps) {
  const [orderItems, setOrderItems] = useState<OrderLineItemProps[]>([]);
  const [customerDetails, setCustomerDetails] =
    useState<CustomerDetailsProps | null>(null);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createOrder = async () => {
      const raw = localStorage.getItem('lastOrder');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.paymentId === paymentId) {
          setOrderItems(parsed.orderItems);
          setCustomerDetails(parsed.customerDetails);
          setOrderNumber(parsed.orderNumber);
          localStorage.removeItem('lastOrder');
          setLoading(false);
          return;
        } else {
          localStorage.removeItem('lastOrder');
        }
      }

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
      if (!cartId || !shippingAddressId) {
        setError('Missing cart or shipping info');
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

        if (!response.ok)
          throw new Error((await response.json()).error || 'Create failed');

        const data = await response.json();

        setOrderItems(data.orderItems);
        setCustomerDetails(data.customerDetails);
        setOrderNumber(data.orderNumber);
        localStorage.setItem(
          'lastOrder',
          JSON.stringify({
            paymentId,
            orderItems: data.orderItems,
            customerDetails: data.customerDetails,
            orderNumber: data.orderNumber,
          })
        );

        Cookies.remove('cartId');
        Cookies.remove('shippingAddressId');
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'Failed to create order'
        );
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [paymentId, redirectStatus]);

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
      {orderNumber && <OrderNumber orderNumber={orderNumber} />}
      {customerDetails && <CustomerDetails customerDetails={customerDetails} />}
      <div>
        <h3 className='text-2xl font-bold mb-4'>Order Items</h3>
        <div className='space-y-4'>
          {orderItems.map((item, index) => (
            <OrderItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
