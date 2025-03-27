import { checkAuth } from '@/app/utils/auth';
import ProfileCard from '../components/ProfileCard';
import { Suspense } from 'react';
import QuickAddProduct from '../components/addProduct/QuickAddProduct';

export default async function Dashboard() {
  const user = await checkAuth();

  return (
    <div className='w-full flex justify-center mt-12'>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileCard user={user} />
      </Suspense>
      <div className='flex flex-col'>
        <Suspense fallback={<div>Loading...</div>}>
          <QuickAddProduct user={user} />
        </Suspense>
      </div>
    </div>
  );
}
