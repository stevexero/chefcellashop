'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { unsubscribe } from './actions';
import { Button } from '../ui/button';

export default function UnsubscribeForm() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (formData: FormData) => {
    const response = await unsubscribe(formData);

    if (response?.error) {
      setMessage(response.error);
    } else {
      setMessage(
        response.message ||
          'You&apos;ve been unsubscribed from the mailing list'
      );
    }
  };

  return (
    <>
      <h4 className='text-lg font-bold'>
        Unsubscribe from the Chef Cella mailing list
      </h4>
      <form className='w-1/4 flex flex-col gap-4 mt-8' action={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='bg-white p-2 rounded-lg border'
          required
        />
        <Button variant='outline' className='mt-4'>
          Unsubscribe
        </Button>
      </form>
      {message && <p className='text-red-500 mt-4'>{message}</p>}
    </>
  );
}
