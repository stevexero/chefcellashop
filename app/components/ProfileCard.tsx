import { User } from '@supabase/supabase-js';
import { fetchUserProfileByUserId } from '../lib/data';
import Image from 'next/image';
import AvatarUploader from './AvatarUploader';

interface ProfileCardProps {
  user: User;
}

export default async function ProfileCard({ user }: ProfileCardProps) {
  const userProfile = await fetchUserProfileByUserId(user?.id);

  return (
    <>
      {userProfile?.avatar_url ? (
        <>
          <Image
            src={userProfile?.avatar_url}
            width={300}
            height={300}
            alt={'profile'}
            className='w-64 h-64 object-cover rounded-full'
          />
        </>
      ) : (
        <div className='w-[100px] h-[100px] bg-gray-200 flex items-center justify-center'>
          <Image
            src={
              'https://christopherscottedwards.com/wp-content/uploads/2018/07/Generic-Profile.jpg'
            }
            width={300}
            height={300}
            alt={'Generic User'}
          />
        </div>
      )}
      <AvatarUploader userId={userProfile?.profile_id} />
      <p>
        <span className='font-bold'>Email:</span> {user?.email}
      </p>
      <p>{user?.id}</p>
      <p>{userProfile.role}</p>
    </>
  );
}
