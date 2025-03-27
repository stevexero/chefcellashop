'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerDetails() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/status');
      const { isAuthenticated } = await response.json();
      setIsLoggedIn(isAuthenticated);
    };
    checkAuth();
  }, []);

  const handleAuth = (action: 'sign-in' | 'sign-up') => {
    // Redirect to sign-in or sign-up page with return URL
    router.push(`/${action}?redirect=/checkout`);
  };

  if (isLoggedIn === null) return <p>Loading...</p>;

  return (
    <div>
      <p className='font-semibold text-xl mb-4'>Customer Details</p>

      {!isLoggedIn && (
        <div className='mb-6 p-4 border rounded bg-gray-100'>
          <p className='mb-2'>
            Log in or sign up to save your cart and details for future orders!
          </p>
          <div className='flex gap-4'>
            <button
              onClick={() => handleAuth('sign-in')}
              className='px-4 py-2 bg-blue-500 text-white rounded'
            >
              Log In
            </button>
            <button
              onClick={() => handleAuth('sign-up')}
              className='px-4 py-2 bg-green-500 text-white rounded'
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
