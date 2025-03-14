import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileCard from '../components/ProfileCard';
import { Suspense } from 'react';

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className='w-full flex justify-center mt-12'>
      <Suspense>
        <ProfileCard user={user} />
      </Suspense>
    </div>
  );
}
