'use client';

import { useState } from 'react';
import { addToMailingList } from './actions';

export default function MailingListForm() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (formData: FormData) => {
    const response = await addToMailingList(formData);

    if (response?.error) {
      setMessage(response.error);
    } else {
      setMessage(response.message || 'Thanks for subscribing!');
    }
  };

  return (
    <div className='w-full flex flex-col justify-center items-center bg-black p-8'>
      <h4 className='text-white text-lg font-bold'>
        Join our mailing list to get the latest Chef Cella news and updates
      </h4>
      <form className='w-1/4 flex flex-col gap-4 mt-8' action={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          name='email'
          className='bg-white p-2 rounded-lg'
          required
        />
        <button type='submit' className='button-85'>
          Subscribe
        </button>
      </form>
      {message && <p className='text-red-500 mt-4'>{message}</p>}
    </div>
  );
}
