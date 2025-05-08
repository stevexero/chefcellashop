import ProfileCard from '../components/ProfileCard';
import { Suspense } from 'react';
import QuickAddProduct from '../components/addProduct/QuickAddProduct';
import Orders from '../components/orders/Orders';
import { createClient } from '@/app/lib/supabase/server';
import StripeCard from '../components/StripeCard';
import { fetchUserProfileByUserId, getOrders } from '@/app/dashboard/data';
import MailCard from '../components/mail/MailCard';
import MailRequestsCard from '../components/mail/MailRequestsCard';
import CouponsList from '../components/coupons/CouponsList';
import AddCoupon from '../components/coupons/AddCoupon';
export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userProfile = await fetchUserProfileByUserId(user!.id);
  const orders = await getOrders();

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileCard user={user!} userProfile={userProfile} />
      </Suspense>
      <div className='flex flex-col col-span-2'>
        <Suspense fallback={<div>Loading...</div>}>
          <Orders orders={orders} />
        </Suspense>
        {userProfile.role === 'admin' && (
          <div className='grid grid-cols-2 gap-4'>
            <Suspense fallback={<div>Loading...</div>}>
              <MailRequestsCard />
            </Suspense>
          </div>
        )}
        <div className='w-full col-span-2'>
          <Suspense fallback={<div>Loading...</div>}>
            <CouponsList />
          </Suspense>
        </div>
      </div>
      <div className='flex flex-col'>
        <Suspense fallback={<div>Loading...</div>}>
          <QuickAddProduct user={user!} />
        </Suspense>
        {/* {!userProfile.has_mail && userProfile.role !== 'admin' && ( */}
        <Suspense fallback={<div>Loading...</div>}>
          <MailCard userProfile={userProfile} />
        </Suspense>
        {/* )} */}
        <Suspense fallback={<div>Loading...</div>}>
          <StripeCard userProfile={userProfile} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <AddCoupon />
        </Suspense>
      </div>
    </>
  );
}
