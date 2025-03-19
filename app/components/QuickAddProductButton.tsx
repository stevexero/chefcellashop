'use client';

import { useEffect } from 'react';
import { useClientStore } from '../store/clientStore';

interface UserProfile {
  profile_id?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at?: string;
  role?: string;
}

interface QuickAddProductButtonProps {
  userProfile: UserProfile;
}

export default function QuickAddProductButton({
  userProfile,
}: QuickAddProductButtonProps) {
  const { toggleModal } = useClientStore();

  useEffect(() => {
    console.log(userProfile?.profile_id);
  }, [userProfile]);

  return (
    <button
      className='px-6 py-4 bg-black text-white flex items-center justify-center rounded-xl hover:bg-slate-700 cursor-pointer'
      onClick={() => toggleModal('add-product-modal')}
    >
      Quick Add Product
    </button>
  );
}
