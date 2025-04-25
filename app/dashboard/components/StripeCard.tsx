import Link from 'next/link';
import { stripe } from '@/app/utils/stripe/stripe';
import Stripe from 'stripe';

export default async function StripeCard({
  userProfile,
}: {
  userProfile: { stripe_account_id: string | null };
}) {
  const acctId = userProfile.stripe_account_id;
  let stripeAcct: Stripe.Account | null = null;

  if (acctId) {
    stripeAcct = (await stripe.accounts.retrieve(acctId)) as Stripe.Account;
  }

  return (
    <div className='mt-12 p-4 border border-slate-300 shadow-xl shadow-slate-400 rounded-2xl'>
      <h3 className='text-xl font-bold mb-4'>Stripe Account Overview</h3>

      {!stripeAcct ? (
        <Link
          href='/dashboard/onboard'
          className='text-blue-600 hover:underline'
        >
          Connect your Stripe account
        </Link>
      ) : (
        <dl className='grid grid-cols-1 gap-y-3 text-sm'>
          <div className='flex justify-between'>
            <dt className='font-medium'>Account ID</dt>
            <dd>{stripeAcct.id}</dd>
          </div>

          <div className='flex justify-between'>
            <dt className='font-medium'>Type</dt>
            <dd>
              {stripeAcct.business_type === 'individual'
                ? 'Individual'
                : 'Company'}
            </dd>
          </div>

          <div className='flex justify-between'>
            <dt className='font-medium'>Connected On</dt>
            <dd>
              {stripeAcct?.created
                ? new Date(stripeAcct.created * 1000).toLocaleDateString()
                : 'N/A'}
            </dd>
          </div>

          {stripeAcct?.business_profile?.url && (
            <div className='flex justify-between'>
              <dt className='font-medium'>Website</dt>
              <dd>
                <a
                  href={stripeAcct?.business_profile.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  {new URL(stripeAcct?.business_profile.url).hostname}
                </a>
              </dd>
            </div>
          )}

          {stripeAcct.individual && (
            <div className='flex justify-between'>
              <dt className='font-medium'>Account Holder</dt>
              <dd>
                {stripeAcct.individual.first_name}{' '}
                {stripeAcct.individual.last_name}
              </dd>
            </div>
          )}

          {stripeAcct.company?.address?.city && (
            <div className='flex justify-between'>
              <dt className='font-medium'>Location</dt>
              <dd>
                {stripeAcct.company.address.city},{' '}
                {stripeAcct.company.address.state}
              </dd>
            </div>
          )}

          <div className='flex justify-between'>
            <dt className='font-medium'>Payments</dt>
            <dd>{stripeAcct.charges_enabled ? '✅ Enabled' : '❌ Disabled'}</dd>
          </div>

          <div className='flex justify-between'>
            <dt className='font-medium'>Payouts</dt>
            <dd>{stripeAcct.payouts_enabled ? '✅ Enabled' : '❌ Disabled'}</dd>
          </div>

          {(stripeAcct?.requirements?.currently_due?.length ?? 0) > 0 && (
            <div className='flex justify-between text-yellow-700'>
              <dt className='font-medium'>Next Steps</dt>
              <dd className='space-y-1'>
                <ul className='list-disc list-inside'>
                  {stripeAcct?.requirements?.currently_due?.map((f) => (
                    <li key={f}>{f.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
                <Link
                  href='/dashboard/onboard'
                  className='text-yellow-800 hover:underline'
                >
                  Complete onboarding →
                </Link>
              </dd>
            </div>
          )}

          <div className='flex justify-between'>
            <dt className='font-medium'>Default Currency</dt>
            <dd>{stripeAcct?.default_currency?.toUpperCase()}</dd>
          </div>

          {stripeAcct?.settings?.payments?.statement_descriptor && (
            <div className='flex justify-between'>
              <dt className='font-medium'>Statement Descriptor</dt>
              <dd>{stripeAcct?.settings.payments.statement_descriptor}</dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}
