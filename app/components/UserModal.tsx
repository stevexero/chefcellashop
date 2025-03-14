'use client';

import { useEffect } from 'react';
import { useClientStore } from '@/app/store/clientStore';
import { signOutAction } from '../lib/actions';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { FaTimes } from 'react-icons/fa';

interface UserModalProps {
  user: User | null;
}

const UserModal = ({ user }: UserModalProps) => {
  const { activeModal, toggleModal } = useClientStore();
  const isOpen = activeModal === 'user';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black opacity-75 z-40'
          onClick={() => toggleModal('user')}
        />
      )}

      <div
        className={`
          fixed top-0 right-0 h-screen w-80 bg-white shadow-lg z-50
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className='p-4'>
          <button
            onClick={() => toggleModal('user')}
            className='mb-4 text-gray-600 hover:text-gray-900 cursor-pointer'
          >
            <FaTimes />
          </button>
          {user ? (
            <form action={signOutAction} className='flex flex-col'>
              <button
                type='submit'
                className='button-90 mt-4'
                onClick={() => toggleModal('user')}
              >
                Sign out
              </button>
            </form>
          ) : (
            <div className='flex flex-col'>
              <p>Sign in or sign up</p>
              <button
                className='button-85 mt-4'
                onClick={() => toggleModal('user')}
              >
                <Link href='/sign-in'>Sign in</Link>
              </button>
              <button
                className='button-90 mt-4'
                onClick={() => toggleModal('user')}
              >
                <Link href='/sign-up'>Sign up</Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserModal;
