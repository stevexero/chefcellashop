import { User } from '@supabase/supabase-js';
import { fetchUserProfileByUserId } from '../../lib/data/data';
import Image from 'next/image';
import AvatarUploader from './AvatarUploader';
import ProfileUpdateForm from '../../components/ProfileUpdateForm';
import { stripe } from '@/app/utils/stripe/stripe';
import Link from 'next/link';
import { Stripe } from 'stripe';
interface ProfileCardProps {
  user: User;
}

export default async function ProfileCard({ user }: ProfileCardProps) {
  const userProfile = await fetchUserProfileByUserId(user?.id);
  const acctId = userProfile?.stripe_account_id;

  let stripeAcct: Stripe.Response<Stripe.Account> | null = null;
  if (acctId) {
    stripeAcct = await stripe.accounts.retrieve(acctId);
  }

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
        <div className='mt-8 w-full p-4 border rounded-lg'>
          <h3 className='font-bold'>Stripe Connect</h3>

          {!acctId ? (
            <Link
              href='/dashboard/onboard'
              className='text-blue-600 hover:underline'
            >
              Connect your Stripe account
            </Link>
          ) : (
            <>
              <p>
                <strong>Payments:</strong>{' '}
                {stripeAcct?.charges_enabled ? '✅ Enabled' : '❌ Not enabled'}
              </p>
              <p>
                <strong>Payouts:</strong>{' '}
                {stripeAcct?.payouts_enabled ? '✅ Enabled' : '❌ Not enabled'}
              </p>

              {stripeAcct?.requirements?.currently_due?.length ??
                (0 > 0 && (
                  <div className='mt-2 p-2 bg-yellow-50 rounded'>
                    <p className='font-semibold text-yellow-700'>
                      We need more info:
                    </p>
                    <ul className='list-disc list-inside text-sm text-yellow-800'>
                      {stripeAcct?.requirements?.currently_due?.map(
                        (field: string) => (
                          <li key={field}>{field.replace(/_/g, ' ')}</li>
                        )
                      )}
                    </ul>
                    <Link
                      href='/dashboard/onboard'
                      className='text-yellow-800 hover:underline'
                    >
                      Complete onboarding →
                    </Link>
                  </div>
                ))}

              {stripeAcct?.requirements?.currently_due?.length ??
                (0 === 0 && !stripeAcct?.charges_enabled && (
                  <p className='text-sm text-gray-600 mt-2'>
                    Looks like everything&apos;s submitted—give Stripe a moment
                    to verify.
                  </p>
                ))}
            </>
          )}
        </div>
        <p className='w-full mt-8 text-sm'>
          <span className='font-bold'>Email:</span> {user?.email}
        </p>
        <ProfileUpdateForm userProfile={userProfile} />
      </div>
    </>
  );
}
