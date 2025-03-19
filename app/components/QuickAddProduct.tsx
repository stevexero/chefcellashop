import { User } from '@supabase/supabase-js';
import { fetchUserProfileByUserId } from '../lib/data';
import QuickAddProductButton from './QuickAddProductButton';

interface QuickAddProductProps {
  user: User;
}

export default async function QuickAddProduct({ user }: QuickAddProductProps) {
  const userProfile = await fetchUserProfileByUserId(user?.id);

  if (userProfile?.role !== 'admin') {
    return;
  }

  return (
    <div className='ml-12 p-4 border border-slate-300 shadow-xl shadow-slate-400 rounded-2xl'>
      <QuickAddProductButton userProfile={userProfile} />
    </div>
  );
}
