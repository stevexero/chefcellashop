'use client';

import { useState, useEffect } from 'react';
import { setSession } from '@/app/lib/session';
import Cookies from 'js-cookie';

interface ContactDetailsProps {
  onSubmit: (details: {
    email: string;
    firstName: string;
    lastName: string;
    userId: string;
  }) => void;
}

export default function ContactDetails({ onSubmit }: ContactDetailsProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const customerEmail = Cookies.get('chefCellaCustomerEmail');
    const customerFirstName = Cookies.get('chefCellaCustomerFirstName');
    const customerLastName = Cookies.get('chefCellaCustomerLastName');

    if (customerEmail) setEmail(customerEmail);
    if (customerFirstName) setFirstName(customerFirstName);
    if (customerLastName) setLastName(customerLastName);

    console.log('customerEmail', customerEmail);
    console.log('customerFirstName', customerFirstName);
    console.log('customerLastName', customerLastName);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create guest user in database
      const formData = new FormData();
      formData.append('email', email);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);

      const response = await fetch('/api/create-guest-customer', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create guest user');
      }

      // Set cookies via server action
      const cookieResponse = await fetch('/api/set-customer-cookies', {
        method: 'POST',
        body: formData,
      });

      if (!cookieResponse.ok) {
        throw new Error('Failed to set customer cookies');
      }

      // Get current session to preserve cartId
      const sessionResponse = await fetch('/api/get-session');
      const sessionData = await sessionResponse.json();

      // Save tempUserId to session while preserving cartId
      await setSession({
        tempUserId: data.userId,
        cartId: sessionData.cartId,
      });

      // If successful, proceed to next step with user ID
      onSubmit({ email, firstName, lastName, userId: data.userId });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className='text-2xl font-bold mb-4'>Contact Details</h2>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-2 gap-4 mb-4'>
          <div className='col-span-2'>
            <label htmlFor='email' className='block mb-1'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='col-span-2'>
            <label htmlFor='firstName' className='block mb-1'>
              First Name
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='col-span-2'>
            <label htmlFor='lastName' className='block mb-1'>
              Last Name
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
          {isSubmitting ? 'Creating Account...' : 'Continue to Shipping'}
        </button>
      </form>
    </>
  );
}
