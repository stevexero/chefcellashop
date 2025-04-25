'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { createAddressAction } from '@/app/checkout/actions';

interface ShippingAddressProps {
  onSubmit: (address: {
    street_address: string;
    street_address_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  }) => void;
  userId: string;
}

export default function ShippingAddress({
  onSubmit,
  userId,
}: ShippingAddressProps) {
  const [address, setAddress] = useState({
    street_address: '',
    street_address_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append('userId', userId);
      const result = await createAddressAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      Cookies.set('shippingAddressId', result.addressId);
      onSubmit(address);
    } catch (error) {
      console.log('Error creating address:', error);
      setError('Failed to create address');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className='text-2xl font-bold mb-4'>Shipping Address</h2>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div className='col-span-2'>
            <label htmlFor='street_address' className='block mb-1'>
              Street Address
            </label>
            <input
              type='text'
              id='street_address'
              name='street_address'
              value={address.street_address}
              onChange={(e) =>
                setAddress({ ...address, street_address: e.target.value })
              }
              required
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='col-span-2'>
            <label htmlFor='street_address_2' className='block mb-1'>
              Apt/Suite (Optional)
            </label>
            <input
              type='text'
              id='street_address_2'
              name='street_address_2'
              value={address.street_address_2}
              onChange={(e) =>
                setAddress({ ...address, street_address_2: e.target.value })
              }
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label htmlFor='city' className='block mb-1'>
              City
            </label>
            <input
              type='text'
              id='city'
              name='city'
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              required
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label htmlFor='state' className='block mb-1'>
              State
            </label>
            <input
              type='text'
              id='state'
              name='state'
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              required
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label htmlFor='postal_code' className='block mb-1'>
              Postal Code
            </label>
            <input
              type='text'
              id='postal_code'
              name='postal_code'
              value={address.postal_code}
              onChange={(e) =>
                setAddress({ ...address, postal_code: e.target.value })
              }
              required
              className='w-full p-2 border rounded'
            />
          </div>
          <div>
            <label htmlFor='country' className='block mb-1'>
              Country
            </label>
            <input
              type='text'
              id='country'
              name='country'
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
              required
              className='w-full p-2 border rounded'
            />
          </div>
        </div>
        {error && <div className='text-red-500 mb-4'>{error}</div>}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
        >
          {isSubmitting ? 'Saving Address...' : 'Continue to Payment'}
        </button>
      </form>
    </>
  );
}
