import { fetchUserProfileByUserId } from '@/app/dashboard/data';
import QuickAddProductButton from './components/QuickAddProductButton';
import { QuickAddProductProps } from '@/app/types/types';

export default async function QuickAddProduct({ user }: QuickAddProductProps) {
  const userProfile = await fetchUserProfileByUserId(user?.id);

  if (userProfile?.role !== 'admin') {
    return;
  }

  return (
    <div className='mt-12 md:mt-0 p-4 border border-slate-300 shadow-xl shadow-slate-400 rounded-2xl'>
      <QuickAddProductButton />
    </div>
  );
}
