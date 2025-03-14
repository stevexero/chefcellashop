import { User } from '@supabase/supabase-js';
import { fetchUserProfileByUserId } from '../lib/data';
import Image from 'next/image';
import AvatarUploader from './AvatarUploader';
import ProfileUpdateForm from './ProfileUpdateForm';

interface ProfileCardProps {
  user: User;
}

export default async function ProfileCard({ user }: ProfileCardProps) {
  const userProfile = await fetchUserProfileByUserId(user?.id);

  return (
    <>
      <div className='flex flex-col items-center p-12 border border-slate-300 shadow-2xl shadow-slate-700 rounded-2xl'>
        {userProfile?.avatar_url ? (
          <Image
            src={userProfile?.avatar_url}
            width={300}
            height={300}
            alt={'profile'}
            className='w-64 h-64 object-cover rounded-full border-8 border-black shadow-lg shadow-slate-700'
          />
        ) : (
          <Image
            src={
              'https://christopherscottedwards.com/wp-content/uploads/2018/07/Generic-Profile.jpg'
            }
            width={300}
            height={300}
            alt={'Generic User'}
            className='w-64 h-64 object-cover rounded-full border-8 border-black shadow-lg shadow-slate-700'
          />
        )}
        <AvatarUploader userId={userProfile?.profile_id} />
        <p className='w-full mt-8 text-sm'>
          <span className='font-bold'>Email:</span> {user?.email}
        </p>
        <ProfileUpdateForm userProfile={userProfile} />
      </div>
    </>
  );
}
