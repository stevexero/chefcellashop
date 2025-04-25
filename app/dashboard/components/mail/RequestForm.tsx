'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/button';
import { requestEmailAccessAction } from '../../actions';

export default function RequestForm({
  userProfile,
}: {
  userProfile: {
    profile_id: string;
    first_name: string;
    last_name: string;
    email_request_sent: boolean;
  };
}) {
  const [isRequested, setIsRequested] = useState(false);
  const [email, setEmail] = useState('');

  const handleRequestEmailAccess = async (formData: FormData) => {
    if (userProfile.first_name && userProfile.last_name) {
      formData.append('profile_id', userProfile.profile_id);
      formData.append('first_name', userProfile.first_name);
      formData.append('last_name', userProfile.last_name);
      await requestEmailAccessAction(formData);
      setIsRequested(true);
    } else {
      console.error('User profile is missing first or last name');
    }
  };

  useEffect(() => {
    setIsRequested(userProfile.email_request_sent);
  }, [userProfile.email_request_sent]);

  return (
    <form>
      {isRequested ? null : (
        <div className='w-full flex flex-row items-center mb-2'>
          <input
            className='w-1/2 rounded-l-lg border-l border-t border-b p-2'
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className='w-1/2 bg-gray-300 rounded-r-lg border p-2'>
            @chefcella.com
          </p>
        </div>
      )}
      <Button
        variant='default'
        className='w-full rounded-lg'
        disabled={isRequested}
        formAction={handleRequestEmailAccess}
      >
        {isRequested ? 'Email Access Requested' : 'Request Email Access'}
      </Button>
    </form>
  );
}
