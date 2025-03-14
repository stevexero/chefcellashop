'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  profile_id?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at?: string;
  role?: string;
}

interface ProfileUpdateFormProps {
  userProfile: UserProfile;
}

export default function ProfileUpdateForm({
  userProfile,
}: ProfileUpdateFormProps) {
  const router = useRouter();

  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState(userProfile.first_name || '');
  const [lastName, setLastName] = useState(userProfile.last_name || '');
  const [message, setMessage] = useState('');

  const handleToggleEdit = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('profile_id', userProfile.profile_id || '');
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);

    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage(data.message);
        setIsEditMode(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setMessage('Profile update failed.');
    }
  };

  const handleCancel = () => {
    setFirstName(userProfile.first_name || '');
    setLastName(userProfile.last_name || '');
    setMessage('');
    setIsEditMode(false);
  };

  return (
    <div className='w-full'>
      {userProfile.role === 'admin' ? (
        <p className='font-bold text-sm text-green-500'>Admin</p>
      ) : null}
      <form onSubmit={handleSubmit}>
        <div className='text-sm mt-2'>
          <span className='font-bold'>First Name:&nbsp;</span>
          {isEditMode ? (
            <input
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder='Enter your first name'
              className='border-b p-2 rounded'
            />
          ) : (
            userProfile.first_name || (
              <span className='text-red-500'>Not yet set</span>
            )
          )}
        </div>
        <div className='text-sm mt-2'>
          <span className='font-bold'>Last Name:&nbsp;</span>
          {isEditMode ? (
            <input
              type='text'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Enter your last name'
              className='border-b p-2 rounded'
            />
          ) : (
            userProfile.last_name || (
              <span className='text-red-500'>Not yet set</span>
            )
          )}
        </div>
        <p className='text-sm mt-2'>
          <span className='font-bold'>Member since:&nbsp;</span>
          {new Date(userProfile.created_at || '').toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        {isEditMode ? (
          <div className='mt-4 flex gap-2'>
            <button
              type='submit'
              className='w-full bg-black text-white text-xs px-4 py-2 rounded-full shadow-lg shadow-slate-700 font-bold hover:bg-slate-700 cursor-pointer'
            >
              Save Changes
            </button>
            <button
              type='button'
              className='w-full bg-red-500 text-white text-xs px-4 py-2 rounded-full shadow-lg shadow-slate-700 font-bold hover:bg-red-400 cursor-pointer'
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type='button'
            className='w-full bg-black text-white text-xs px-4 py-2 rounded-full shadow-lg shadow-slate-700 mt-4 font-bold hover:bg-slate-700 cursor-pointer'
            onClick={handleToggleEdit}
          >
            Edit Profile
          </button>
        )}
      </form>
      {message && <p className='mt-4 text-sm'>{message}</p>}
    </div>
  );
}
