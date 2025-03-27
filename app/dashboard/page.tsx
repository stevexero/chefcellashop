import { checkAuth } from '@/app/utils/auth';
import ProfileCard from '../components/ProfileCard';
import { Suspense } from 'react';
import QuickAddProduct from '../components/addProduct/QuickAddProduct';
import Orders from '../components/dashboard/orders/Orders';

export default async function Dashboard() {
  const user = await checkAuth();

  return (
    <div className='w-full flex flex-col md:flex-row justify-center mt-12 p-4 md:p-0'>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileCard user={user} />
      </Suspense>
      <div className='flex flex-col'>
        <div className='w-full flex flex-col md:flex-row'>
          <Suspense fallback={<div>Loading...</div>}>
            <QuickAddProduct user={user} />
          </Suspense>
          <div className='w-full md:w-3/4 mt-8 md:mt-0 ml-0 md:ml-6 p-4 border border-slate-300 shadow-xl shadow-slate-400 rounded-2xl text-xs'>
            Upcoming Data
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Orders />
        </Suspense>
      </div>
    </div>
  );
}
